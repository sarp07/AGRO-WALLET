import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch,
  ScrollView,
  Animated,
  Modal,
  Image,
  Clipboard,
  ImageBackground,
} from "react-native";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { WalletContext } from "../utils/WalletContext";
import { BlurView } from "expo-blur";

const Accordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [animation, setAnimation] = useState(new Animated.Value(0));

  const toggleAccordion = () => {
    const toValue = isOpen ? 0 : 1;

    Animated.timing(animation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();

    setIsOpen(!isOpen);
  };

  const arrowAngle = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["3.1416rad", "0rad"],
  });

  return (
    <View>
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={toggleAccordion}
      >
        <BlurView style={styles.glasMorpishm} intensity={20} tint="light">
          <Text style={styles.accordionHeaderText}>{title}</Text>
          <Animated.View style={{ transform: [{ rotateX: arrowAngle }] }}>
            <Entypo name="chevron-up" size={24} color="white" />
          </Animated.View>
        </BlurView>
      </TouchableOpacity>
      {isOpen && (
        <Animated.View
          style={[styles.accordionContent, { opacity: animation }]}
        >
        <BlurView style={styles.glasMorpishm} intensity={20} tint="light">
          {children}
          </BlurView>
        </Animated.View>
      )}
    </View>
  );
};

const SettingsScreen = () => {
  const {
    enable2FA,
    verify2FA,
    deploy2FA,
    disable2FA,
    isEnabled2FA,
    setIsEnabled2FA,
  } = useContext(WalletContext);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [shows2FAModal, setShows2FAModal] = useState(false);
  const [twoFactorToken, setTwoFactorToken] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [secretCode, setSecretCode] = useState("");

  const copySecretToClipboard = () => {
    Clipboard.setString(secretCode);
    Alert.alert("Copied!", "Secret code has been copied to clipboard.");
  };

  const handle2FAToggle = async () => {
    if (!isEnabled2FA) {
      const { qrCodeImageUrl, secret } = await enable2FA();
      setShow2FAModal(true);
      setQrCodeUrl(qrCodeImageUrl);
      setSecretCode(secret);
    } else {
      setShows2FAModal(true);
    }
  };

  const disable2FA_Auth = async () => {
    const data = await verify2FA(twoFactorToken);
    if (data.success) {
      Alert.alert("Success", "2FA is disabled succesfully!");
      await disable2FA();
      setShows2FAModal(false);
    } else {
      Alert.alert("Error", "Failed to verfiy 2FA code.");
    }
  };

  const verify2FACode = async () => {
    const data = await deploy2FA(twoFactorToken);
    if (data.success) {
      Alert.alert("Success", "2FA is verified successfully!");
      setShow2FAModal(false);
    } else {
      Alert.alert("Error", "Failed to verify 2FA code.");
    }
  };

  return (
    <ImageBackground
      source={require("../assets/bg.jpg")}
      style={styles.backgroud}
    >
      <ScrollView style={styles.container}>
        <Accordion title="Change Password">
          {/* Şifre değiştirme alanları */}
        </Accordion>
        <Accordion title="Set Avatar">{/* Avatar ayarlama alanı */}</Accordion>
        <Accordion title="2FA Options">
          <View style={styles.switchContainer}>
            <Text style={styles.switchText}>Two-Factor Authentication: </Text>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isEnabled2FA ? "green" : "#f4f3f4"}
              onValueChange={handle2FAToggle}
              value={isEnabled2FA}
            />
          </View>
          <Text style={styles.warningText}>
            This adds an extra layer of security to your account.
          </Text>
        </Accordion>
        <Modal
          animationType="slide"
          transparent={true}
          visible={show2FAModal}
          onRequestClose={() => setShow2FAModal(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShow2FAModal(false)}
              >
                <Ionicons name="close-circle" size={24} color="black" />
              </TouchableOpacity>
              <Text style={styles.modalText}>
                Scan this QR code with your 2FA app
              </Text>
              {qrCodeUrl ? (
                <Image style={styles.qrCode} source={{ uri: qrCodeUrl }} />
              ) : (
                <Text>No QR code available</Text>
              )}
              <TouchableOpacity
                onPress={copySecretToClipboard}
                style={styles.button}
              >
                <Text style={styles.textStyle}>Copy Secret Code</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                placeholder="Enter your 2FA code"
                value={twoFactorToken}
                onChangeText={setTwoFactorToken}
                keyboardType="numeric"
              />
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={verify2FACode}
              >
                <Text style={styles.textStyle}>Verify</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={shows2FAModal}
          onRequestClose={() => setShows2FAModal(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShows2FAModal(false)}
              >
                <Ionicons name="close-circle" size={24} color="black" />
              </TouchableOpacity>
              <Text style={styles.modalText}>
                Verify 2FA for disable 2FA protection.
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your 2FA code"
                value={twoFactorToken}
                onChangeText={setTwoFactorToken}
                keyboardType="numeric"
              />
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={disable2FA_Auth}
              >
                <Text style={styles.textStyle}>Verify</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroud: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  container: {
    flex: 1,
  },
  accordionHeader: {
    flexDirection: "1",
    alignItems: "center",
    width: "100%",
    alignSelf: "center",
  },
  glasMorpishm: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    marginTop: 10,
    borderRadius: 5,
    alignItems: "center",
    width: "85%",
    alignSelf: "center",
  },
  accordionHeaderText: {
    fontWeight: "bold",
    color: "white",
  },
  accordionContent: {
    backgroundColor: "#ECFFDC",
    padding: 15,
    width: "85%",
    alignSelf: "center",
  },
  input: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    width: "100%",
    borderColor: "green",
    borderWidth: 1,
    marginTop: 10,
  },
  button: {
    backgroundColor: "lightgreen",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  switchText: {
    fontSize: 16,
    color: "black",
  },
  warningText: {
    color: "red",
    backgroundColor: "gray",
    padding: 10,
    borderRadius: 15,
  },
  disclaimerText: {
    color: "red",
    fontSize: 14,
    marginTop: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  qrCode: {
    width: 200,
    height: 200,
    marginBottom: 15,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    top: 5,
    left: 5,
  },
});

export default SettingsScreen;

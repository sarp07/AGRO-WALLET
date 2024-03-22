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
import { Ionicons, Entypo, AntDesign } from "@expo/vector-icons";
import { WalletContext } from "../utils/WalletContext";
import { BlurView } from "expo-blur";
import { useNavigation } from "@react-navigation/native";

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
      <BlurView style={styles.glasMorpishm} intensity={20} tint="dark">
        <TouchableOpacity
          style={styles.accordionHeader}
          onPress={toggleAccordion}
        >
          <Text style={styles.accordionHeaderText}>{title}</Text>
          <Animated.View style={{ transform: [{ rotateX: arrowAngle }] }}>
            <Entypo name="chevron-up" size={24} color="white" />
          </Animated.View>
        </TouchableOpacity>
      </BlurView>
      {isOpen && (
        <Animated.View
          style={[styles.accordionContent, { opacity: animation }]}
        >
          <BlurView style={styles.accordionContent2} intensity={20} tint="dark">
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
    wallet,
    changePassword,
  } = useContext(WalletContext);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [shows2FAModal, setShows2FAModal] = useState(false);
  const [twoFactorToken, setTwoFactorToken] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [secretCode, setSecretCode] = useState("");
  const navigation = useNavigation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPrivateKey, setShowPrivateKey] = useState(false);

  const handleSubmit = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match.");
      return;
    }
    changePassword(currentPassword, newPassword);
    navigation.navigate("Dashboard");
  };

  const togglePrivateKeyVisibility = () => {
    setShowPrivateKey(!showPrivateKey);
  };

  const copyToPrivKey = () => {
    Clipboard.setString(wallet.privateKey);
    alert("Private key copied to clipboard!");
    setShowPrivateKey(false);
  };

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
        <TouchableOpacity
          style={styles.headerBox}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="leftcircle" size={22} color="white" />
          <Text style={styles.header}>Settings</Text>
        </TouchableOpacity>
        <Accordion title="Change Password">
          <View style={styles.switchContainer}>
            <Text style={styles.switchText}>Change Your Password :</Text>
          </View>
          <TextInput
        style={styles.passInput}
        placeholder="Current Password"
        placeholderTextColor="#fff"
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />
      <TextInput
        style={styles.passInput}
        placeholder="New Password"
        placeholderTextColor="#fff"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TextInput
        style={styles.passInput}
        placeholder="Confirm Password"
        placeholderTextColor="#fff"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
        </Accordion>
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
        <Accordion title="Get Private Key">
          <View style={styles.switchContainer}>
            <Text style={styles.switchText}>Private Key :</Text>
          </View>
          <View style={styles.rowContainer}>
            {showPrivateKey ? (
              <>
                <TouchableOpacity>
                  <Text style={styles.privKey}>{wallet.privateKey}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.icon} onPress={copyToPrivKey}>
                  <Ionicons name="copy-outline" size={20} color="#fff" />
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity>
                <Text style={styles.privKey2}>*****************</Text>
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={togglePrivateKeyVisibility}
          >
            <Text style={styles.buttonText}>Show Private Key</Text>
          </TouchableOpacity>
        </Accordion>
        <Modal
          animationType="slide"
          transparent={true}
          visible={show2FAModal}
          onRequestClose={() => setShow2FAModal(false)}
        >
          <BlurView style={styles.centeredView}>
            <BlurView style={styles.modalView} intensity={20} tint="dark">
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShow2FAModal(false)}
              >
                <Ionicons name="close-circle" size={24} color="white" />
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
                color="white"
              />
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={verify2FACode}
              >
                <Text style={styles.textStyle}>Verify</Text>
              </TouchableOpacity>
            </BlurView>
          </BlurView>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={shows2FAModal}
          onRequestClose={() => setShows2FAModal(false)}
        >
          <BlurView style={styles.centeredView}>
            <BlurView style={styles.modalView} intensity={20} tint="dark">
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
                color="white"
              />
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={disable2FA_Auth}
              >
                <Text style={styles.textStyle}>Verify</Text>
              </TouchableOpacity>
            </BlurView>
          </BlurView>
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
  headerBox: {
    flex: 1,
    flexDirection: "row",
    alignContent: "center",
    padding: 15,
    gap: 15,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#fff',
    fontSize: 14,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  glasMorpishm: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    marginTop: 10,
    borderRadius: 5,
    alignItems: "center",
    width: "85%",
    alignSelf: "center",
  },
  glasMorpishm2: {
    flex: 1,
    padding: 15,
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
    marginTop: 5,
    marginBottom: 15,
    backgroundColor: "transparent",
    borderRadius: 5,
    width: "85%",
    alignSelf: "center",
  },
  accordionContent2: {
    flex: 1,
    padding: 15,
    width: "100%",
    borderRadius: 10,
    alignSelf: "center",
  },
  input: {
    backgroundColor: "transparent",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    width: "100%",
    borderColor: "#fff",
    borderWidth: 1,
    marginTop: 10,
    color: "#fff",
  },
  button: {
    backgroundColor: "green",
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
    marginBottom: 15,
    marginTop: 15,
    backgroundColor: "transparent",
  },
  switchText: {
    fontSize: 16,
    color: "#fff",
  },
  warningText: {
    color: "#fff",
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  privKey: {
    color: "#fff",
    paddingRight: 45,
  },
  icon: {
    color: '#fff',
    width: '40%',
    right: 20,
    justifyContent: 'center'
  },
  privKey2: {
    color: "#fff",
  },
  passInput: {
    color: "#fff",
    backgroundColor: "transparent",
    padding: 10,
    margin: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#fff",
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
  },
  modalView: {
    margin: 20,
    backgroundColor: "transparent",
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
    color: "#fff",
    fontWeight: "bold",
  },
  qrCode: {
    width: 200,
    height: 200,
    marginBottom: 15,
    borderRadius: 10,
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

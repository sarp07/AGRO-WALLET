import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ImageBackground,
  ScrollView,
} from "react-native";
import { WalletContext } from "../utils/WalletContext";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

const LoginWalletScreen = () => {
  const { loginWallet } = useContext(WalletContext);
  const [mnemonic, setMnemonic] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const navigation = useNavigation();

  const handleLoginWallet = async () => {
    if (!mnemonic || !password || !username) {
      Alert.alert("Error", "Username, mnemonic, and password are required.");
      return;
    }
    try {
      const data = await loginWallet(mnemonic, password, username);
      Alert.alert(
        "Success",
        `Wallet loged successfully! Address: ${data.address}`
      );
      //navigation.navigate('Dashboard');
    } catch (error) {
      Alert.alert("Login Failed", error.toString());
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ImageBackground
          source={require("../assets/bg.jpg")}
          style={styles.backgroud}
        >
        <ScrollView style={styles.container2}>
            <View style={styles.innerContainer}>
              <Image
                source={require("../assets/agro_whiteLogo.png")}
                style={styles.logo}
              />
              <Text style={styles.title}>Login Your Wallet</Text>
              <Text style={styles.subTitle}>Username</Text>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
              />
              <Text style={styles.subTitle}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <BlurView
                intensity={20}
                tint="light"
                style={styles.warningContainer}
              >
                <MaterialCommunityIcons
                  name="alert-circle"
                  size={24}
                  color="lightgreen"
                />
                <Text style={styles.warningText}>
                  Important: Please write down these words in the right order.
                </Text>
              </BlurView>
              <Text style={styles.subTitle}>Mnemonic</Text>
              <TextInput
                style={styles.input}
                value={mnemonic}
                onChangeText={setMnemonic}
                secureTextEntry
              />
              <TouchableOpacity
                style={styles.button}
                onPress={handleLoginWallet}
              >
                <Text style={styles.buttonText}>Login Wallet</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </ImageBackground>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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
    padding: 0,
  },
  container2: {
    padding: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  innerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    marginVertical: 80,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
  },
  subTitle: {
    fontSize: 18,
    color: "#fff",
    padding: 10,
    //margin: 15,
  },
  input: {
    width: "100%",
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    color: "#fff",
  },
  logo: {
    width: 180,
    height: 180,
    resizeMode: "contain",
    bottom: 60,
  },
  button: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  warningContainer: {
    flexDirection: "row",
    backgroundColor: "transparent",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  warningText: {
    flex: 1,
    marginLeft: 10,
    color: "lightgreen",
    fontSize: 16,
  },
});

export default LoginWalletScreen;

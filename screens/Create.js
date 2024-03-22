import React, { useState, useContext } from "react";
import {
  Image,
  View,
  Text,
  TextInput,
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
import { useNavigation } from "@react-navigation/native";
import { WalletContext } from "../utils/WalletContext";

const CreateWalletScreen = () => {
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] =
    useState(true);
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { createUser } = useContext(WalletContext);

  const handleCreateUser = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match!");
      return;
    }
    await createUser(username, password);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ImageBackground
          source={require("../assets/bg.jpg")}
          style={styles.backgroud}
        >
          <ScrollView>
            <View style={styles.innerContainer}>
              <Image
                source={require("../assets/agro_whiteLogo.png")}
                style={styles.logo}
              />
              <Text style={styles.title}>Set Your Username</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  onChangeText={setUsername}
                  value={username}
                  placeholder="Enter an uniqe username"
                  placeholderTextColor="#fff"
                />
              </View>
              <Text style={styles.title}>Set Your Password</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  onChangeText={setPassword}
                  value={password}
                  placeholder="Enter a strong password"
                  secureTextEntry={passwordVisibility}
                  placeholderTextColor="#fff"
                />
                <TouchableOpacity
                  onPress={() => setPasswordVisibility(!passwordVisibility)}
                >
                  <Text style={styles.toggle}>
                    {passwordVisibility ? "Show" : "Hide"}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  onChangeText={setConfirmPassword}
                  value={confirmPassword}
                  placeholder="Confirm your password"
                  secureTextEntry={confirmPasswordVisibility}
                  placeholderTextColor="#fff"
                />
                <TouchableOpacity
                  onPress={() =>
                    setConfirmPasswordVisibility(!confirmPasswordVisibility)
                  }
                >
                  <Text style={styles.toggle}>
                    {confirmPasswordVisibility ? "Show" : "Hide"}
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.button}
                onPress={handleCreateUser}
              >
                <Text style={styles.buttonText}>Create Wallet</Text>
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
  },
  innerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 180,
    height: 180,
    resizeMode: "contain",
    bottom: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
  },
  inputRow: {
    flexDirection: "row",
    width: "100%",
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "space-between",
    color: "#fff",
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: "#fff",
    textDecorationColor: "#fff",
  },
  toggle: {
    color: "#fff",
    padding: 5,
    fontWeight: "bold",
  },
  button: {
    width: "100%",
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
});

export default CreateWalletScreen;

import React, { useContext, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Alert,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { WalletContext } from "../utils/WalletContext";
import { BlurView } from "expo-blur";

const VerifyMnemonicScreen = ({ route }) => {
  const { wallet } = useContext(WalletContext);
  const [userMnemonic, setUserMnemonic] = useState("");
  const navigation = useNavigation();
  const [isSucces, setisSucces] = useState(false);

  const verifyMnemonic = () => {
    if (userMnemonic.trim() === wallet.mnemonic) {
      setisSucces(true);
    } else {
      Alert.alert("Verification Failed", "The mnemonic words do not match.");
    }
  };

  return (
    <ImageBackground style={styles.main} source={require("../assets/bg.jpg")}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.innerContainer}>
            <TextInput
              style={styles.input}
              onChangeText={setUserMnemonic}
              value={userMnemonic}
              placeholder="Paste your mnemonic words here..."
              multiline
              onEndEditing={verifyMnemonic}
              placeholderTextColor= '#fff'
            />
            <TouchableOpacity
              style={[
                styles.proceedButton,
                isSucces
                  ? styles.proceedButtonActive
                  : styles.proceedButtonInactive,
              ]}
              onPress={() => {
                if (isSucces) {
                  navigation.navigate("Dashboard");
                }
              }}
              disabled={!isSucces}
            >
              <Text style={styles.proceedButtonText}>Go to Dashboard</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    padding: 20,
  },
  innerContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 5,
    padding: 15,
    fontSize: 18,
    height: 100,
    color: '#fff',
  },
  proceedButton: {
    padding: 15,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  proceedButtonInactive: {
    backgroundColor: "lightgray",
  },
  proceedButtonActive: {
    backgroundColor: "green",
  },
  proceedButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default VerifyMnemonicScreen;

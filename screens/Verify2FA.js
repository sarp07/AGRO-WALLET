import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { WalletContext } from "../utils/WalletContext";
import { useNavigation } from "@react-navigation/native";

const Verify2FAScreen = () => {
  const { verify2FA } = useContext(WalletContext);
  const [twoFactorToken, setTwoFactorToken] = useState("");
  const navigation = useNavigation();

  const handleVerify2FA = async () => {
    const data = await verify2FA(twoFactorToken);
    if (data.success) {
      Alert.alert("Success", "2FA is verified successfully!");
      navigation.navigate("Dashboard");
    } else {
      Alert.alert("Error", "Failed to verify 2FA code.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify 2FA</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your 2FA code"
        value={twoFactorToken}
        onChangeText={setTwoFactorToken}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={handleVerify2FA}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#ECFFDC",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Verify2FAScreen;

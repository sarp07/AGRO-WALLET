import React, { useState, useContext } from "react";
import { View, Text, TextInput, StyleSheet, Button, Alert, ImageBackground } from "react-native";
import { WalletContext } from "../utils/WalletContext";
import { useNavigation } from "@react-navigation/native";

const TokenImportScreen = () => {
  const { addToken, selectedNetwork } = useContext(WalletContext);
  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenDecimal, setTokenDecimal] = useState("");
  const navigation = useNavigation();

  const handleAddToken = async () => {
    try {
      await addToken(
        tokenAddress,
        selectedNetwork,
        tokenName,
        tokenSymbol,
        tokenDecimal
      );
      Alert.alert("Success", "Token has been added successfully!");
      navigation.navigate("Home");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/bg.jpg")}
      style={styles.backgroud}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Import a Token</Text>
        <TextInput
          style={styles.input}
          placeholder="Token Address"
          placeholderTextColor="#666"
          value={tokenAddress}
          onChangeText={setTokenAddress}
        />
        <TextInput
          style={styles.input}
          placeholder="Token Name"
          placeholderTextColor="#666"
          value={tokenName}
          onChangeText={setTokenName}
        />
        <TextInput
          style={styles.input}
          placeholder="Token Symbol"
          placeholderTextColor="#666"
          value={tokenSymbol}
          onChangeText={setTokenSymbol}
        />
        <TextInput
          style={styles.input}
          placeholder="Token Decimall"
          placeholderTextColor="#666"
          value={tokenDecimal}
          onChangeText={setTokenDecimal}
          keyboardType="numeric"
        />
        <Button title="Import Token" onPress={handleAddToken} color="#fff" />
      </View>
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
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    fontSize: 16,
    borderRadius: 8,
    backgroundColor: "white",
    color: "#fff",
  },
  button: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default TokenImportScreen;

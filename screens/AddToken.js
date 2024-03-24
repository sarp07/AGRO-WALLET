import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Alert,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { WalletContext } from "../utils/WalletContext";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, Ionicons } from "@expo/vector-icons";

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
        <TouchableOpacity
          style={styles.headerBox}
          onPress={() => navigation.goBack()}
        >
        <AntDesign name="leftcircle" size={22} color="white" />
          <Text style={styles.header}>Import Token</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Token Address"
          placeholderTextColor="#fff"
          value={tokenAddress}
          onChangeText={setTokenAddress}
        />
        <TextInput
          style={styles.input}
          placeholder="Token Name"
          placeholderTextColor="#fff"
          value={tokenName}
          onChangeText={setTokenName}
        />
        <TextInput
          style={styles.input}
          placeholder="Token Symbol"
          placeholderTextColor="#fff"
          value={tokenSymbol}
          onChangeText={setTokenSymbol}
        />
        <TextInput
          style={styles.input}
          placeholder="Token Decimall"
          placeholderTextColor="#fff"
          value={tokenDecimal}
          onChangeText={setTokenDecimal}
          keyboardType="numeric"
        />
        <TouchableOpacity
          style={styles.networkButton2}
          onPress={handleAddToken}
        >
          <Text style={styles.networkName}>Import</Text>
        </TouchableOpacity>
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
    marginTop: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    padding: 20,
  },
  headerBox: {
    gap: 10,
    marginVertical: 20,
    alignItems: 'center',
    flexDirection: 'row',
  },
  input: {
    height: 50,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#fff",
    padding: 10,
    fontSize: 16,
    borderRadius: 8,
    backgroundColor: "transparent",
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
  networkButton2: {
    backgroundColor: "green",
    padding: 15,
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  networkName: {
    color: "white",
    fontSize: 16,
  },
});

export default TokenImportScreen;

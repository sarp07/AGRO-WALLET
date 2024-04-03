import React, { useState, useContext } from "react";
import { View, Text, TextInput, StyleSheet, Button, Alert, ImageBackground, TouchableOpacity } from "react-native";
import { WalletContext } from "../utils/WalletContext";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";

const AddNFTScreen = () => {
  const { addNFT } = useContext(WalletContext); 
  const [nftAddress, setNftAddress] = useState("");
  const [tokenID, setTokenID] = useState("");
  const navigation = useNavigation();

  const handleAddNFT = async () => {
    try {
      await addNFT(nftAddress, tokenID); 
      navigation.navigate("Dashboard");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ImageBackground source={require("../assets/bg.jpg")} style={styles.background}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.headerBox} onPress={() => navigation.goBack()}>
          <AntDesign name="leftcircle" size={22} color="white" />
          <Text style={styles.header}>Add NFT</Text>
        </TouchableOpacity>
        <TextInput style={styles.input} placeholder="NFT Address" placeholderTextColor="#fff" value={nftAddress} onChangeText={setNftAddress} />
        <TextInput style={styles.input} placeholder="NFT TokenID" placeholderTextColor="#fff" value={tokenID} onChangeText={setTokenID} />
        <TouchableOpacity style={styles.button} onPress={handleAddNFT}>
          <Text style={styles.buttonText}>Add NFT</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    padding: 20,
    marginTop: 10,
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
    flexDirection: 'row',
    alignItems: 'center',
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
    backgroundColor: "green",
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

export default AddNFTScreen;

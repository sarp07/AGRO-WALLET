// NetworkSelectionScreen.js
import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  TextInput,
  Button,
  ImageBackground,
} from "react-native";
import { WalletContext } from "../utils/WalletContext";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

const networks = {
  mainnet: [
    "Ethereum",
    "Binance Smart Chain",
    "Polygon",
    "Avalanche",
    "Optimum",
    "Fantom",
  ],
  testnet: [
    "Goerli",
    "Sepolia",
    "Mumbai",
    "BSC-Testnet",
    "Fuji-Chain",
    "Optimism-Goerli",
    "Opera",
    "AGRO-Network",
  ],
};

const NetworkSelectionScreen = () => {
  const {
    selectedNetwork,
    selectNetwork,
    addCustomNetwork,
    listCustomNetworks,
  } = useContext(WalletContext);
  const [customNetworks, setCustomNetworks] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [networkName, setNetworkName] = useState("");
  const [currencyName, setCurrencyName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [rpcUrl, setRpcUrl] = useState("");
  const [chainId, setChainId] = useState("");
  const [decimals, setDecimals] = useState("");

  useEffect(() => {
    const fetchCustomNetworks = async () => {
      const networks = await listCustomNetworks();
      setCustomNetworks(networks);
    };
    fetchCustomNetworks();
  }, []);

  const handleAddCustomNetwork = () => {
    const networkData = {
      networkName,
      currencyName,
      symbol,
      rpcUrl,
      chainId,
      decimals,
    };
    addCustomNetwork(networkData);
    setIsModalVisible(false);
  };

  return (
    <ImageBackground
      source={require("../assets/bg.jpg")}
      style={styles.container}
    >
      <ScrollView style={styles.glassmorphicContainer}>
        <Text style={styles.header}>Select Network</Text>
        <View>
          <Text style={styles.subHeader}>Mainnet</Text>
          {networks.mainnet.map((network) => (
            <TouchableOpacity
              key={network}
              onPress={() => selectNetwork(network)}
            >
              <BlurView
                style={styles.networkButton}
                tint="light"
                intensity="20"
              >
                <Text style={styles.networkName}>{network}</Text>
              </BlurView>
            </TouchableOpacity>
          ))}
        </View>
        <View>
          <Text style={styles.subHeader}>Testnet</Text>
          {networks.testnet.map((network) => (
            <TouchableOpacity
              key={network}
              onPress={() => selectNetwork(network)}
            >
              <BlurView
                style={styles.networkButton}
                tint="light"
                intensity="20"
              >
                <Text style={styles.networkName}>{network}</Text>
              </BlurView>
            </TouchableOpacity>
          ))}
        </View>
        <View>
          <Text style={styles.subHeader}>Custom Networks</Text>
          {customNetworks.map((network, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => selectNetwork(network)}
            >
              <BlurView
                style={styles.networkButton}
                tint="light"
                intensity="20"
              >
                <Text style={styles.networkName}>{network.name}</Text>
              </BlurView>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            onPress={() => setIsModalVisible(true)}
            style={styles.networkButton2}
          >
            <Text style={styles.networkName}>Add Custom Network</Text>
          </TouchableOpacity>
        </View>
            <View style={{
              flex: 1,
              margin: 25,
            }}>
            </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => {
            setIsModalVisible(!isModalVisible);
          }}
        >
          <BlurView intensity={20} tint="dark" style={styles.blurView}>
            <View style={styles.centeredView}>
              <View>
                <BlurView intensity={20} tint="light" style={styles.modalView}>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setIsModalVisible(false)}
                  >
                    <Ionicons name="close-circle" size={24} color="white" />
                  </TouchableOpacity>
                  <TextInput
                    placeholder="Network Name"
                    onChangeText={setNetworkName}
                    value={networkName}
                    style={styles.input}
                  />
                  <TextInput
                    placeholder="Currency Name"
                    onChangeText={setCurrencyName}
                    value={currencyName}
                    style={styles.input}
                  />
                  <TextInput
                    placeholder="Symbol"
                    onChangeText={setSymbol}
                    value={symbol}
                    style={styles.input}
                  />
                  <TextInput
                    placeholder="RPC URL"
                    onChangeText={setRpcUrl}
                    value={rpcUrl}
                    style={styles.input}
                  />
                  <TextInput
                    placeholder="Chain ID"
                    onChangeText={setChainId}
                    value={chainId}
                    style={styles.input}
                  />
                  <TextInput
                    placeholder="Decimals"
                    onChangeText={setDecimals}
                    value={decimals}
                    style={styles.input}
                  />
                  <TouchableOpacity
                    title="Add Network"
                    onPress={handleAddCustomNetwork}
                  >
                    <Text style={styles.addButtons}>Add Network</Text>
                  </TouchableOpacity>
                </BlurView>
              </View>
            </View>
          </BlurView>
        </Modal>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  glassmorphicContainer: {
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
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    padding: 20,
  },
  subHeader: {
    fontSize: 18,
    color: "#fff",
    paddingLeft: 20,
    paddingTop: 10,
  },
  networkButton: {
    padding: 15,
    marginHorizontal: 20,
    marginTop: 10,
    alignItems: "center",
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
  blurView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    width: 300,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    alignSelf: "flex-end",
    position: "absolute",
    top: 10,
    color: '#fff',
    right: 10,
  },
  input: {
    width: "100%",
    margin: 13,
    borderWidth: 2,
    padding: 10,
    borderRadius: 10,
    borderColor: "#fff",
    color: "#fff",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: "#3cb371",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  closeIcon: {
    color: "#fff",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  addButtons: {
    marginTop: 20,
    marginBottom: 20,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '20'
  },
});

export default NetworkSelectionScreen;

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
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Select Network</Text>
      <View>
        <Text style={styles.subHeader}>Mainnet</Text>
        {networks.mainnet.map((network) => (
          <TouchableOpacity
            key={network}
            style={styles.networkButton}
            onPress={() => selectNetwork(network)}
          >
            <Text style={styles.networkName}>{network}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View>
        <Text style={styles.subHeader}>Testnet</Text>
        {networks.testnet.map((network) => (
          <TouchableOpacity
            key={network}
            style={styles.networkButton}
            onPress={() => selectNetwork(network)}
          >
            <Text style={styles.networkName}>{network}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View>
        <Text style={styles.subHeader}>Custom Networks</Text>
        {customNetworks.map((network, index) => (
          <TouchableOpacity
            key={index}
            style={styles.networkButton}
            onPress={() => selectNetwork(network)}
          >
            <Text style={styles.networkName}>{network.name}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.addButtonText}>Add Custom Network</Text>
        </TouchableOpacity>
        <br />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setIsModalVisible(!isModalVisible);
        }}
      >
        <BlurView intensity={100} style={styles.blurView}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Ionicons name="close-circle" size={24} color="black" />
              </TouchableOpacity>
              <TextInput
                placeholder="Network Name"
                onChangeText={setNetworkName}
                value={networkName}
              />
              <TextInput
                placeholder="Currency Name"
                onChangeText={setCurrencyName}
                value={currencyName}
              />
              <TextInput
                placeholder="Symbol"
                onChangeText={setSymbol}
                value={symbol}
              />
              <TextInput
                placeholder="RPC URL"
                onChangeText={setRpcUrl}
                value={rpcUrl}
              />
              <TextInput
                placeholder="Chain ID"
                onChangeText={setChainId}
                value={chainId}
              />
              <TextInput
                placeholder="Decimals"
                onChangeText={setDecimals}
                value={decimals}
              />
              <Button title="Add Network" onPress={handleAddCustomNetwork} />
            </View>
          </View>
        </BlurView>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ECFFDC",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "green",
    padding: 20,
  },
  subHeader: {
    fontSize: 18,
    color: "gray",
    paddingLeft: 20,
    paddingTop: 10,
  },
  networkButton: {
    backgroundColor: "lightgreen",
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
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,255,0,0.5)",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(100, 100, 100, 0.5)', // Bu arkaplan rengi biraz koyu bir blur efekti sağlar
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
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    padding: 10,
    width: 250,
  },
  addButton: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  closeButton: {
    position: "absolute",
    top: 5,
    left: 5,
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default NetworkSelectionScreen;

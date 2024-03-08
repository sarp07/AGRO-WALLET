// NetworkSelectionScreen.js
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { WalletContext } from '../utils/WalletContext';

const networks = {
  mainnet: ['Ethereum', 'Binance Smart Chain', 'Polygon', 'Avalanche', 'Optimum', 'Fantom'],
  testnet: ['Goerli', 'Sepolia', 'Mumbai', 'BSC-Testnet', 'Fuji-Chain', 'Optimism-Goerli', 'Opera', 'AGRO-Network'],
};

const NetworkSelectionScreen = () => {
  const { selectedNetwork, selectNetwork } = useContext(WalletContext);

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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECFFDC',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'green',
    padding: 20,
  },
  subHeader: {
    fontSize: 18,
    color: 'gray',
    paddingLeft: 20,
    paddingTop: 10,
  },
  networkButton: {
    backgroundColor: 'lightgreen',
    padding: 15,
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  networkName: {
    color: 'white',
    fontSize: 16,
  },
});

export default NetworkSelectionScreen;
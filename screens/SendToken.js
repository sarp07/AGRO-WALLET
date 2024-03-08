import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { WalletContext } from '../utils/WalletContext';

const SendTokenScreen = ({ route, navigation }) => {
    const { sendERC20Token } = useContext(WalletContext);
    const { tokenAddress, tokenBalance, tokenNetwork } = route.params;
    const [toAddress, setToAddress] = useState('');
    const [amount, setAmount] = useState('');

    const handleSendToken = async () => {
        try {
            await sendERC20Token(toAddress, amount, tokenAddress);
            //Alert.alert('Success', 'Token has been successfully sent');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Failed to send token');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.warning}>Important: Make sure the address and amount are correct.</Text>
            <Text>Balance: {tokenBalance}</Text>
            <TextInput
                style={styles.input}
                placeholder="To Address"
                value={toAddress}
                onChangeText={setToAddress}
            />
            <TextInput
                style={styles.input}
                placeholder="Amount"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
            />
            <Button title="Send Token" onPress={handleSendToken} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    warning: {
        color: 'red',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        marginBottom: 20,
        padding: 10,
        borderRadius: 5,
    },
});

export default SendTokenScreen;
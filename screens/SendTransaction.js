import React, { useState, useContext, useEffect } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { WalletContext } from '../utils/WalletContext';

const SendTransactionScreen = () => {
    const { sendTransaction, Balance, getTransactionFee, selectedNetwork } = useContext(WalletContext);
    const [toAddress, setToAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [feeData, setFeeData] = useState(null)

    const handleSend = async () => {
        if (!amount || !toAddress) {
            Alert.alert('Alert', 'Address and amount cannot be empty!', [{ text: 'OK' }]);
            return;
        }
        try {
            const success = await sendTransaction(toAddress, amount);
            Alert.alert('Success', 'Transaction sent successfully', [{ text: 'OK' }]);
        } catch (error) {
            Alert.alert('Error', 'Failed to send transaction', [{ text: 'OK' }]);
        }
    };

    const fetchFeeData = async () => {
        try {
            const data = await getTransactionFee(selectedNetwork);
            setFeeData(data);
        } catch (error) {
            console.error('Error fetching fee data:', error);
        }
    };

    useEffect(() => {
        if (selectedNetwork) {
            fetchFeeData();
        }
    }, [selectedNetwork]);

    const handleMaxAmount = () => {
        if (!feeData || !Balance) {
            Alert.alert('Error', 'Fee data or balance is not available. Please try again.');
            return;
        }

        const balanceInEth = (Balance);
        const gasPriceInEth = (feeData.gasPrice);

        const maxAmountToSend = balanceInEth - gasPriceInEth;

        if (maxAmountToSend < 0) {
            Alert.alert('Error', 'Insufficient balance to cover the gas fee.');
            return;
        }

        setAmount(maxAmountToSend.toString());
    };

    const handleAmountChange = (inputValue) => {
        const formattedInputValue = inputValue.replace(',', '.');
        setAmount(formattedInputValue);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <Text style={styles.title}>Send Transaction</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={[styles.input, { flex: 1 }]}
                            placeholder="To Address"
                            placeholderTextColor="#666"
                            onChangeText={setToAddress}
                            value={toAddress}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={[styles.input, { flex: 1 }]}
                            placeholder="Amount"
                            placeholderTextColor="#666"
                            onChangeText={handleAmountChange}
                            keyboardType="numeric"
                            value={amount}
                        />
                        <TouchableOpacity onPress={handleMaxAmount} style={styles.maxButton}>
                            <Text style={styles.maxButtonText}>Add Max</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.balanceContainer}>
                        <Text style={styles.balanceText}>Balance: {Balance}</Text>
                    </View>
                    <Button title="Send" onPress={handleSend} color="#006400" />
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ECFFDC',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#008000',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        width: 350,
    },
    input: {
        height: 50,
        margin: 12,
        borderWidth: 1,
        borderColor: '#A9A9A9',
        borderRadius: 10,
        padding: 10,
        backgroundColor: 'white',
        color: 'black',
    },
    maxButton: {
        backgroundColor: '#008000',
        padding: 10,
        borderRadius: 5,
    },
    maxButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    balanceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
    },
    balanceText: {
        color: '#008000',
        fontWeight: 'bold',
    },
});

export default SendTransactionScreen;
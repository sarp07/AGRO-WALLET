import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { WalletContext } from '../utils/WalletContext';

const ImportWalletScreen = () => {
    const { importWallet } = useContext(WalletContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [mnemonic, setMnemonic] = useState('');

    const handleImport = async () => {
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }
        await importWallet(username, password, mnemonic);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.innerContainer}>
                    <Image source={require('../assets/agro_logo.png')} style={styles.logo} />
                    <Text style={styles.title}>Import Your Wallet</Text>
                    <TextInput style={styles.input} value={username} onChangeText={setUsername} placeholder="Set Username" />
                    <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Set Password" secureTextEntry />
                    <TextInput style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Confirm Password" secureTextEntry />
                    <TextInput style={styles.input} value={mnemonic} onChangeText={setMnemonic} placeholder="Enter Mnemonic" secureTextEntry />
                    <TouchableOpacity style={styles.button} onPress={handleImport}>
                        <Text style={styles.buttonText}>Import Wallet</Text>
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ECFFDC'
    },
    innerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        padding: 15,
        marginBottom: 15,
    },
    logo: {
        width: 180,
        height: 180,
        resizeMode: 'contain',
        bottom: 60,
    },
    button: {
        backgroundColor: 'green',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ImportWalletScreen;
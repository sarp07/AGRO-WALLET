import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { WalletContext } from '../utils/WalletContext';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const LoginWalletScreen = () => {
    const { loginWallet } = useContext(WalletContext);
    const [mnemonic, setMnemonic] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const navigation = useNavigation();

    const handleLoginWallet = async () => {
        if (!mnemonic || !password || !username) {
            Alert.alert('Error', 'Username, mnemonic, and password are required.');
            return;
        }
        try {
            const data = await loginWallet(mnemonic, password, username);
            Alert.alert('Success', `Wallet loged successfully! Address: ${data.address}`);
            navigation.navigate('Dashboard');
        } catch (error) {
            Alert.alert('Login Failed', error.toString());
        }
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
                    <Text style={styles.title}>Login Your Wallet</Text>
                    <TextInput
                        style={styles.input}
                        value={username}
                        onChangeText={setUsername}
                        placeholder="Username"
                    />
                    <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Password"
                        secureTextEntry
                    />
                    <View style={styles.warningContainer}>
                        <MaterialCommunityIcons name="alert-circle" size={24} color="black" />
                        <Text style={styles.warningText}>
                            Important: Please write down these words in the right order.
                        </Text>
                    </View>
                    <TextInput
                        style={styles.input}
                        value={mnemonic}
                        onChangeText={setMnemonic}
                        placeholder="Mnemonic"
                        secureTextEntry
                    />
                    <TouchableOpacity style={styles.button} onPress={handleLoginWallet}>
                        <Text style={styles.buttonText}>Login Wallet</Text>
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
    warningContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFD705',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    warningText: {
        flex: 1,
        marginLeft: 10,
        color: 'gray',
        fontSize: 16,
    },
});

export default LoginWalletScreen;
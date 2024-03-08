import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Clipboard, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { WalletContext } from '../utils/WalletContext';

const GenerateWalletScreen = () => {
    const { wallet, createWallet, user } = useContext(WalletContext);
    const [isCopied, setIsCopied] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        // Kullanıcı bu ekrana geldiğinde ve wallet bilgisi yoksa cüzdan oluştur
        if (!wallet) {
            createWallet().catch(console.error);
        }
    }, [user, wallet, createWallet]);

    const handleCopyMnemonic = () => {
        if (wallet && wallet.mnemonic) {
            Clipboard.setString(wallet.mnemonic);
            setIsCopied(true);
            Alert.alert('Copied!', 'Your mnemonic has been copied to clipboard.');
        }
    };

    // Wallet bilgisi yüklenene kadar bekleyin
    if (!wallet) {
        return (
            <View style={styles.container}>
                <Text>Creating your wallet...</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.warningContainer}>
                <MaterialCommunityIcons name="alert-circle" size={24} color="black" />
                <Text style={styles.warningText}>
                    Important: Please write down or copy these words in the right order and keep them somewhere safe.
                </Text>
            </View>

            <View style={styles.mnemonicContainer}>
                <Text style={styles.mnemonic}>{wallet.mnemonic}</Text>
                <TouchableOpacity onPress={handleCopyMnemonic} style={styles.copyIcon}>
                    <MaterialCommunityIcons name="content-copy" size={24} color="black" />
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={[styles.proceedButton, isCopied ? styles.proceedButtonActive : styles.proceedButtonInactive]}
                onPress={() => {
                    if (isCopied) {
                        navigation.navigate('Approve');
                    }
                }}
                disabled={!isCopied}
            >
                <Text style={styles.proceedButtonText}>Next Step</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ECFFDC',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        gap: 100,
    },
    warningContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFD705',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    warningText: {
        flex: 1,
        marginLeft: 10,
        color: 'gray',
        fontSize: 16,
    },
    mnemonicContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'lightgray',
        padding: 35,
        borderRadius: 5,
        backgroundColor: 'lightgreen',
        width: '100%',
    },
    mnemonic: {
        fontSize: 18,
        color: 'gray',
        marginRight: 10,
    },
    copyIcon: {
        // Kopyala ikonu için stil
    },
    proceedButton: {
        padding: 15,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    proceedButtonInactive: {
        backgroundColor: 'lightgray',
    },
    proceedButtonActive: {
        backgroundColor: 'green',
    },
    proceedButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default GenerateWalletScreen;

import React, { createContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
    const [wallet, setWallet] = useState(null);
    const [selectedNetwork, setSelectedNetwork] = useState('Ethereum');
    const navigation = useNavigation();
    const [user, setUser] = useState(null);
    const [Balance, setBalance] = useState('Loading...');
    const [transactions, setTransactions] = useState([])
    const [tokens, setTokens] = useState([]);

    useEffect(() => {
        const loadNetwork = async () => {
            const savedNetwork = await AsyncStorage.getItem('selectedNetwork');
            if (savedNetwork) {
                setSelectedNetwork(JSON.parse(savedNetwork));
            }
        };

        loadNetwork();
    }, []);

    const selectNetwork = async (networkName) => {
        try {
            const response = await fetch(`http://192.168.1.106/select-network`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ networkName }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

            // Sadece ağ adını durum değişkenine kaydet
            setSelectedNetwork(networkName);

            // Gerekirse AsyncStorage'a seçilen ağ bilgisini kaydet
            await AsyncStorage.setItem('selectedNetwork', networkName);
            navigation.navigate('Dashboard');
        } catch (error) {
            console.error(error);
        }
    };

    const createUser = async (username, password) => {
        try {
            const response = await fetch(`http://192.168.1.106/create-user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to create user');
            }

            const data = await response.json();

            if (data.success) {
                await AsyncStorage.setItem('userToken', data.token);
                setUser({ username, token: data.token, address: "" });
                Alert.alert('Success', 'Success to create user');
                navigation.navigate('Generate');
                await createWallet();
            } else {
                Alert.alert('Error', 'Failed to create user');
            }
        } catch (error) {
            Alert.alert('Error', error.toString());
        }
    };

    const createWallet = async () => {
        try {
            const token = user.token;
            if (!token) {
                console.error('Token is not available');
                return;
            }

            const response = await fetch(`http://192.168.1.106/create-wallet`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to create wallet');
            }

            const data = await response.json();
            setWallet(data);
            await AsyncStorage.setItem('walletData', JSON.stringify(data));
        } catch (error) {
            Alert.alert('Error', error.toString());
        }
    };

    const sendTransaction = async (toAddress, amount) => {
        try {
            const response = await fetch(`http://192.168.1.106/send-transaction`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    senderPrivateKey: wallet.privateKey,
                    toAddress: toAddress,
                    amount: amount,
                    networkName: selectedNetwork,
                    token: user.token
                })
            });

            // Yanıtı metin olarak almak için response.text() kullanın
            const textData = await response.text();

            try {
                // Yanıtı JSON olarak ayrıştırmayı deneyin
                const data = JSON.parse(textData);
                if (!response.ok) throw new Error(data.error);
                Alert.alert('Transaction successful:', data.transactionId);
            } catch (jsonError) {
                // JSON ayrıştırma başarısız olursa, metin verisini konsola yazdırın
                console.error('JSON parsing failed', jsonError);
                console.error('Server response:', textData);
            }
        } catch (networkError) {
            console.error('Network request failed:', networkError);
        }
    };

    const listTransactions = async () => {
        try {
            const response = await fetch(`http://192.168.1.106/list-transactions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token: user.token,
                    networkName: selectedNetwork 
                })
            });

            const data = await response.json();
            if (data.success && data.transactions) {
                setTransactions(data.transactions);
                await AsyncStorage.setItem('walletData', JSON.stringify(data.transactions));
            } else {
                setTransactions([]);
            }

        } catch (error) {
            Alert.alert('Error', error.toString());
            setTransactions([]);
        }
    };

    useEffect(() => {
        if (wallet && wallet.address) {
            getBalance(wallet.address, selectedNetwork);
        }
    }, [wallet, selectedNetwork]);

    const addToken = async (tokenAddress, networkName, tokenName, tokenSymbol, tokenDecimal) => {
        try {
            const userToken = await AsyncStorage.getItem('userToken');
            const response = await fetch(`http://192.168.1.106/add-token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tokenAddress,
                    token: userToken,
                    networkName,
                    tokenName,
                    tokenSymbol,
                    tokenDecimal
                })
            });

            const data = await response.json();
            if (data.success) {
                //Alert.alert('Success', data.message);
                listTokens();
            } else {
                throw new Error(data.error || 'Failed to add token');
            }
        } catch (error) {
            1
            Alert.alert('Error', error.message || 'An error occurred while adding the token');
        }
    };

    const listTokens = async () => {
        try {
            const userToken = await AsyncStorage.getItem('userToken');
            const response = await fetch(`http://192.168.1.106/list-token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: userToken })
            });

            const data = await response.json();
            if (data.success) {
                console.log('Tokens set: ', data.tokens);
                setTokens(data.tokens);
            } else {
                throw new Error(data.error || 'Failed to fetch tokens');
            }
        } catch (error) {
            Alert.alert('Error', error.message || 'An error occurred while fetching tokens');
            // Bu satırı kaldırabilir veya aşağıdaki gibi güncelleyebilirsiniz:
            setTokens([]); // Bir hata oluştuğunda token listesini boş bir diziye ayarla
        }
    };

    useEffect(() => {
        const checkUserLoggedIn = async () => {
            const userToken = await AsyncStorage.getItem('userToken');
            if (userToken) {
                listTokens();
                if (wallet && wallet.address) {
                    getBalance(wallet.address, selectedNetwork);
                }
            }
        };

        checkUserLoggedIn();
    }, [wallet, selectedNetwork]);

    const getBalance = async (address, networkName) => {
        try {
            const response = await fetch(`http://192.168.1.106/get-balance`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address, networkName })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            setBalance(data.balance); // Bakiyeyi güncelle
        } catch (error) {
            console.error(error);
            setBalance('Error'); // Hata durumunda bakiyeyi güncelle
        }
    };

    const loginWallet = async (mnemonic, password, username) => {
        try {
            const response = await fetch(`http://192.168.1.106/login-wallet`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, mnemonic }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            const data = await response.json();

            await AsyncStorage.setItem('walletData', JSON.stringify(data));
            setWallet(data);

            if (data.token) {
                await AsyncStorage.setItem('userToken', data.token);
                setUser({ username, token: data.token, address: data.address });
            }
            return data; // Başarılı işlem sonucunu döndür
        } catch (error) {
            console.error(error);
            throw error; // Hata durumunda hatayı fırlat
        }
    };

    const importWallet = async (username, password, mnemonic) => {
        try {
            const response = await fetch('http://192.168.1.106/import-wallet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, mnemonic }),
            });
            const data = await response.json();
            if (data.success) {
                // İşlemler başarılı
                console.log('Cüzdan başarıyla içe aktarıldı:', data);
            } else {
                // Hata işleme
                console.error('Cüzdan içe aktarılırken bir hata oluştu');
            }
        } catch (error) {
            console.error('Hata:', error);
        }
    };

    const getTransactionFee = async (networkName) => {
        try {
            const response = await fetch(`http://192.168.1.106/get-transaction-fee`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ networkName }),
            });

            const data = await response.json();

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }
            return data;

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    const getTokenBalance = async (networkName, tokenAddress, walletAddress) => {
        try {
            const response = await fetch('http://192.168.1.106/get-token-balance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    networkName,
                    tokenAddress,
                    walletAddress
                })
            });
            const data = await response.json();
            if (data.success) {
                return data.balance;
            } else {
                throw new Error(data.error || 'Failed to retrieve token balance');
            }
        } catch (error) {
            console.error('Error fetching token balance: ', error);
            throw error;
        }
    };

    const sendERC20Token = async (toAddress, amount, tokenAddress) => {
        try {
            const response = await fetch(`http://192.168.1.106/send-token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fromPrivateKey: wallet.privateKey,
                    toAddress,
                    tokenAddress,
                    amount,
                    networkName: selectedNetwork,
                    userToken: user.token
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            Alert.alert('Success', `Token sent successfully: ${data.transactionId}`);
        } catch (error) {
            console.error('Error sending ERC20 Token:', error);
            Alert.alert('Error', error.toString());
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.clear();
            setWallet(null);
            setSelectedNetwork("Ethereum");
            Alert.alert('Success', 'You have been logged out.');
        } catch (error) {
            Alert.alert('Error', 'Could not log out.');
        }
    };

    return (
        <WalletContext.Provider value={{
            wallet,
            createWallet,
            createUser,
            loginWallet,
            importWallet,
            logout,
            selectedNetwork,
            selectNetwork,
            sendTransaction,
            Balance,
            getTransactionFee,
            transactions,
            listTransactions,
            addToken,
            listTokens,
            tokens,
            getTokenBalance,
            sendERC20Token
        }}>
            {children}
        </WalletContext.Provider>
    );
};
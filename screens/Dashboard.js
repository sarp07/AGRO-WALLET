import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Alert, Image, StyleSheet, Clipboard, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WalletContext } from '../utils/WalletContext';
import { useNavigation } from '@react-navigation/native';
import SideMenu from 'react-native-side-menu-updated'

const Menu = ({ onItemSelected }) => (
    <View style={styles.menu}>
        <TouchableOpacity onPress={() => onItemSelected('Networks')} style={styles.menuItem}>
            <Ionicons name="globe-outline" size={24} color="green" />
            <Text style={styles.menuItemText}>Networks</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onItemSelected('Settings')} style={styles.menuItem}>
            <Ionicons name="settings-outline" size={24} color="green" />
            <Text style={styles.menuItemText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onItemSelected('Logout')} style={styles.menuItem}>
            <Ionicons name="log-out-outline" size={24} color="red" />
            <Text style={styles.menuItemText}>Logout</Text>
        </TouchableOpacity>
    </View>
);

const DashboardScreen = () => {
    const { tokens, listTransactions, transactions, Balance, wallet, logout, selectedNetwork, getTokenBalance, user } = useContext(WalletContext);
    const navigation = useNavigation();
    const [selectedSection, setSelectedSection] = useState('Tokens');
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => setIsOpen(!isOpen);

    const handleMenuItemSelected = (selectedItem) => {
        setIsOpen(false); // Menüyü kapat
        if (selectedItem === 'Logout') {
            logout();
            navigation.navigate('Home');
        } else if (selectedItem === 'Settings') {
            navigation.navigate('Settings');
        } else if (selectedItem === 'Networks') {
            navigation.navigate('Networks');
        }
    };

    const menu = <Menu onItemSelected={handleMenuItemSelected} />;

    const handleCopyAddress = () => {
        if (wallet && wallet.address) {
            Clipboard.setString(wallet.address);
            Alert.alert('Copied!', 'Address has been copied to clipboard.');
        } else {
            Alert.alert('Error', 'No address to copy.');
        }
    };

    const formatAddress = (address) => {
        if (!address) return '0x...';
        const start = address.slice(0, 9);
        const end = address.slice(-10);
        return `${start}...${end}`;
    }

    if (!wallet) {
        return (
            <View style={styles.container}>
                <Text>Loading wallet data...</Text>
            </View>
        );
    }

    useEffect(() => {
        listTransactions();
    }, [selectedNetwork]);

    const renderContent = () => {
        switch (selectedSection) {
            case 'Tokens':
                return <TokensSection />;
            case 'NFTs':
                return <NFTsSection />;
            case 'Activity':
                return <ActivitySection />;
            default:
                return null;
        }
    };

    const shortenAddress = (address) => address ? `${address.slice(0, 4)}...${address.slice(-3)}` : '...';

    const ActivitySection = () => (
        <View style={styles.section}>
            <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>From</Text>
                <Text style={styles.tableHeaderText}>To</Text>
                <Text style={styles.tableHeaderText}>Amount</Text>
                <Text style={styles.tableHeaderText}>Hash</Text>
            </View>
            {transactions && transactions.length ? (
                transactions.map((tx, index) => {
                    if (tx.network === selectedNetwork) {
                        const formattedAmount = Number(tx.amount).toFixed(6);
                        return (
                            <View key={index} style={styles.tableRow}>
                                <Text style={styles.tableCell}>{shortenAddress(tx.fromAddress)}</Text>
                                <Text style={styles.tableCell}>{shortenAddress(tx.toAddress)}</Text>
                                <Text style={styles.tableCell}>{formattedAmount}</Text>
                                <Text style={styles.tableCell}>{shortenAddress(tx.hash)}</Text>
                            </View>
                        );
                    }
                    return null;
                })
            ) : (
                <Text style={styles.transactionText}>No Transactions found.</Text>
            )}
        </View>
    );

    const NFTsSection = () => {
        const navigateToNFTImport = () => {
            navigation.navigate('AddNFT');
        };
        return (
            <View style={styles.section}>
                {tokens && tokens.length > 0 ? (
                    tokens.map((token, index) => {
                        if (token.network === selectedNetwork) {

                            return (
                                <View key={index} style={styles.tokenItem}>
                                    <Image style={styles.tokenImg} src={token.tokenImage}></Image>
                                    <Text style={styles.tokenText}>{token.tokenName} ({token.tokenSymbol})</Text>
                                </View>
                            );
                        }
                        return null;
                    })
                ) : (
                    <View>
                        <Text style={styles.notFound}>No NFTs found.</Text>
                    </View>
                )}
                <TouchableOpacity style={styles.importButton} onPress={navigateToNFTImport}>
                    <Text style={styles.importButtonText}>Import a NFT</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const TokensSection = () => {
        const [isLoading, setIsLoading] = useState(true);
        const [tokenData, setTokenData] = useState([]);

        const fetchBalance = async (token) => {
            try {
                return await getTokenBalance(selectedNetwork, token.address, wallet.address);
            } catch (error) {
                console.error(`Error fetching balance for ${token.name}: `, error);
                return 'Error';
            }
        };

        useEffect(() => {
            const updateTokenBalances = async () => {
                if (!wallet || !wallet.address || !tokens || tokens.length === 0) {
                    setIsLoading(false);
                    return;
                }

                setIsLoading(true);

                const tokensForSelectedNetwork = tokens.filter(t => t.network === selectedNetwork);

                const tokenBalances = await Promise.all(tokensForSelectedNetwork.map(async token => {
                    const balance = await fetchBalance(token);
                    return { ...token, balance };
                }));

                setTokenData(tokenBalances);
                setIsLoading(false);
            };

            updateTokenBalances();
        }, [selectedNetwork, tokens, wallet]);

        if (isLoading) {
            return <Text style={styles.notFound}>Loading...</Text>;
        }

        return (
            <View style={styles.section}>
                {tokenData.length > 0 ? (
                    tokenData.map((token, index) => (
                        <View key={index} style={styles.tokenItem}>
                            <View>
                                <Text style={styles.tokenText}>{token.name} ({token.symbol})</Text>
                                <Text style={styles.tokenText}>
                                    {token.balance !== 'Error' ? `${token.balance} ${token.symbol}` : 'Error fetching balance'}
                                </Text>
                            </View>
                            <TouchableOpacity onPress={() => navigation.navigate('SendToken', {
                                tokenAddress: token.address,
                                tokenBalance: token.balance,
                                tokenNetwork: selectedNetwork
                            })} style={styles.sendIcon}>
                                <Ionicons name="send-outline" size={24} color="green" />
                            </TouchableOpacity>
                        </View>
                    ))
                ) : (
                    <Text style={styles.notFound}>No Tokens found.</Text>
                )}
                <TouchableOpacity style={styles.importButton} onPress={() => navigation.navigate('AddToken')}>
                    <Text style={styles.importButtonText}>Import a token</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SideMenu menu={menu} isOpen={isOpen} onChange={setIsOpen} menuPosition="right">
            <ScrollView style={styles.container}>
                <View style={styles.navbar}>
                    <Image source={require('../assets/agro_whiteLogo.png')} style={styles.logo} />
                    <Text style={styles.title}>Agro Wallet</Text>
                    <TouchableOpacity onPress={toggleMenu}>
                        <Ionicons name="menu" size={30} color="white" />
                    </TouchableOpacity>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Wallet Address</Text>
                    <View style={styles.addressContainer}>
                        <Text style={styles.address}>{formatAddress(wallet.address) || '0x...'}</Text>
                        <TouchableOpacity onPress={handleCopyAddress}>
                            <Ionicons name="copy-outline" size={24} color="gray" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.ChainContainer}>
                        <Text style={styles.chain}>
                            Active Chain:
                        </Text>
                        <Text style={styles.networkText}>
                            {selectedNetwork}
                        </Text>
                    </View>
                </View>

                <View style={styles.card}>
                    <View style={styles.addressContainer2}>
                        <View>
                            <Text style={styles.cardTitle}>Balance</Text>
                            <Text style={styles.balance}>{Balance}</Text>
                        </View>
                        <TouchableOpacity onPress={() => {
                            navigation.navigate('SendTransaction')
                        }}>
                            <Ionicons name="send-outline" size={36} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.sectionContainer}>
                    {/* Seçeneklerin her biri için TouchableOpacity ekleyin */}
                    <TouchableOpacity onPress={() => setSelectedSection('Tokens')}>
                        <Text style={styles.sectionTitle}>Tokens</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSelectedSection('NFTs')}>
                        <Text style={styles.sectionTitle}>NFTs</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSelectedSection('Activity')}>
                        <Text style={styles.sectionTitle}>Activity</Text>
                    </TouchableOpacity>
                </View>

                {renderContent()}
            </ScrollView>
        </SideMenu>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ECFFDC',
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'green',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    title: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
    },
    logo: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
    },
    networkButton: {
        backgroundColor: 'lightgreen',
        padding: 8,
        borderRadius: 5,
    },
    networkText: {
        color: 'white',
        fontSize: 16,
    },
    card: {
        backgroundColor: 'lightgreen',
        borderRadius: 10,
        padding: 20,
        margin: 15,
    },
    cardTitle: {
        color: 'gray',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    addressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        padding: 10,
    },
    addressContainer2: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'transparent',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    address: {
        color: 'gray',
        fontSize: 16,
    },
    balance: {
        color: 'gray',
        fontSize: 24,
        fontWeight: 'bold',
    },
    sectionContainer: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 55,
        marginTop: 45,
    },
    section: {
        backgroundColor: '#ECFFDC',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        paddingTop: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'green',
    },
    logoutButton: {
        marginTop: 10,
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoutButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    settingsButton: {
        marginTop: 10,
        backgroundColor: 'gray',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    settingsButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        paddingBottom: 4,
    },
    tableHeaderText: {
        flex: 1,
        fontWeight: 'bold',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        paddingVertical: 4,
    },
    tableCell: {
        flex: 1,
    },
    tokenItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        padding: 15,
        borderRadius: 10,
    },
    tokenText: {
        color: 'green',
        fontSize: 18,
    },
    notFound: {
        textAlign: 'center',
        color: 'grey',
        marginBottom: 10,
    },
    importButton: {
        backgroundColor: 'gray',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    importButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    menu: {
        flex: 1,
        width: 250,
        backgroundColor: 'lightgreen',
        paddingTop: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'green',
    },
    menuItemText: {
        marginLeft: 20,
        fontSize: 18,
        color: 'white',
    },
    ChainContainer: {
        backgroundColor: 'white',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
    },
    chain: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'green', // Metin için uyumlu bir renk
    },
    networkText: {
        fontSize: 18,
        color: 'gray', // Seçilen ağ için uyumlu bir renk
    },
});

export default DashboardScreen;

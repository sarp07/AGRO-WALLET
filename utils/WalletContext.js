import React, { createContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [wallet, setWallet] = useState(null);
  const [selectedNetwork, setSelectedNetwork] = useState("Ethereum");
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [Balance, setBalance] = useState("Loading...");
  const [transactions, setTransactions] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [isEnabled2FA, setIsEnabled2FA] = useState(false);
  const BASE_URL = "https://api.agrotest.online";
  useEffect(() => {
    const loadNetwork = async () => {
      const savedNetwork = await AsyncStorage.getItem("selectedNetwork");
      if (savedNetwork) {
        setSelectedNetwork(JSON.parse(savedNetwork));
      }
    };

    loadNetwork();
  }, []);

  const selectNetwork = async (networkName) => {
    try {
      const response = await fetch(`${BASE_URL}/select-network`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ networkName }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setSelectedNetwork(networkName);

      await AsyncStorage.setItem("selectedNetwork", networkName);
      navigation.navigate("Dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    const token = user.token;
    
    try {
      const response = await fetch(`${BASE_URL}/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          currentPassword,
          newPassword,
        }),
      });
  
      const data = await response.text();
      if (!response.ok) {
        throw new Error(data || "Password change failed");
      }
  
      Alert.alert("Success", "Password successfully changed");
    } catch (error) {
      console.error("Error changing password:", error);
      Alert.alert("Error", error.toString());
    }
  };

  useEffect(() => {
    const check2FAStatus = async () => {
      const userToken = await AsyncStorage.getItem("userToken");
      if (userToken) {
        try {
          const response = await fetch(`${BASE_URL}/check-2fa`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: userToken }),
          });

          const data = await response.json();
          console.log("Check 2FA Response Data:", data);

          if (response.ok) {
            setIsEnabled2FA(data.twoFactorEnabled);
            await AsyncStorage.setItem(
              "isEnabled2FA",
              JSON.stringify(data.twoFactorEnabled)
            );
          } else {
            throw new Error(
              data.message || "2FA status could not be retrieved"
            );
          }
        } catch (error) {
          console.error("Error during 2FA check:", error);
          Alert.alert("Error", "Failed to check 2FA status");
        }
      }
    };

    check2FAStatus();
  }, []);

  const createUser = async (username, password) => {
    try {
      const response = await fetch(`${BASE_URL}/create-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to create user");
      }

      const data = await response.json();

      if (data.success) {
        await AsyncStorage.setItem("userToken", data.token);
        setUser({ username, token: data.token, address: "" });
        Alert.alert("Success", "Success to create user");
        navigation.navigate("Generate");
        await createWallet();
      } else {
        Alert.alert("Error", "Failed to create user");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const createWallet = async () => {
    try {
      const token = user.token;
      if (!token) {
        console.error("Token is not available");
        return;
      }

      const response = await fetch(`${BASE_URL}/create-wallet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to create wallet");
      }

      const data = await response.json();
      setWallet(data);
      await AsyncStorage.setItem("walletData", JSON.stringify(data));
    } catch (error) {
      console.error(error);
    }
  };


const addCustomNetwork = async (networkData) => {
  const token = user.token;
  try {
    const response = await fetch(`${BASE_URL}/add-custom-network`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...networkData, token }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Custom network could not be added');
    }
    alert('Custom network added successfully!');
  } catch (error) {
    console.error(error);
    alert('Failed to add custom network');
  }
};

const listCustomNetworks = async () => {
  const token = user.token;
  try {
    const response = await fetch(`${BASE_URL}/select-custom-network`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch custom networks');
    }
    return data.customNetworks;
  } catch (error) {
    console.error(error);
    alert('Failed to fetch custom networks');
    return [];
  }
};

  const sendTransaction = async (toAddress, amount) => {
    try {
      const response = await fetch(`${BASE_URL}/send-transaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderPrivateKey: wallet.privateKey,
          toAddress: toAddress,
          amount: amount,
          networkName: selectedNetwork,
          token: user.token,
        }),
      });

      const textData = await response.text();

      try {
        const data = JSON.parse(textData);
        if (!response.ok) throw new Error(data.error);
        Alert.alert("Transaction successful:", data.transactionId);
      } catch (jsonError) {
        console.error("JSON parsing failed", jsonError);
        console.error("Server response:", textData);
      }
    } catch (networkError) {
      console.error("Network request failed:", networkError);
    }
  };

  const listTransactions = async () => {
    try {
      const response = await fetch(`${BASE_URL}/list-transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: user.token,
          networkName: selectedNetwork,
        }),
      });

      const data = await response.json();
      if (data.success && data.transactions) {
        setTransactions(data.transactions);
        await AsyncStorage.setItem(
          "walletData",
          JSON.stringify(data.transactions)
        );
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.error(error);
      setTransactions([]);
    }
  };

  useEffect(() => {
    if (wallet && wallet.address) {
      getBalance(wallet.address, selectedNetwork);
    }
  }, [wallet, selectedNetwork]);

  const addToken = async (
    tokenAddress,
    networkName,
    tokenName,
    tokenSymbol,
    tokenDecimal
  ) => {
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      const response = await fetch(`${BASE_URL}/add-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tokenAddress,
          token: userToken,
          networkName,
          tokenName,
          tokenSymbol,
          tokenDecimal,
        }),
      });

      const data = await response.json();
      if (data.success) {
        listTokens();
      } else {
        throw new Error(data.error || "Failed to add token");
      }
    } catch (error) {
      1;
      Alert.alert(
        "Error",
        error.message || "An error occurred while adding the token"
      );
    }
  };

  const listTokens = async () => {
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      const response = await fetch(`${BASE_URL}/list-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: userToken }),
      });

      const data = await response.json();
      if (data.success) {
        console.log("Tokens set: ", data.tokens);
        setTokens(data.tokens);
      } else {
        throw new Error(data.error || "Failed to fetch tokens");
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error.message || "An error occurred while fetching tokens"
      );
      setTokens([]);
    }
  };

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const userToken = await AsyncStorage.getItem("userToken");
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
      const response = await fetch(`${BASE_URL}/get-balance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, networkName }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setBalance(data.balance);
    } catch (error) {
      console.error(error);
      setBalance("Error");
    }
  };

  const loginWallet = async (mnemonic, password, username) => {
    try {
      const response = await fetch(`${BASE_URL}/login-wallet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, mnemonic }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const data = await response.json();
      await AsyncStorage.setItem("walletData", JSON.stringify(data));
      setWallet(data);

      if (data.token) {
        await AsyncStorage.setItem("userToken", data.token);
        setUser({ username, token: data.token, address: data.address });

        navigation.navigate(isEnabled2FA ? "Verify2FA" : "Dashboard");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const importWallet = async (username, password, mnemonic) => {
    try {
      const response = await fetch(`${BASE_URL}/import-wallet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, mnemonic }),
      });
      const data = await response.json();
      if (data.success) {
        console.log("Cüzdan başarıyla içe aktarıldı:", data);
      } else {
        console.error("Cüzdan içe aktarılırken bir hata oluştu");
      }
    } catch (error) {
      console.error("Hata:", error);
    }
  };

  const getTransactionFee = async () => {
    try {
      const response = await fetch(`${BASE_URL}/get-transaction-fee`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ "networkName": selectedNetwork }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Sunucu hatası:", errorText);
        throw new Error(`Sunucu hatası: ${response.status}`);
      } else {
        console.log(data);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("İstek hatası:", error);
      throw error;
    }
  };  

  const getTokenBalance = async (networkName, tokenAddress, walletAddress) => {
    try {
      const response = await fetch(`${BASE_URL}/get-token-balance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          networkName,
          tokenAddress,
          walletAddress,
        }),
      });
      const data = await response.json();
      if (data.success) {
        return data.balance;
      } else {
        throw new Error(data.error || "Failed to retrieve token balance");
      }
    } catch (error) {
      console.error("Error fetching token balance: ", error);
      throw error;
    }
  };

  const sendERC20Token = async (toAddress, amount, tokenAddress) => {
    try {
      const response = await fetch(`${BASE_URL}/send-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromPrivateKey: wallet.privateKey,
          toAddress,
          tokenAddress,
          amount,
          networkName: selectedNetwork,
          userToken: user.token,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      Alert.alert("Success", `Token sent successfully: ${data.transactionId}`);
    } catch (error) {
      console.error("Error sending ERC20 Token:", error);
      Alert.alert("Error", error.toString());
    }
  };

  const enable2FA = async () => {
    const token = await AsyncStorage.getItem("userToken");
    console.log("2FA Etkinleştiriliyor...");
    try {
      const response = await fetch(`${BASE_URL}/enable-2fa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      console.log("2FA Başarıyla Etkinleştirildi! ");
      setIsEnabled2FA(true);
      await AsyncStorage.setItem("isEnabled2FA", "true");
      return data;
    } catch (error) {
      console.error("2FA Etkinleştirme Hatası: ", error);
    }
  };

  const deploy2FA = async (twoFactorToken) => {
    const token = await AsyncStorage.getItem("userToken");
    console.log("2FA Etkinleştiriliyor...");
    try {
      const response = await fetch(`${BASE_URL}/deploy-2fa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, twoFactorToken }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      console.log("2FA Başarıyla Etkinleştirildi: ", data);
      setIsEnabled2FA(true);
      await AsyncStorage.setItem("isEnabled2FA", "true");
      return data;
    } catch (error) {
      console.error("2FA Etkinleştirme Hatası: ", error);
      return { success: false, error: error.message };
    }
  };

  const verify2FA = async (twoFactorToken) => {
    const token = await AsyncStorage.getItem("userToken");
    console.log("2FA Doğrulanıyor...");
    try {
      const response = await fetch(`${BASE_URL}/verify-2fa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, twoFactorToken }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      console.log("2FA Başarıyla Doğrulandı: ", data);
      return data;
    } catch (error) {
      console.error("2FA Doğrulama Hatası: ", error);
    }
  };

  const disable2FA = async () => {
    const token = await AsyncStorage.getItem("userToken");
    console.log("2FA Devre Dışı Bırakılıyor...");
    try {
      const response = await fetch(`${BASE_URL}/disable-2fa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      console.log("2FA Başarıyla Devre Dışı Bırakıldı: ", data);
      setIsEnabled2FA(false);
      await AsyncStorage.setItem("isEnabled2FA", "false");
      return data;
    } catch (error) {
      console.error("2FA Devre Dışı Bırakma Hatası: ", error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.clear();
      setWallet(null);
      setSelectedNetwork("Ethereum");
      Alert.alert("Success", "You have been logged out.");
    } catch (error) {
      Alert.alert("Error", "Could not log out.");
    }
  };

  return (
    <WalletContext.Provider
      value={{
        wallet,
        createWallet,
        createUser,
        loginWallet,
        importWallet,
        logout,
        changePassword,
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
        sendERC20Token,
        enable2FA,
        disable2FA,
        verify2FA,
        deploy2FA,
        getBalance,
        isEnabled2FA,
        setIsEnabled2FA,
        listCustomNetworks,
        addCustomNetwork,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

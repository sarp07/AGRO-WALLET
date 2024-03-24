import React, { useState, useContext, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
  SafeAreaView,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { WalletContext } from "../utils/WalletContext";
import { BlurView } from "expo-blur";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, Ionicons } from "@expo/vector-icons";

const SendTransactionScreen = () => {
  const {
    sendTransaction,
    Balance,
    getTransactionFee,
    selectedNetwork,
    isEnabled2FA,
    verify2FA,
  } = useContext(WalletContext);
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [feeData, setFeeData] = useState(null);
  const [is2FAModalVisible, setIs2FAModalVisible] = useState(false);
  const [twoFACode, setTwoFACode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const handleSend = async () => {
    if (!amount || !toAddress) {
      Alert.alert("Alert", "Address and amount cannot be empty!", [
        { text: "OK" },
      ]);
      return;
    }
    if (isEnabled2FA) {
      setIs2FAModalVisible(true);
    } else {
      setIsLoading(true);
      await completeTransaction();
      navigation.navigate('Dashboard');
    }
  };

  const completeTransaction = async () => {
    try {
      if (!isValidEthereumAddress(toAddress)) {
        Alert.alert("Invalid Address", "The address you entered is not a valid wallet address.");
        setIsLoading(false);
        return;
      }
      const success = await sendTransaction(toAddress, amount);
      if (success) {
        Alert.alert("Success", "Transaction sent successfully", [
          { text: "OK" },
        ]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to send transaction", [{ text: "OK" }]);
    }
    setIsLoading(false);
    setIs2FAModalVisible(false);
  };

  const isValidEthereumAddress = (address) => {
    const re = /^0x[a-fA-F0-9]{40}$/;
    return re.test(address);
  };

  const verifyAndSend = async () => {
    const success = await verify2FA(twoFACode);
    if (success) {
      setIsLoading(true);
      await completeTransaction();
      navigation.navigate("Dashboard");
    } else {
      Alert.alert("Error", "2FA Code is incorrect", [{ text: "OK" }]);
      setIsLoading(false);
    }
  };

  const fetchFeeData = async () => {
    setIsLoading(true);
    try {
      let data;
      if (selectedNetwork === 'BSC-Testnet') {
        data = { gasPrice: '0.00009' };
      } else {
        data = await getTransactionFee();
      }
      setFeeData(data);
    } catch (error) {
      console.error("Error fetching fee data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedNetwork) {
      fetchFeeData();
    }
  }, [selectedNetwork]);

  const handleMaxAmount = () => {
    if (isLoading || !feeData || !Balance) {
      Alert.alert("Error", "Please wait for the data to load or try again.");
      return;
    }

    const balanceInEth = parseFloat(Balance);
    const gasPriceInEth = parseFloat(feeData.gasPrice);

    const maxAmountToSend = balanceInEth - gasPriceInEth;

    if (maxAmountToSend < 0) {
      Alert.alert("Error", "Insufficient balance to cover the gas fee.");
      return;
    }

    setAmount(maxAmountToSend.toString());
  };

  const handleAmountChange = (inputValue) => {
    const formattedInputValue = inputValue.replace(",", ".");
    setAmount(formattedInputValue);
  };

  return (
    <ImageBackground
      style={styles.container}
      source={require("../assets/bg.jpg")}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View>
            <View style={styles.container}>
              <TouchableOpacity
                style={styles.headerBox}
                onPress={() => navigation.goBack()}
              >
                <AntDesign name="leftcircle" size={22} color="white" />
              </TouchableOpacity>
              <Text style={styles.title}>Send Transaction</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="To Address"
                  placeholderTextColor="#fff"
                  onChangeText={setToAddress}
                  value={toAddress}
                />
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Amount"
                  placeholderTextColor="#fff"
                  onChangeText={handleAmountChange}
                  keyboardType="numeric"
                  value={amount}
                />
                <TouchableOpacity onPress={handleMaxAmount}>
                  <Text style={styles.maxButtonText}>Add Max</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.balanceContainer}>
                <Text style={styles.balanceText}>Balance: {Balance}</Text>
              </View>
              <TouchableOpacity
                onPress={handleSend}
                style={styles.sendButton}
              >
                <Text style={styles.maxButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
            <Modal
              animationType="slide"
              transparent={true}
              visible={is2FAModalVisible}
            >
              <BlurView intensity={20} tint="dark" style={styles.modalBackground}>
                <BlurView intensity={20} tint="dark" style={styles.modalContainer}>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setIs2FAModalVisible(false)}
                  >
                    <Ionicons name="close-circle" size={24} color="white" />
                  </TouchableOpacity>
                  <Text style={styles.modalText}>Enter 2FA Code</Text>
                  <SafeAreaView style={styles.modalView}>
                    {isLoading ? (
                      <ActivityIndicator
                        size="large"
                        color="#fff"
                        backgroundColor="transparent"
                      />
                    ) : (
                      <>
                        <TextInput
                          style={styles.input}
                          placeholder="Enter 2FA Code"
                          onChangeText={setTwoFACode}
                          placeholderTextColor='#fff'
                          value={twoFACode}
                          keyboardType="numeric"
                        />
                        <Button
                          title="Verify"
                          onPress={verifyAndSend}
                          color="white"
                        />
                      </>
                    )}
                  </SafeAreaView>
                </BlurView>
              </BlurView>
            </Modal>
            <Modal
              animationType="slide"
              transparent={true}
              visible={isLoading}
            >
              <BlurView intensity={20} tint="dark" style={styles.modalBackground}>
                <ActivityIndicator
                  size="large"
                  color="#fff"
                />
              </BlurView>
            </Modal>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    width: 350,
  },
  headerBox: {
    position: "absolute",
    left: 8,
    flexDirection: "row",
    top: 65,
  },
  input: {
    height: 50,
    margin: 12,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "transparent",
    color: "#fff",
  },
  maxButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
  },
  sendButton: {
    backgroundColor: "green",
    paddingHorizontal: 50,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  maxButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  balanceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  balanceText: {
    color: "#fff",
    flex: 1,
    left: 0,
    fontWeight: "bold",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%"
  },
  modalText: {
    textAlign: "center",
    color: "#fff",
  },
  modalView: {
    margin: 20,
    backgroundColor: "transparent",
    borderRadius: 20,
    padding: 55,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalContainer: {
    width: "80%",
    padding: 20,
    borderRadius: 20,
    elevation: 20,
    shadowColor: "#000",
    borderRadius: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 15,
    left: 15,
  },
});

export default SendTransactionScreen;

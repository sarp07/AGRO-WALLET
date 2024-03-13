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
} from "react-native";
import { WalletContext } from "../utils/WalletContext";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

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
      await completeTransaction();
    }
  };

  const completeTransaction = async () => {
    setIsLoading(true); // Yükleme başladı
    try {
      const success = await sendTransaction(toAddress, amount);
      if (success) {
        Alert.alert("Success", "Transaction sent successfully", [
          { text: "OK" },
        ]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to send transaction", [{ text: "OK" }]);
    }
    setIsLoading(false); // Yükleme bitti
    setIs2FAModalVisible(false); // Modalı kapat
  };

  const verifyAndSend = async () => {
    setIsLoading(true); // Yükleme başladı
    const success = await verify2FA(twoFACode);
    if (success) {
      await completeTransaction();
      navigation.navigate("Dashboard");
    } else {
      Alert.alert("Error", "2FA Code is incorrect", [{ text: "OK" }]);
      setIsLoading(false);
    }
  };

  const fetchFeeData = async () => {
    try {
      const data = await getTransactionFee(selectedNetwork);
      setFeeData(data);
    } catch (error) {
      console.error("Error fetching fee data:", error);
    }
  };

  useEffect(() => {
    if (selectedNetwork) {
      fetchFeeData();
    }
  }, [selectedNetwork]);

  const handleMaxAmount = () => {
    if (!feeData || !Balance) {
      Alert.alert(
        "Error",
        "Fee data or balance is not available. Please try again."
      );
      return;
    }

    const balanceInEth = Balance;
    const gasPriceInEth = feeData.gasPrice;

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
            <TouchableOpacity
              onPress={handleMaxAmount}
              style={styles.maxButton}
            >
              <Text style={styles.maxButtonText}>Add Max</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceText}>Balance: {Balance}</Text>
          </View>
          <Button title="Send" onPress={handleSend} color="#008000" />
          <Modal
            animationType="slide"
            transparent={true}
            visible={is2FAModalVisible}
          >
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                <LinearGradient colors={["#blue", "#green"]}>
                  <SafeAreaView style={styles.modalView}>
                    {isLoading ? (
                      <ActivityIndicator
                        size="large"
                        color="#008000"
                        backgroundColor="#ECFFDC"
                      />
                    ) : (
                      <>
                        <TextInput
                          style={styles.input}
                          placeholder="Enter 2FA Code"
                          onChangeText={setTwoFACode}
                          value={twoFACode}
                          keyboardType="numeric"
                        />
                        <Button
                          title="Verify and Send"
                          onPress={verifyAndSend}
                        />
                        <Button
                          title="Cancel"
                          color="red"
                          onPress={() => setIs2FAModalVisible(false)}
                        />
                      </>
                    )}
                  </SafeAreaView>
                </LinearGradient>
              </View>
            </View>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ECFFDC",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#008000",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    width: 350,
  },
  input: {
    height: 50,
    margin: 12,
    borderWidth: 1,
    borderColor: "#A9A9A9",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "white",
    color: "black",
  },
  maxButton: {
    backgroundColor: "#008000",
    padding: 10,
    borderRadius: 5,
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
    color: "#008000",
    flex: 1,
    float: "left",
    fontWeight: "bold",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 255, 0, 0.2)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
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
    backgroundColor: "white", 
    padding: 20, 
    borderRadius: 20, 
    elevation: 20, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.25, 
    shadowRadius: 3.84, 
    alignItems: "center", 
  },
});

export default SendTransactionScreen;

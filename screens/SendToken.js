import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { WalletContext } from '../utils/WalletContext';
import { BlurView } from 'expo-blur';
import { AntDesign, Ionicons } from '@expo/vector-icons';

const SendTokenScreen = ({ route, navigation }) => {
  const { sendERC20Token, isEnabled2FA, verify2FA } = useContext(WalletContext);
  const { tokenAddress, tokenBalance, tokenNetwork } = route.params;
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [is2FAModalVisible, setIs2FAModalVisible] = useState(false);
  const [twoFACode, setTwoFACode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendToken = async () => {
    if (!amount || !toAddress) {
      Alert.alert('Error', 'Address and amount cannot be empty');
      return;
    }
    if (isEnabled2FA) {
      setIs2FAModalVisible(true);
    } else {
      await completeTransaction();
    }
  };

  const completeTransaction = async () => {
    setIsLoading(true);
    try {
      await sendERC20Token(toAddress, amount, tokenAddress);
      Alert.alert('Success', 'Token has been successfully sent');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to send token');
    }
    setIsLoading(false);
    setIs2FAModalVisible(false);
  };

  const verifyAndSend = async () => {
    setIsLoading(true);
    const success = await verify2FA(twoFACode);
    if (success) {
      await completeTransaction();
    } else {
      Alert.alert('Error', '2FA Code is incorrect');
      setIsLoading(false);
    }
  };

  const handleMaxAmount = () => {
    setAmount(tokenBalance);
  };

  return (
    <ImageBackground
      style={styles.container}
      source={require('../assets/bg.jpg')}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <TouchableOpacity
              style={styles.headerBox}
              onPress={() => navigation.goBack()}
            >
              <AntDesign name="leftcircle" size={22} color="white" />
            </TouchableOpacity>
            <Text style={styles.title}>Send Token</Text>
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
                keyboardType="numeric"
                onChangeText={setAmount}
                value={amount}
              />
              <TouchableOpacity
                onPress={handleMaxAmount}
              >
                <Text style={styles.maxButtonText}>Add Max</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.balanceText}>Balance: {tokenBalance}</Text>
            <TouchableOpacity
              onPress={handleSendToken}
              style={styles.sendButton}
            >
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>

            <Modal
              animationType="slide"
              transparent={true}
              visible={is2FAModalVisible}
            >
              <BlurView intensity={20} tint='dark' style={styles.blurView}>
                <BlurView intensity={20} tint='dark' style={styles.modalView}>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setIs2FAModalVisible(false)}
                  >
                    <Ionicons name="close-circle" size={24} color="white" />
                  </TouchableOpacity>
                  <Text style={styles.modalText}>Enter 2FA Code</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="2FA Code"
                    placeholderTextColor="#fff"
                    onChangeText={setTwoFACode}
                    value={twoFACode}
                    keyboardType="numeric"
                  />
                  <TouchableOpacity
                    onPress={verifyAndSend}
                    style={styles.modalSendButton}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.modalSendButtonText}>Verify</Text>
                    )}
                  </TouchableOpacity>
                </BlurView>
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
  headerBox: {
    position: 'absolute',
    left: 8,
    flexDirection: 'row',
    top: 25,
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
  balanceText: {
    color: "#fff",
    marginLeft: 20,
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'left',
    alignSelf: 'flex-start', 
    width: '100%',
  },
  sendButton: {
    backgroundColor: "green",
    paddingHorizontal: 50,
    paddingVertical: 10,
    borderRadius: 5,
  },
  sendButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  maxButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  blurView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    backgroundColor: 'transparent',
    padding: 55,
    paddingHorizontal: 85,
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
  closeButton: {
    position: "absolute",
    top: 15,
    left: 15,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    color: "#fff",
  },
  modalInput: {
    width: "80%",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderRadius: 10,
    color: "#333",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 20,
    borderColor: '#fff'
  },
  modalSendButton: {
    borderRadius: 5,
    padding: 10,
    paddingHorizontal: 20,
    elevation: 2,
    backgroundColor: "green",
  },
  modalSendButtonText: {
    color: "white",
  },
});

export default SendTokenScreen;

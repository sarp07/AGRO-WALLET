import React from 'react';
import { Image } from 'react-native';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Home() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image source={require('../assets/agro_logo.png')} style={styles.logo} />
      <Text style={styles.title}>AGRO WALLET</Text>
      <Text style={styles.subtitle}>Welcome to your AGRO Mobile Wallet!</Text>
      <TouchableOpacity style={styles.button1} onPress={() => navigation.navigate('Create')}>
        <Text style={styles.buttonText}>Create Wallet</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button2} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Login Wallet</Text>
      </TouchableOpacity>
      <View style={styles.redirectContainer}>
        <Text style={styles.redirectText}>
          Don't have an account and want to import another wallet?
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Import')}>
          <Text style={styles.redirectLink}>Click Here</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECFFDC',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 120,
  },
  logo: {
    width: '55%',
    height: '55%',
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginHorizontal: 40,
    marginBottom: 30,
  },
  button1: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '80%',
    marginBottom: 20,
  },
  button2: {
    backgroundColor: 'lightgreen',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  redirectContainer: {
    width: 300,
    marginTop: 20,
    alignItems: 'center',
  },
  redirectText: {
    color: 'gray',
    textAlign: 'center',
  },
  redirectLink: {
    color: 'blue',
    fontWeight: 'bold',
    marginTop: 5,
  },
});


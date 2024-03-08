import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Switch, ScrollView, Animated  } from 'react-native';
import { Ionicons, Entypo } from '@expo/vector-icons';

const Accordion = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [animation, setAnimation] = useState(new Animated.Value(0));

    const toggleAccordion = () => {
        const toValue = isOpen ? 0 : 1;

        Animated.timing(animation, {
            toValue,
            duration: 300,
            useNativeDriver: false,
        }).start();

        setIsOpen(!isOpen);
    };

    const arrowAngle = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['3.1416rad', '0rad'],
    });

    return (
        <View>
            <TouchableOpacity style={styles.accordionHeader} onPress={toggleAccordion}>
                <Text style={styles.accordionHeaderText}>{title}</Text>
                <Animated.View style={{ transform: [{ rotateX: arrowAngle }] }}>
                    <Entypo  name="chevron-up" size={24} color="white" />
                </Animated.View>
            </TouchableOpacity>
            {isOpen && <Animated.View style={[styles.accordionContent, { opacity: animation }]}>{children}</Animated.View>}
        </View>
    );
};

const SettingsScreen = () => {
    const [isEnabled2FA, setIsEnabled2FA] = useState(false);

    return (
        <ScrollView style={styles.container}>
            <Accordion title="Change Password">
                <TextInput style={styles.input} placeholder="Current Password" secureTextEntry />
                <TextInput style={styles.input} placeholder="New Password" secureTextEntry />
                <TextInput style={styles.input} placeholder="Confirm New Password" secureTextEntry />
            </Accordion>
            <Accordion title="Set Avatar">
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Upload New Avatar</Text>
                </TouchableOpacity>
            </Accordion>
            <Accordion title="2FA Options">
                <View style={styles.switchContainer}>
                    <Text style={styles.switchText}>Two-Factor Authentication: </Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={isEnabled2FA ? "green" : "#f4f3f4"}
                        onValueChange={() => setIsEnabled2FA(previousState => !previousState)}
                        value={isEnabled2FA}
                    />
                </View>
                <Text style={styles.warningText}>This adds an extra layer of security to your account.</Text>
            </Accordion>
            <Accordion title="Private Key">
                <Text style={styles.disclaimerText}>Your private key is extremely sensitive information. Do not share it with anyone.</Text>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Show Key</Text>
                </TouchableOpacity>
            </Accordion>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ECFFDC',
    },
    accordionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: 'lightgreen',
        marginTop: 10,
        borderRadius: 5,
        alignItems: 'center',
        width: '85%',
        alignSelf: 'center',
    },
    accordionHeaderText: {
        fontWeight: 'bold',
        color: 'white',
    },
    accordionContent: {
        backgroundColor: '#ECFFDC',
        padding: 15,
        width: '85%',
        alignSelf: 'center',
    },
    input: {
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 10,
        marginVertical: 5,
        width: '100%',
        borderColor: 'green',
        borderWidth: 1,
    },
    button: {
        backgroundColor: 'lightgreen',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    switchText: {
        fontSize: 16,
        color: 'black',
    },
    warningText: {
        color: 'yellow',
        backgroundColor: 'gray',
        padding: 10,
        borderRadius: 15,
    },
    disclaimerText: {
        color: 'red',
        fontSize: 14,
        marginTop: 10,
    },
});

export default SettingsScreen;

import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, ActivityIndicator, TouchableWithoutFeedback, Keyboard, SafeAreaView, Alert, BackHandler } from "react-native";
import axios from "../utils/axiosConfig";
import { useIsFocused, } from '@react-navigation/native';

import { useDispatch, useSelector } from "react-redux";
import { setIsLoggedIn, setUser } from "../reducer/authSlice.js";

import BackButton from "../components/BackButton";
export default VerificationScreen = ({ navigation }) => {
    axios.defaults.withCredentials = true; //The most important line for cookies
    const dispatch = useDispatch();
    const [disable, setDisable] = useState(true);
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const handleEmailInput = (text) => {
        setEmail(text);
        if (text.length >= 5) {
            setDisable(false);
        } else {
            setDisable(true);
        }
    };
    const handleContinueButton = async () => {
        try {
            if (email) {
                if (email.includes('@')) {
                    setDisable(true);
                    setIsLoading(true);
                    let res = await axios.post('/auth/forgot', { email }).catch((err) => console.log(err));
                    const { data } = res;
                    if (data.success) {
                        console.log(data);
                        dispatch(setUser(data.user));
                        navigation.navigate('OTP', { hashedEmail: data.hashedEmail, userID: data.user._id });
                    }
                    else {
                        console.log(data);
                    }
                    setIsLoading(false);
                    setDisable(false);
                } else {
                    console.log('Please enter a valid email');
                }
            } else {
                console.log('Please enter the email');
            }
        } catch (err) {
            console.log(err.response.data.error);
            setIsLoading(false);
            setDisable(false);
        }
    };
    const isFocused = useIsFocused(); // Check if the screen is focused

    useEffect(() => {
        if (!isFocused) return;

        const backAction = () => {
            Alert.alert('Hold on!', 'Are you sure you want to exit the app?', [
                {
                    text: 'Cancel',
                    onPress: () => null,
                    style: 'cancel',
                },
                { text: 'YES', onPress: () => BackHandler.exitApp() }, // Exits the app
            ]);
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );

        return () => backHandler.remove();
    }, [isFocused]);
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

            <SafeAreaView style={styles.container}>

                <View style={styles.descriptionContainer}>
                    <Text style={styles.descriptionText}>Enter your Email</Text>
                    <Text style={styles.smallText}>Please confirm your Email address</Text>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput style={styles.input} value={email} placeholder="Email address" placeholderTextColor={'#ADB5BD'} onChangeText={(text) => handleEmailInput(text)} />
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity disabled={disable} style={[styles.button, disable ? { backgroundColor: '#879FFF' } : { backgroundColor: 'blue' }]} onPress={handleContinueButton} >
                        <Text style={styles.buttonText}>{isLoading ? <ActivityIndicator size={'large'} /> : 'Continue'}</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};
const styles = StyleSheet.create({
    backContainer: {
        height: 50,
        // backgroundColor: 'red',
        justifyContent: 'center',
        paddingHorizontal: 10
    },

    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    descriptionContainer: {
        height: 150,
        // backgroundColor: 'red',
        width: "80%",
        marginHorizontal: 'auto',
        marginTop: 100

    },
    descriptionText: {
        fontSize: 26,
        fontWeight: '600',
        textAlign: 'center'
    },
    smallText: {
        marginTop: 20,
        fontSize: 16,
        textAlign: 'center'
    },
    inputContainer: {
        height: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        backgroundColor: '#F7F7FC',
        height: "45%",
        width: "80%",
        borderRadius: 7,
        padding: 8,
        fontSize: 16,
    },
    buttonContainer: {
        marginTop: 50,
        height: 100,
        width: "100%",
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        height: '55%',
        width: '90%',
        backgroundColor: 'red',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white'
    }
});
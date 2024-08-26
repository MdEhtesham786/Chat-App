import { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, SafeAreaView } from "react-native";
import axios from "../utils/axiosConfig";
import * as SecureStore from 'expo-secure-store';
import { useDispatch, useSelector } from "react-redux";
import { setIsLoggedIn, setUser } from "../reducer/authSlice.js";
import BackButton from "../components/BackButton";

export default VerificationScreen = ({ navigation, route }) => {
    axios.defaults.withCredentials = true; //The most important line for cookies
    const dispatch = useDispatch();

    const [otp, setOTP] = useState([]);
    const [disable, setDisable] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [resend, setResend] = useState(true);
    const [timer, setTimer] = useState(40);
    const [error, setError] = useState({});
    const { hashedEmail, user } = route.params;
    const handleTextChange = (text, nextInputRef, prevInputRef, index) => {
        setError({ ...error, otp: '' });
        const newOtp = [...otp];
        newOtp[index] = text;
        setOTP(newOtp);
        if (text.length === 1 && nextInputRef) {
            nextInputRef.current.focus();
        } else if (text.length === 0 && prevInputRef) {
            prevInputRef.current.focus();

        }
        if (newOtp.join('').length === 4) {
            setDisable(false);
        } else {
            setDisable(true);
        }
    };
    const handleVerifyButton = async () => {
        try {
            if (otp) {
                setDisable(true);
                setIsLoading(true);
                setOTP([]);
                let res = await axios.post('/auth/verify-otp', { data: otp, user });
                const { data } = res;
                if (data.success) {
                    save('token', data.token);
                    dispatch(setIsLoggedIn(data.success));
                    dispatch(setUser(data.user));
                    if (data.hasProfile) {
                        navigation.replace('Home');
                    } else {
                        navigation.replace('Profile');
                    }
                } else {
                    console.log(data);
                }
                // console.log(res.data);
                // navigation.navigate('OTP');
                setIsLoading(false);
                setDisable(false);

            } else {
                console.log('Please enter the email');
            }
        } catch (err) {
            console.log(err.response.data);
            setError({ ...error, otp: err.response.data.error });
            setIsLoading(false);
            setDisable(true);
        }

    };
    const handleResendButton = async () => {
        try {
            setOTP([]);

            console.log('resend code');
            if (user.email) {
                if (user.email.includes('@')) {
                    setResend(false);
                    let res = await axios.post('/auth/forgot', { email: user.email });
                    if (res.data.success) {
                        user.otp = res.data.user.otp;
                    }
                    // navigation.navigate('OTP', { hashedEmail: res.data.hashedEmail, user: res.data.user });
                    // setResend(false);

                } else {
                    console.log('Please enter a valid email');
                }
            } else {
                console.log('Please enter the email');
            }
        } catch (err) {
            console.log(err);
            setError({ ...error, otp: err.response.data.error });

            setIsLoading(false);
            setDisable(false);
        }
    };
    const save = async (key, value) => {
        await SecureStore.setItemAsync(key, value);

    };
    const getValueFor = async (key) => {
        let result = await SecureStore.getItemAsync(key);
        return result;
    };
    const input1Ref = useRef(null);
    const input2Ref = useRef(null);
    const input3Ref = useRef(null);
    const input4Ref = useRef(null);
    useEffect(() => {
        let interval;
        if (!resend) {
            interval = setInterval(() => {
                setTimer(prevTimer => {
                    if (prevTimer <= 1) {
                        clearInterval(interval);
                        setResend(true);
                        return 40; // Reset timer back to 40 seconds
                    }
                    return prevTimer - 1;
                });
            }, 1000); // Countdown every second
        }
        return () => clearInterval(interval); // Cleanup interval on unmount
    }, [resend]);
    return (
        <SafeAreaView behavior="padding" style={styles.container}>
            <View style={styles.backContainer}>
                <BackButton navigate={'Verification'} params={{ hashedEmail }} />
            </View>
            <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionText}>Enter Code</Text>
                <Text style={styles.smallText}>We have sent you an email with the code to {hashedEmail}</Text>
            </View>
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error?.otp && error.otp}</Text>
            </View>
            <View style={styles.inputContainer}>
                <TextInput style={styles.input} ref={input1Ref} maxLength={1} value={otp[0]} keyboardType="phone-pad" onChangeText={(text) => handleTextChange(text, input2Ref, null, 0)} />
                <TextInput style={styles.input} ref={input2Ref} maxLength={1} value={otp[1]} keyboardType="phone-pad" onChangeText={(text) => handleTextChange(text, input3Ref, input1Ref, 1)} />
                <TextInput style={styles.input} ref={input3Ref} maxLength={1} value={otp[2]} keyboardType="phone-pad" onChangeText={(text) => handleTextChange(text, input4Ref, input2Ref, 2)} />
                <TextInput style={styles.input} ref={input4Ref} maxLength={1} value={otp[3]} keyboardType="phone-pad" onChangeText={(text) => handleTextChange(text, null, input3Ref, 3)} />
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} disabled={!resend} onPress={handleResendButton} >
                    <Text style={[styles.buttonText, resend ? { color: 'blue' } : { color: '#879FFF' }]}>Resend Code {resend ? '' : timer}</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity disabled={disable} style={[styles.button, disable ? { backgroundColor: '#879FFF' } : { backgroundColor: 'blue' }]} onPress={handleVerifyButton} >
                    <Text style={[styles.buttonText, { color: 'white' }]}>{isLoading ? <ActivityIndicator size={'large'} /> : 'Verify'}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
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
        height: 120,
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
    errorContainer: {
        // backgroundColor: 'red',
        height: 20,

    },
    errorText: {
        textAlign: 'center',
        color: 'red',
        fontSize: 17,
        fontWeight: '500'
    },
    inputContainer: {
        height: 100,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        // backgroundColor: 'red',
        width: '60%',
        marginHorizontal: 'auto',
        marginTop: 20
    },
    input: {
        // backgroundColor: '#EDEDED',
        height: 40,
        width: 40,
        // borderRadius: 50,
        // padding: 8,
        fontSize: 34,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'black'
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
        // backgroundColor: 'blue',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '600',
        color: 'blue'
    }

});

import { View, Text, SafeAreaView, Platform, StyleSheet, StatusBar, Image, Alert, TouchableOpacity, ActivityIndicator, Animated, Linking } from "react-native";
// import axios from "../utils/axiosConfig";
import axios from "../utils/axiosConfig.js";
import * as SecureStore from 'expo-secure-store';
import image1 from "../assets/images/image1.png";
import image2 from "../assets/images/image2.png";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsLoggedIn, setUser, setPendingRequest } from "../reducer/authSlice.js";
import Logo from "../assets/images/loadingImg.png";
// import * as Updates from "expo-updates";
import * as Application from "expo-application";
import Constants from "expo-constants";
import * as Notifications from 'expo-notifications';

const WalkthroughScreen = ({ navigation, route }) => {
    const CURRENT_VERSION = Constants.expoConfig?.version || Application.nativeApplicationVersion;
    axios.defaults.withCredentials = true; //The most important line for cookies
    // Redux State
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const [loading, setLoading] = useState(true);

    const getValueFor = async (key) => {
        let result = await SecureStore.getItemAsync(key);
        return result;
    };
    const save = async (key, value) => {
        await SecureStore.setItemAsync(key, value);

    };
    const checkBackend = async () => {
        try {
            const res = await axios.post("/checkBackend").catch(err => console.log(err));

            const { data } = res;
            if (data.success) {
                console.log("Backend is running");
            } else {
                // Alert.alert("Backend is not running", "Please check your backend server.");
                console.log("Backend is not running");
            }
        } catch (error) {
            console.error("Error checking for Backend:", error);
        }
    };
    const checkForBigUpdate = async () => {
        try {
            console.log("Checking for big update...");
            const res = await axios.get("/version");
            const { data } = res;
            console.log(data.version, CURRENT_VERSION);
            if (data.version !== CURRENT_VERSION) {
                showUpdateAlert(data.apkUrl);
            }
        } catch (error) {
            console.error("Error checking for update:", error);
        }
    };

    const showUpdateAlert = (apkUrl) => {
        Alert.alert(
            "Update Available",
            "A new version of the app is available. Please update to continue.",
            [
                { text: "Download Update", onPress: () => Linking.openURL(apkUrl) }
            ]
        );
    };

    const fetchData = async (token) => {
        try {
            if (token) {
                // console.log('token', token);
                const res = await axios.post(`/auth/islogin`, { token });
                console.log('three');
                const { data } = res;
                console.log('four');

                if (data.success) {
                    if (data.user) {
                        dispatch(setIsLoggedIn(data.success));
                        dispatch(setPendingRequest(data.user.pendingRequest));
                        dispatch(setUser(data.user));
                        if (data.hasProfile) {
                            // usePushNotifications();
                            navigation.navigate("Home");
                        } else {
                            navigation.navigate("Profile");
                        }
                    }
                } else {
                    console.log(data);
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }

        } catch (err) {
            console.log(err.response.data.error);
            if (err.response.data.error.msg === 'TokenExpiredError') {
                await SecureStore.deleteItemAsync('token');
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        getValueFor('token').then((token) => fetchData(token)).catch(err => console.log(err));

    }, []);
    useEffect(() => {
        checkForBigUpdate();
        checkBackend();
        // checkForSmallUpdate();
    }, []);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1, // Fade to opacity 1 (visible)
            duration: 1000, // Duration in milliseconds
            useNativeDriver: true, // Use native driver for better performance
        }).start();
    }, [fadeAnim]);
    return (
        loading ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}><Animated.Image source={Logo} style={{ height: 80, width: 300, opacity: fadeAnim }} resizeMode="contain" /></View> :
            <SafeAreaView style={styles.container} >
                <View style={styles.imageContainer}>
                    <Image style={styles.image1} source={image1} resizeMode="contain" />
                    <Image style={styles.image2} source={image2} resizeMode="contain" />
                </View>
                <View style={styles.descriptionContainer}>
                    <Text style={styles.descriptionText}>
                        Connect easily with your friends and family over countries
                    </Text>

                </View>
                <View style={styles.buttonContainer}>
                    <Text style={{ fontSize: 16 }} >Terms & Privacy Policy</Text>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Verification')} >
                        <Text style={styles.buttonText}>Start Messaging</Text>
                    </TouchableOpacity>
                </View>

            </SafeAreaView >
    );
};
export default WalkthroughScreen;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
        // backgroundColor:E5E5E5'
    },
    imageContainer: {
        marginTop: 100,
        height: 300,
        width: 300,
        // backgroundColor:'red',
        flexDirection: 'row'
    },
    image1: {
        width: '65%',
        height: '85%',
        alignSelf: 'flex-end',

    },
    image2: {
        width: '35%',
        height: '35%',
    },
    descriptionContainer: {
        marginTop: 30,
        width: 300,
        // backgroundColor: 'red'
    },
    descriptionText: {
        fontSize: 28,
        textAlign: 'center',

        fontWeight: 'bold'
    },
    buttonContainer: {
        marginTop: 100,
        height: 120,
        width: 350,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    button: {
        height: '55%',
        width: '100%',
        backgroundColor: 'blue',
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
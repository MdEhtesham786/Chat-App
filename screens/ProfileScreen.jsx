import { Text, View, SafeAreaView, TouchableOpacity, StyleSheet, Image, TextInput, BackHandler, Alert, ActivityIndicator } from "react-native";
import BackButton from "../components/BackButton";
import profileImg from "../assets/images/profile.png";
import axios from "../utils/axiosConfig";
import * as SecureStore from 'expo-secure-store';

import { useEffect, useState } from "react";
export default ProfileScreen = ({ navigation, route }) => {
    axios.defaults.withCredentials = true; //The most important line for cookies

    const [formData, setFormdata] = useState({ firstname: '', lastname: '' });
    const [disable, setDisable] = useState(true);
    const [token, setToken] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const save = async (key, value) => {
        await SecureStore.setItemAsync(key, value);

    };
    const getValueFor = async (key) => {
        let result = await SecureStore.getItemAsync(key);
        setToken(result);
    };
    const handleSaveButton = async () => {
        try {
            setDisable(true);
            setIsLoading(true);
            console.log(token, 'compulsory hona chahiye');
            let res = await axios.post('/auth/add-profile', { data: formData, token });
            if (res.data.success) {
                navigation.replace('Home', { user: res.data.user });
            } else {
                console.log('err', res.data);
            }
            setIsLoading(false);
            setDisable(false);
        } catch (err) {
            console.log(err.response.data.error);
            setIsLoading(false);
            setDisable(false);

        }
    };
    const handleTextChange = (text, input) => {
        if (input === 'first') {
            if (text.length >= 3) {
                setDisable(false);
            } else {
                setDisable(true);
            }
            setFormdata({ ...formData, firstname: text });
        } else if (input === 'last') {
            setFormdata({ ...formData, lastname: text });

        } else {
            console.log('no input found');
        }


    };
    useEffect(() => {
        getValueFor('token');
        console.log(token, 'pehle run ho gaya ');
    }, []);
    useEffect(() => {
        const backAction = () => {
            // You can customize this action, maybe show an alert to confirm exit
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
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.backContainer}>
                {/* <BackButton navigate={'OTP'} /> */}
                <Text style={{ fontSize: 20 }}>Your Profile</Text>
            </View>
            <View style={styles.imageContainer}>
                <TouchableOpacity style={styles.imageButton}>
                    <Image style={styles.profileImg} resizeMode="contain" source={profileImg} />
                </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
                <TextInput style={styles.input} value={formData.firstname} placeholder="First Name (Required)" placeholderTextColor={'#ADB5BD'} onChangeText={(text) => handleTextChange(text, 'first')} />
                <TextInput style={styles.input} value={formData.lastname} placeholder="Last Name (Optional)" placeholderTextColor={'#ADB5BD'} onChangeText={(text) => handleTextChange(text, 'last')} />
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity disabled={disable} style={[styles.button, disable ? { backgroundColor: '#879FFF' } : { backgroundColor: 'blue' }]} onPress={handleSaveButton} >
                    <Text style={styles.buttonText}>{isLoading ? <ActivityIndicator size={'large'} /> : 'Save'}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    backContainer: {
        height: 50,
        flexDirection: 'row',
        // backgroundColor: 'red',
        // justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        paddingHorizontal: 30
    },
    imageContainer: {
        alignItems: 'center',
        marginTop: 70
    },
    imageButton: {
        // backgroundColor: 'green',
        height: 130,
        width: 130
    },
    profileImg: {
        height: 130,
        width: 130
    },
    inputContainer: {
        marginTop: 40,
        height: 130,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        // backgroundColor: "blue"
    },
    input: {
        backgroundColor: '#F7F7FC',
        height: '35%',
        width: "85%",
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
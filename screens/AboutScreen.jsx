import { Text, View, SafeAreaView, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Keyboard, Platform, Image, TextInput, BackHandler, Alert, ActivityIndicator } from "react-native";
import BackButton from "../components/BackButton";
import profileImg from "../assets/images/profile.png";
import axios from "../utils/axiosConfig";
import * as SecureStore from 'expo-secure-store';
import { useDispatch, useSelector } from "react-redux";
import { setIsLoggedIn, setUser } from "../reducer/authSlice.js";
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { useEffect, useState, useCallback } from "react";
import * as FileSystem from 'expo-file-system';
import imageCompressor from "../utils/imageCompressor.js";
import { useFocusEffect } from '@react-navigation/native';

const AboutScreen = ({ navigation, route }) => {

    const user = useSelector((state) => state.auth.user);
    axios.defaults.withCredentials = true; //The most important line for cookies
    const [status, requestPermission] = ImagePicker.useCameraPermissions();
    const [formData, setFormdata] = useState({ firstname: user?.firstname || '', lastname: user?.lastname || '' });
    const [disable, setDisable] = useState(true);
    const [token, setToken] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    //Profile picture handling
    const [image, setImage] = useState(user?.avatar?.url);
    const pickImage = async () => {

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],

            quality: 1,
            base64: true,
        });

        if (!result.canceled) {
            console.log('Image selected:', result.assets[0].uri);
            setImage(result.assets[0].uri);
        }

    };
    const uploadImage = async (imageResult) => {
        setDisable(true);
        setIsLoading(true);
        if (!imageResult) {
            console.log('No image selected');
            setIsLoading(false);
            setDisable(false);

        } else {
            let localUri = imageResult;
            if (localUri === user?.avatar?.url) {
                console.log('same image');
                // console.log('local', localUri);
                // console.log('user avatar', user?.avatar?.url);
                setIsLoading(false);
                setDisable(false);
            } else {
                const localImage = await FileSystem.getInfoAsync(localUri);
                const manipulatedUri = await imageCompressor(localImage, localUri);
                const filename = manipulatedUri.split('/').pop();
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : `image`;
                const profilePicformData = new FormData();
                profilePicformData.append('profilePic', {
                    uri: manipulatedUri,
                    name: filename,
                    type,
                });
                profilePicformData.append('token', token);
                try {
                    const res = await axios.post(`/auth/upload-profile-pic`, profilePicformData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            // Authorization: `Bearer ${yourToken}`,
                        },
                    });

                    const { data } = res;
                    if (!data.success) {
                        console.log('frontend err', data);
                        setIsLoading(false);
                        setDisable(false);
                    } else {
                        dispatch(setUser(data.user));
                        console.log('Profile picture updated successfully');
                        setIsLoading(false);
                        setDisable(false);
                    }

                } catch (err) {
                    console.error('Upload error:', err?.response?.data?.error);
                    setIsLoading(false);
                    setDisable(false);
                }
            }

        }
    };
    useEffect(() => {
        if (user?.avatar?.url) {
            setImage(user.avatar.url);
            // console.log('Profile image updated from Redux:', user.avatar.url);
        }
    }, [user]);
    //changing profile pic if screen changes
    useFocusEffect(
        useCallback(() => {
            setImage(user?.avatar?.url);
            // console.log(user?.avatar?.url);
            return () => {
                setImage(user?.avatar?.url); // Reset image to user's avatar
                // console.log('Screen unfocused');
            };
        }, [user])
    );
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
            uploadImage(image);
            // console.log('formdata', formData.firstname, formData.lastname);
            if (formData.firstname === user?.firstname && formData.lastname === user?.lastname) {
                setIsLoading(false);
                setDisable(false);
                console.log('No changes found');
            } else {
                let res = await axios.post('/auth/update-profile', { data: formData, token });
                const { data } = res;
                if (data.success) {
                    dispatch(setIsLoggedIn(data.success));
                    dispatch(setUser(data.user));
                    // navigation.replace('Home');
                } else {
                    console.log('err', data);
                }
                setIsLoading(false);
                setDisable(false);
            }

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
    // const [keyboardOffset, setKeyboardOffset] = useState(Platform.OS === 'ios' ? 60 : 30);

    useEffect(() => {
        // const showSubscription = Keyboard.addListener('keyboardDidShow', (e) => {
        //     // you can adjust the offset based on keyboard height or fixed number
        //     setKeyboardOffset(Platform.OS === 'ios' ? 60 : 30);
        // });
        // const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
        //     setKeyboardOffset(Platform.OS === 'ios' ? 60 : 0);
        // });

        if (user?.firstname) {
            setDisable(false);
        }
        getValueFor('token');
        // return () => {
        //     showSubscription.remove();
        //     hideSubscription.remove();
        // };
    }, []);
    // useEffect(() => {
    //     const backAction = () => {
    //         // You can customize this action, maybe show an alert to confirm exit
    //         Alert.alert('Hold on!', 'Are you sure you want to exit the app?', [
    //             {
    //                 text: 'Cancel',
    //                 onPress: () => null,
    //                 style: 'cancel',
    //             },
    //             { text: 'YES', onPress: () => BackHandler.exitApp() }, // Exits the app
    //         ]);
    //         return true;
    //     };
    //     const backHandler = BackHandler.addEventListener(
    //         'hardwareBackPress',
    //         backAction,
    //     );

    //     return () => backHandler.remove();
    // }, []);
    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                // keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 30}
                style={{ flex: 1 }}
            >
                <View style={styles.backContainer}>
                    {/* <BackButton navigate={'OTP'} /> */}
                    <Text style={{ fontSize: 20 }}>Your Profile</Text>
                </View>
                <View style={styles.imageContainer}>
                    <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                        <Image style={styles.profileImg} resizeMode="contain" source={image ? { uri: image } : profileImg} />

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
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};
export default AboutScreen;
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
        width: 130,
    },
    profileImg: {
        height: 130,
        width: 130,
        borderRadius: 28,
        // backgroundColor: 'red',
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
import { Text, SafeAreaView, StyleSheet, BackHandler, Alert, TouchableOpacity } from "react-native";
import BackButton from "../components/BackButton";
import { useState, useEffect } from "react";
import * as SecureStore from 'expo-secure-store';
import { useDispatch, useSelector } from "react-redux";
import { setIsLoggedIn, setUser } from "../reducer/authSlice.js";
import axios from "../utils/axiosConfig.js";
export default HomeScreen = ({ navigation, route }) => {
    axios.defaults.withCredentials = true; //The most important line for cookies
    const dispatch = useDispatch();
    const [disable, setDisable] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');
    const user = useSelector((state) => state.auth.user);
    const logoutAlert = () => {
        Alert.alert('Confirmation', 'Are you sure you want to Logout?', [
            {
                text: 'Cancel',
                onPress: () => null,
                style: 'cancel',
            },
            { text: 'YES', onPress: () => handleLogout() }
        ]);
    };

    const handleLogout = async () => {
        try {
            await SecureStore.deleteItemAsync('token');
            dispatch(setIsLoggedIn(false));
            dispatch(setUser({}));
            navigation.navigate('Verification');
            console.log('Successfully Logged Out');
        } catch (err) {
            console.log(err.response.data.err);
        }
    };
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
            <Text style={{ fontSize: 20, textAlign: 'center' }}>Hello {user?.firstname + " " + user?.lastname}</Text>
            <TouchableOpacity onPress={logoutAlert} >
                <Text>Log out</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    }
});
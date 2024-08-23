import { Text, SafeAreaView, StyleSheet, BackHandler, Alert } from "react-native";
import axios from "../utils/axiosConfig";
import BackButton from "../components/BackButton";

import { useState, useEffect } from "react";
export default HomeScreen = ({ navigation, route }) => {
      axios.defaults.withCredentials = true; //The most important line for cookies

    const [disable, setDisable] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState();
    const { user } = route.params;
    const fetchData = async () => {
        try {
            // setIsLoading(true);
            // setDisable(true);
            let res = await axios.post('/home', { user });
            if (res.data.success) {
                setName(res.data.user.firstname);
            } else {
                console.log(res.data);
            }
        } catch (err) {
            console.log(err);

            // setIsLoading(false);
            // setDisable(false);
        }
    };
    fetchData();
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
        <SafeAreaView>
            <Text style={{ fontSize: 20, textAlign: 'center' }}>Hello {name}</Text>
        </SafeAreaView>
    );
};
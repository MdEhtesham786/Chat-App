import { Text, SafeAreaView, StyleSheet, BackHandler, Alert, TouchableOpacity, View, Image, TextInput, FlatList } from "react-native";
import BackButton from "../components/BackButton";
import { useState, useEffect } from "react";
import * as SecureStore from 'expo-secure-store';
import { useDispatch, useSelector } from "react-redux";
import { setIsLoggedIn, setUser } from "../reducer/authSlice.js";
import axios from "../utils/axiosConfig.js";
import avatar from "../assets/images/avatar.png";
import ChatBox from "../components/ChatBox.jsx";

export default HomeScreen = ({ navigation, route }) => {
    axios.defaults.withCredentials = true; //The most important line for cookies
    const dispatch = useDispatch();
    const [disable, setDisable] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState('');
    const user = useSelector((state) => state.auth.user);
    let demoArr = [

    ];
    let obj = {
        avatar: avatar,
        name: user?.firstname + ' ' + user?.lastname,
        latestMessage: 'Hello'
    };
    for (let i = 0; i < 20; i++) {
        demoArr.push(obj);

    }
    const handleSearchInput = (text) => {
        setSearch(text);
        if (text.length >= 5) {
            setDisable(false);
        } else {
            setDisable(true);
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
            <View style={styles.header} >
                <Text style={styles.headerText}>Home</Text>
            </View>
            <View style={styles.inputContainer}>
                <TextInput style={styles.input} value={search} placeholder="Search" placeholderTextColor={'#ADB5BD'} onChangeText={(text) => handleSearchInput(text)} />
            </View>
            <View style={styles.listContainer}>
                <FlatList
                    data={demoArr}
                    renderItem={({ item }) => { return <ChatBox avatar={item.avatar} name={item.name} latestMessage={item.latestMessage} />; }}
                    showsVerticalScrollIndicator={false}

                />
            </View>
            {/* <Text style={{ fontSize: 20, textAlign: 'center' }}>Hello {user?.firstname + " " + user?.lastname}</Text>
            <TouchableOpacity onPress={logoutAlert} >
                <Text>Log out</Text>
            </TouchableOpacity> */}
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    header: {
        // backgroundColor: 'red',
        height: 50,
        justifyContent: 'center',
        paddingHorizontal: 20
    },
    headerText: {
        fontSize: 20,

    },
    inputContainer: {
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        backgroundColor: '#F7F7FC',
        height: "55%",
        width: "85%",
        borderRadius: 7,
        padding: 8,
        fontSize: 16,
    },
    listContainer: {
        // height: 500,
        flex: 1,
        width: '100%',
    }
});
import { Text, SafeAreaView, StyleSheet, Pressable, BackHandler, Alert, TouchableOpacity, View, Image, TextInput, FlatList } from "react-native";
import BackButton from "../components/BackButton";
import { useState, useEffect, useCallback } from "react";
import * as SecureStore from 'expo-secure-store';
import { useDispatch, useSelector } from "react-redux";
import { setIsLoggedIn, setUser, setPendingRequest } from "../reducer/authSlice.js";
import axios from "../utils/axiosConfig.js";
import avatar from "../assets/images/avatar.png";
// import ChatBox from "../components/ChatBox.jsx";
import Search from "../assets/images/search.png";
import SearchUsersBox from "../components/SearchUsersBox.jsx";
import PendingRequestBox from "../components/PendingRequestBox.jsx";
import { getSocket } from '../utils/socketService';  // Import socketService
import { useFocusEffect } from "@react-navigation/native";


const AddFriendScreen = ({ navigation, route }) => {
    const socket = getSocket();  // Get the already initialized socket instance

    const user = useSelector((state) => state.auth.user);
    const pendingRequest = useSelector((state) => state.auth.pendingRequest);
    const dispatch = useDispatch();
    axios.defaults.withCredentials = true; //The most important line for cookies
    const [search, setSearch] = useState('');
    const [searchUsers, setSearchUsers] = useState([]);
    const handleSearchInput = (text) => {
        setSearch(text);
        let obj = {
            avatar: avatar,
            name: 'Anurag' + ' ' + 'Vishwakarma',
            latestMessage: 'Hello',
            friendID: '6753327c4aa28082297cf7de'
        };
    };

    const fetchPendingRequest = async () => {
        try {
            let res = await axios.post('/pendingRequest', { userID: user._id });
            const { data } = res;
            if (data.success) {
                dispatch(setPendingRequest(data.pendingRequest));
            } else {
                console.log('err', data);
            }
        } catch (err) {
            console.log('error', err);
        }
    };

    const handleSearchButton = async (search) => {
        try {
            let res = await axios.post('/searchUsers', { searchUsers: search }).catch((err) => console.log(err));
            const { data } = res;
            if (data.success) {
                setSearchUsers(data.searchUsers);
            } else {
                console.log('err', data);
            }
        } catch (err) {
            console.log(err);

        }
    };

    useEffect(() => {
        fetchPendingRequest();
    }, []);


    return (

        <SafeAreaView style={styles.container}>
            <BackButton />
            <View style={styles.inputContainer}>
                <TextInput style={styles.input} value={search} placeholder="Search Friends" placeholderTextColor={'#ADB5BD'} onChangeText={(text) => handleSearchInput(text)} />
                <Pressable style={styles.searchButton} onPress={() => handleSearchButton(search)} >
                    <Image source={Search} style={{ height: 40, width: 40 }} />
                </Pressable>

            </View>
            <View style={styles.searchResults}>
                {searchUsers.length > 0 ?
                    <FlatList
                        data={searchUsers}
                        renderItem={({ item }) => { return <SearchUsersBox fetchPendingRequest={fetchPendingRequest} userID={user._id} friendID={item._id} avatar={item.avatar} name={item.firstname + ' ' + item.lastname} />; }}
                        showsVerticalScrollIndicator={false}
                    /> : <Text style={styles.header}> No users found</Text>}

            </View>
            <View style={styles.pendingRequestResults}>
                {pendingRequest.length > 0 ?
                    <FlatList
                        data={pendingRequest}
                        renderItem={({ item }) => { return <PendingRequestBox userID={user._id} pendingID={item._id} avatar={item.avatar} name={item.firstname + ' ' + item.lastname} />; }}
                        showsVerticalScrollIndicator={false}
                    /> : <Text style={styles.header}> {pendingRequest.length} pending request</Text>}

            </View>
        </SafeAreaView>
    );
};
export default AddFriendScreen;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    inputContainer: {
        height: 80,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexDirection: 'row'
    },
    input: {
        backgroundColor: '#F7F7FC',
        height: "55%",
        width: "75%",
        borderRadius: 7,
        padding: 8,
        fontSize: 16,
    },
    searchButton: {

    },
    searchResults: {
        minHeight: 350,
        marginHorizontal: 20,
        // backgroundColor: 'green'
    },
    pendingRequestResults: {
        minHeight: 350,
        marginHorizontal: 20,
        // backgroundColor: 'green'
    },
    header: {
        marginTop: 10,
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        color: ''
    }
});
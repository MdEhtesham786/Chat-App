import { Text, SafeAreaView, StyleSheet, BackHandler, Alert, TouchableOpacity, View, Image, TextInput, FlatList, Pressable } from "react-native";
import BackButton from "../components/BackButton";
import addFriend from "../assets/images/addFriend.png";
import { useState, useEffect, useCallback } from "react";
import * as SecureStore from 'expo-secure-store';
import { useDispatch, useSelector } from "react-redux";
import { setFriendList, setIsLoggedIn, setUser } from "../reducer/authSlice.js";
import axios from "../utils/axiosConfig.js";
import ChatBox from "../components/ChatBox.jsx";
import { useFocusEffect, } from "@react-navigation/native";
import { setChat } from "../reducer/chatSlice.js";
import { use } from "react";

const ChatScreen = ({ navigation, route }) => {


    axios.defaults.withCredentials = true; //The most important line for cookies
    const dispatch = useDispatch();
    const [disable, setDisable] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState('');
    const user = useSelector((state) => state.auth.user);
    const pendingRequest = useSelector((state) => state.auth.pendingRequest);
    const friendList = useSelector((state) => state.auth.friendList);
    const handleSearchInput = (text) => {
        setSearch(text);
        if (text.length >= 5) {
            setDisable(false);
        } else {
            setDisable(true);
        }
    };
    const fetchFriendList = async () => {
        try {
            let res = await axios.post('/friendList', { userID: user._id });
            const { data } = res;
            // console.log(data.friendList);
            if (data.success) {
                dispatch(setFriendList(data.friendList));
            } else {
                console.log('err', data);
            }
        } catch (err) {
            console.log(err);

        }
    };
    const handleAddFriend = () => {
        try {
            navigation.navigate('AddFriend');
        } catch (err) {
            console.log(err);
        }
    };
    useFocusEffect(
        useCallback(() => {

            fetchFriendList();
            setChat({});
        }, [])
    );

    return (

        <SafeAreaView style={styles.container}>
            <View style={styles.header} >
                <Text style={styles.headerText}>Home</Text>
                <Pressable onPress={handleAddFriend} style={{ backgroundColor: '', flexDirection: 'row' }}>
                    {pendingRequest.length > 0 && <Text style={{ color: 'blue' }}>{pendingRequest.length}</Text>}
                    <Image style={styles.addFriend} source={addFriend} />
                </Pressable>
            </View>
            <View style={styles.inputContainer}>
                <TextInput style={styles.input} value={search} placeholder="Search" placeholderTextColor={'#ADB5BD'} onChangeText={(text) => handleSearchInput(text)} />
            </View>
            <View style={styles.listContainer}>
                <FlatList
                    data={friendList}
                    renderItem={({ item }) => {
                        return <ChatBox userID={user._id} friendID={item._id} avatar={item?.avatar?.url} name={item.firstname + ' ' + item.lastname} />;
                    }}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </SafeAreaView>
    );
};

export default ChatScreen;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    header: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20
    },
    addFriend: {
        height: 30,
        width: 30
    },
    headerText: {
        fontSize: 20,
        width: 60,

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
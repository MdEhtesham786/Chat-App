import { Text,StyleSheet, BackHandler, Alert, Platform,TouchableOpacity, View, Image, TextInput, FlatList, Pressable } from "react-native";
import BackButton from "../components/BackButton";

import addFriend from "../assets/images/addFriend.png";
import { useState, useEffect, useCallback, useRef } from "react";
import * as SecureStore from 'expo-secure-store';
import { useDispatch, useSelector } from "react-redux";
import { setFriendList, setIsLoggedIn, setUser } from "../reducer/authSlice.js";
import axios from "../utils/axiosConfig.js";
import ChatBox from "../components/ChatBox.jsx";




import { useFocusEffect, } from "@react-navigation/native";
import { setChat } from "../reducer/chatSlice.js";
import { use } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

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

        <SafeAreaView style={styles.container} edges={Platform.OS === "android" ? ["top", "bottom"] : ["bottom"]}>
            <View style={styles.header} >
                <Text style={styles.headerText}>Chats</Text>
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
        height: 37,
        width: 37
    },
    headerText: {
        fontSize: 27,
        width: 75,
        fontWeight: '600'

    },
    inputContainer: {
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'red'
    },
    input: {
        backgroundColor: '#F7F7FC',
        height: "55%",
        width: "90%",
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
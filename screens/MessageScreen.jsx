import { Text, View, SafeAreaView, Pressable, TouchableWithoutFeedback, Keyboard, Platform, KeyboardAvoidingView, TouchableOpacity, StyleSheet, Image, TextInput, BackHandler, Alert, ActivityIndicator, FlatList } from "react-native";
import BackButton from "../components/BackButton";
import profileImg from "../assets/images/profile.png";
import axios from "../utils/axiosConfig";
import * as SecureStore from 'expo-secure-store';
import { useDispatch, useSelector } from "react-redux";
import { setIsLoggedIn, setUser } from "../reducer/authSlice.js";
import { setChat, setCurrentChatOpen } from "../reducer/chatSlice.js";
import { useEffect, useState, useRef, useCallback } from "react";
import sendIcon from "../assets/images/sendIcon.png";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getSocket } from '../utils/socketService';  // Import socketService
import { format } from 'date-fns';

export default MessageScreen = ({ navigation, route }) => {
    const socket = getSocket();  // Get the already initialized socket instance

    const [inputHeight, setInputHeight] = useState(50);
    const { friendID } = route.params;
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const chat = useSelector((state) => state.chat.chat);
    const currentChatOpen = useSelector((state) => state.chat.currentChatOpen);
    axios.defaults.withCredentials = true; //The most important line for cookies
    const [formData, setFormdata] = useState({ firstname: '', lastname: '' });
    const [disable, setDisable] = useState(true);
    const [token, setToken] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const save = async (key, value) => {
        await SecureStore.setItemAsync(key, value);
    };
    const getValueFor = async (key) => {
        let result = await SecureStore.getItemAsync(key);
        setToken(result);
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
    const fetchChat = async () => {
        try {
            const res = await axios.post(`/chat/getChat/${user._id}`, { friendID });
            const { data } = res;
            if (data.success) {
                dispatch(setChat(data.chatObj));
            } else {
                dispatch(setChat(data.chatObj));
            }
        } catch (err) {
            console.log(err);
        }
    };
    const readAllMessage = async () => {
        try {
            const res = await axios.post(`/chat/readMessage/${user._id}`, { friendID });
            const { data } = res;
            if (data.success) {
                console.log('Successfully Done');
            } else {
                console.log(date);
            }
        } catch (err) {
            console.log(err);
        }
    };
    const handleRemoveFriend = async (friendID) => {
        try {
            Alert.alert('Remove Friend', "Are you sure you want to remove this nigga from FriendList?", [
                {
                    text: 'Cancel',
                    onPress: () => null,
                    style: 'cancel',
                },
                {
                    text: 'YES', onPress: async () => {
                        let res = await axios.post('/removeFriend', { userID: user._id, friendID });
                        const { data } = res;
                        if (data.success) {
                            navigation.navigate('Home');
                        } else {
                            console.log(data);
                        }
                    }
                }, // Exits the app
            ]);

        } catch (err) {
            console.log(err);

        }
    };
    const sendMessage = async () => {
        try {
            if (chat._id && user._id && message) {
                if (!message.length <= 0) {
                    const res = await axios.post('/chat/send-message', { chatID: chat._id, senderID: user._id, message });
                    // console.log(chat);
                    const { data } = res;
                    if (data.success) {
                        let friendID = chat.chatOwnersID.filter((id) => id !== user._id);
                        socket.emit('sendMessage', friendID, data.notificationMessage, (response) => {
                            fetchChat();
                            console.log(response);
                        });
                        socket.emit('latestMessage', friendID, (response) => {
                            console.log(response);
                        });
                        setMessage('');
                        console.log('Message sent');
                    } else {
                        console.log(data);
                    }
                }
            } else {
                console.log(chat._id, user._id, message);
            }
        } catch (err) {
            console.log('err', err);
        }
    };

    useEffect(() => {
        socket.on('updateReceiveMessage', (res) => {
            if (res) {
                fetchChat();
            } else {
                console.log(res);
            }
        });
        return () => {
            socket.off("updateReceiveMessage");
        };
    }, []);
    useEffect(() => {
        getValueFor('token');
    }, []);

    useEffect(() => {
        fetchChat();
    }, []);
    useFocusEffect(useCallback(() => {
        readAllMessage();
        // setCurrentChatOpen(chat?.chatOwnersID?.find((id) => id !== user._id));
        console.log(chat.chatOwnersID, currentChatOpen, 'useeffect');
        console.log('all message read');
    }, []));
    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : ''}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
                style={{ flex: 1 }}
            >
                <View style={styles.messageHeader}>
                    <View style={{ justifyContent: 'center' }}>
                        <BackButton />
                    </View>
                    <View style={styles.headerName}>
                        {chat && chat?.messageData ? (
                            <Text style={{ fontSize: 22, }} >
                                {chat.friendName}
                            </Text>
                        ) : (
                            <Text>Loading chat...</Text> // Placeholder while chat is being fetched
                        )}
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
                        <Pressable onPress={() => handleRemoveFriend(friendID)}><Text style={{ fontSize: 18, color: 'red', marginTop: 5, width: '90', }}> Remove</Text></Pressable>
                    </View>
                </View>
                <View style={styles.messageContainer}>

                    {chat && chat.messageData && chat.messageData.length > 0 ? (
                        <FlatList
                            data={chat.messageData}
                            renderItem={({ item }) => {
                                const formattedTime = format(new Date(item.createdAt), "hh:mm a");
                                const dynamicBorderRadius = item.author === user._id
                                    ? { borderBottomRightRadius: 0 }
                                    : { borderBottomLeftRadius: 0 };
                                return (
                                    <View key={item._id} style={{ ...styles.messageBox, ...dynamicBorderRadius, alignSelf: item.author === user._id ? 'flex-end' : 'flex-start' }}>
                                        <Text style={{ fontSize: 18, color: 'white', marginTop: 3 }}>
                                            {item.message}
                                        </Text>
                                        <Text style={{ alignSelf: 'flex-end', marginTop: 3, fontSize: 12 }}>{formattedTime}</Text>
                                    </View>
                                );
                            }}
                            showsVerticalScrollIndicator={false}
                            inverted={true}
                        />
                    ) : (
                        <View style={{ justifyContent: 'center', marginVertical: 10, flex: 1, alignItems: 'center' }}><Text style={{ fontSize: 20, textAlign: 'center' }}>Start a new conversation</Text></View> // Placeholder if no messages exist
                    )}
                </View>
                <View style={styles.inputContainer}>
                    <TextInput style={styles.messageInput} keyboardType="default" multiline={true} value={message} onChangeText={setMessage} placeholder="Type a Message" />
                    <Pressable style={{ marginLeft: '3%', }} onPress={() => sendMessage()}><Image source={sendIcon} style={{ height: 35, width: 35, marginBottom: 7 }} /></Pressable>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    messageHeader: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        height: 60,
        paddingTop: 4,

    },
    headerName: {
        // backgroundColor: 'green',
        justifyContent: 'center',
        marginLeft: 6,
        alignItems: 'center',
    },
    messageContainer: {
        // backgroundColor: 'red',
        paddingHorizontal: 15,
        flex: 1,
    },
    messageBox: {
        backgroundColor: '#375FFF',
        minHeight: 40,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 15,
        marginBottom: 8,
    },
    inputContainer: {
        backgroundColor: '#FFFFFF',
        // backgroundColor: 'red',
        minHeight: 70,
        maxHeight: 150,
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingBottom: 13,
        paddingTop: 10,
    },
    messageInput: {
        backgroundColor: '#F7F7FC',
        width: '77%',
        minHeight: 40,
        marginLeft: '4%',
        borderRadius: 15,
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 18,
    }
}); 
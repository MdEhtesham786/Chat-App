import { Text, View, Pressable, TouchableWithoutFeedback, Keyboard, Platform, KeyboardAvoidingView, TouchableOpacity, StyleSheet, Image, TextInput, BackHandler, Alert, ActivityIndicator, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
import profilePic from "../assets/images/avatar.png";

const MessageScreen = ({ navigation, route }) => {
    const socket = getSocket();  // Get the already initialized socket instance

    const [inputHeight, setInputHeight] = useState(50);
    const { friendID, avatar } = route.params;
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const chat = useSelector((state) => state.chat.chat);
    const currentChatOpen = useSelector((state) => state.chat.currentChatOpen);
    axios.defaults.withCredentials = true; //The most important line for cookies
    const [formData, setFormdata] = useState({ firstname: '', lastname: '' });
    const [disable, setDisable] = useState(false);
    // const [disableSendButton, setDisableSendButton] = useState(true);
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
            Alert.alert('Remove Friend', `Are you sure you want to remove ${chat?.friendName}?`, [
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
setDisable(true);

                    const res = await axios.post('/chat/send-message', { chatID: chat._id, senderID: user._id, message });
                    // console.log(chat);
                    const { data } = res;
                    if (data.success) {
                        let friendID = chat.chatOwnersID.filter((id) => id !== user._id);
                        fetchChat();// this helps the user see his own message 
                        socket.emit('sendMessage', friendID, data.notificationMessage, (response) => {
                            console.log(response);
                        });
                        socket.emit('latestMessage', friendID, (response) => {
                            console.log(response);
                        });
                        setMessage('');
                        console.log('Message sent');

setDisable(false);
                    } else {
                        console.log(data);
setDisable(false);

                    }
                 

                }
            } else {
                console.log(chat._id, user._id, message);
            }
        } catch (err) {
            console.log('err', err);
        }
    };
  const [behavior, setBehavior] = useState(
  Platform.OS === "ios" ? "padding" : undefined
);

useEffect(() => {
  const showSub = Keyboard.addListener("keyboardDidShow", () => {
    setBehavior("padding"); // works for both
  });

  const hideSub = Keyboard.addListener("keyboardDidHide", () => {
    setBehavior(Platform.OS === "ios" ? "padding" : undefined);
  });

  return () => {
    showSub.remove();
    hideSub.remove();
  };
}, []);

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
        console.log('all message read');
    }, []));
    return (
        <SafeAreaView style={styles.container} edges={Platform.OS === "android" ? ["top", "bottom"] : [""]}>
            <KeyboardAvoidingView behavior={behavior}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 58 : 0}
                style={{ flex: 1 }}
            >
                <View style={styles.messageHeader}>
                    <View style={{ justifyContent: 'center' }}>
                        <BackButton />
                    </View>
                    {chat && chat?.messageData ? (
                        <View style={styles.headerName}>
                            <Image style={styles.img} source={avatar ? { uri: avatar } : profilePic} />

                            <Text numberOfLines={1} ellipsizeMode="tail " style={{ fontSize: 22, }} >
                                {chat.friendName}
                            </Text>
                        </View>
                    ) : (
                        <Text>Loading chat...</Text> // Placeholder while chat is being fetched
                    )}
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
                        <Pressable onPress={() => handleRemoveFriend(friendID)}><Text style={{ fontSize: 18, color: 'red', marginTop: 5, width: '90', }}> Remove</Text></Pressable>
                    </View>
                </View>
                <View style={styles.messageContainer}>
                    {chat && chat.messageData && chat.messageData.length > 0 ? (
                        <FlatList keyboardShouldPersistTaps="handled"
                            data={chat.messageData}
                            renderItem={({ item }) => {
                                const formattedTime = format(new Date(item.createdAt), "hh:mm a");
                                const dynamicBorderRadius = item.author === user._id
                                    ? { borderBottomRightRadius: 0 }
                                    : { borderBottomLeftRadius: 0 };
                                return (
                                    <View key={item._id} style={{ ...styles.messageBox, ...dynamicBorderRadius,backgroundColor:item.author===user._id? '#375FFF':'#ffffff' , alignSelf: item.author === user._id ? 'flex-end' : 'flex-start' }}>
                                        <Text style={{ fontSize: 17, color:item.author === user._id ? 'white':'black',paddingRight:10}}>
                                            {item.message}
                                        </Text>
                                        <Text style={{ alignSelf: 'flex-end', fontSize: 11, color:item.author === user._id ? 'white':'grey'  }}>{formattedTime}</Text>
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
                    <Pressable disabled={disable} style={{ marginLeft: '3%', }} onPress={() => sendMessage()}><Image source={sendIcon} style={{ height: 35, width: 35, marginBottom: 7 }} /></Pressable>
                </View>
            </KeyboardAvoidingView>
    </SafeAreaView> 
    );
};

export default MessageScreen;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#f7f7fc'
    },
    messageHeader: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        height: 70,
        paddingTop: 4,

    },
    headerName: {
        width: 250,
        // backgroundColor: 'green',
        flexDirection: 'row',
        // justifyContent: 'space-',
        marginLeft: 6,
        // flex: 1,
        alignItems: 'center',
    },
    img: {
        height: 50,
        width: 50,
        // backgroundColor: 'red',
        borderRadius: 80,
        marginRight: 12,
        // marginBottom:5

    },
    messageContainer: {
        // backgroundColor: 'red',
        paddingHorizontal: 15,
        flex: 1,
    },
    messageBox: {
        // backgroundColor: '#375FFF',
        minHeight: 40,
        paddingVertical:7,
        paddingHorizontal: 10,
        borderRadius: 15,
        marginBottom: 8,
        maxWidth: 320,
        // flexDirection:'row',
justifyContent:'flex-end',

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
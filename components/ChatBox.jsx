import axios from "../utils/axiosConfig";
import { Text, View, StyleSheet, Image, TouchableOpacity, Pressable, TouchableHighlight, TouchableNativeFeedback } from "react-native";
// import image from "../assets/images/icon.png";
axios.defaults.withCredentials = true; //The most important line for cookies
import { getSocket } from '../utils/socketService';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useState } from "react";
import { format } from 'date-fns';
import profilePic from "../assets/images/avatar.png";

const ChatBox = ({ avatar, name, friendID, userID }) => {
    const socket = getSocket();
    const navigation = useNavigation();
    const [latestMessage, setLatestMessage] = useState(undefined);
    const [unreadMessage, setUnreadMessage] = useState(undefined);
    const [senderID, setSenderID] = useState(undefined);
    const fetchLatestMessage = async () => {
        try {
            try {
                if (userID && friendID) {
                    const res = await axios.post(`/chat/getLatestMessage/${userID}`, { friendID });
                    const { data } = res;
                    if (data.success) {
                        // console.log(data.unreadMessage);
                        console.log(data)
                        setLatestMessage(data.latestMessage);
                        setUnreadMessage(data.unreadMessage);
                        setSenderID(data.senderID);
                    } else {
                        console.log(data);
                    }
                } else {
                    console.log('error is here', userID, friendID);
                }

            } catch (err) {
                console.log(err);
            }
        } catch (err) {
            console.log(err);

        }
    };
    useEffect(() => {
        socket.on('updateLatestMessage', (res) => {
            if (res) {
                console.log('Latest msg');
                fetchLatestMessage();
            } else {
                console.log(res);
            }
        });
        return () => {
            console.log('Latest msg off');
            socket.off("updateLatestMessage");
        };
    }, []);
    useFocusEffect(
        useCallback(() => {
            fetchLatestMessage();
        }, [])
    );

    return (
        <TouchableNativeFeedback    onPress={() => navigation.navigate('Message', { userID, friendID, avatar })}>
            <View style={styles.box}>
                <View style={styles.imgContainer}>

                <Image style={styles.img} source={avatar ? { uri: avatar } : profilePic} />
                </View>
                <View style={styles.textInfoContainer}>

                <View style={styles.textContainer}>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.latestMessage} numberOfLines={2} ellipsizeMode="tail ">{latestMessage ? latestMessage.message : 'Start a new conversation'}</Text>
                </View>
                <View style={styles.infoBox}>
                    <View style={styles.lastTime}>
                        <Text style={{ color: 'grey' }}>{latestMessage && format(new Date(latestMessage.createdAt), "hh:mm a")}</Text>
                    </View>
                    {unreadMessage && unreadMessage[userID] > 0 && (
                        <View style={styles.unread}>
                            <Text style={{ color: 'white', fontSize: 12 }} >{unreadMessage[userID]}</Text>
                        </View>
                    )
                    }

                </View>
                </View>

            </View>

        </TouchableNativeFeedback>
    );
};
export default ChatBox;
const styles = StyleSheet.create({
    box: {
        flexDirection: 'row',
        height: 80,
        width: '100%',
        marginHorizontal: 'auto',
        paddingLeft: 20,
        alignItems: 'center',
    },
    imgContainer:{
        width: '15%',
    }
,
    textInfoContainer:{
         borderWidth: 0.5,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderColor: '#E9ECEF',
        width: '85%',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 5,
height: '100%'
        
    },
    textContainer: {
        width: '60%',
    },
    infoBox: {
        height: '82%',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    lastTime: {
        width: '100%',
        height: '40%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    unread: {
        height: 25,
        width: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 45,
        marginBottom: 5,
        marginRight: 10
    },
    img: {
        height: 55,
        width: 55,
        borderRadius: 90
    },
    name: {
        marginBottom: 10,
        fontSize: 18,
        fontWeight: '500',
        // backgroundColor: 'green'
    },
    latestMessage: {
        fontSize: 15,
        color: 'grey'
    }
});
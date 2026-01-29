import axios from "../utils/axiosConfig";
import { Text, View, StyleSheet, Alert, Image, Button, TouchableOpacity, Pressable, TouchableHighlight, TouchableNativeFeedback } from "react-native";
import image from "../assets/images/avatar.png";
import requestIcon from "../assets/images/requestIcon.png";
import acceptIcon from "../assets/images/acceptRequest.png";
import declineIcon from "../assets/images/declineRequest.png";
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { useDispatch, useSelector } from "react-redux";
import { setIsLoggedIn, setUser, setPendingRequest } from "../reducer/authSlice.js";

const PendingRequestBox = ({ avatar, name, userID, pendingID }) => {
    const dispatch = useDispatch();

    const user = useSelector((state) => state.auth.user);
    axios.defaults.withCredentials = true; //The most important line for cookies
    const navigation = useNavigation();
    const handleDeclineRequest = async (userID, pendingID) => {
        try {
            Alert.alert('Decline Request', "Decline this request?", [
                {
                    text: 'Cancel',
                    onPress: () => null,
                    style: 'cancel',
                },
                {
                    text: 'YES', onPress: async () => {
                        let res = await axios.post('/declineRequest', { userID, pendingID });
                        const { data } = res;
                        if (data.success) {
                            dispatch(setPendingRequest(data.pendingRequest));
                        } else {
                        }
                    }
                }, // Exits the app
            ]);

        } catch (err) {
            console.log(err);

        }
    };
    const handleAcceptRequest = async (userID, pendingID) => {
        try {
            Alert.alert('Add Friend', "Accept this request?", [
                {
                    text: 'Cancel',
                    onPress: () => null,
                    style: 'cancel',
                },
                {
                    text: 'YES', onPress: async () => {
                        try {
                            let res = await axios.post('/acceptRequest', { userID, pendingID });
                            console.log('lets see aaya ki nhi');
                            const { data } = res;
                            if (data.success) {
                                dispatch(setUser(data.user));
                                dispatch(setPendingRequest(data.user.pendingRequest));
                            } else {
                                dispatch(setPendingRequest(data.pendingRequest));
                                console.log(data.msg);
                            }
                        } catch (err) {
                            console.log(err);
                        }
                    }
                }, // Exits the app
            ]);

        } catch (err) {
            console.log(err);

        }
    };
    return (
        // <TouchableNativeFeedback >
        <View style={styles.box}>
            <Image style={styles.img} source={image} />
            <View style={styles.textContainer}>
                <Text style={styles.name}>{name}</Text>
                <Pressable style={styles.requestBtn} onPress={() => handleDeclineRequest(userID, pendingID)} ><Image source={declineIcon} style={{ height: 20, width: 20, marginRight: 30 }} /></Pressable>
                <Pressable style={styles.requestBtn} onPress={() => handleAcceptRequest(userID, pendingID)} ><Image source={acceptIcon} style={{ height: 20, width: 20 }} /></Pressable>
            </View>
        </View>

        // </TouchableNativeFeedback>
    );
};
export default PendingRequestBox;
const styles = StyleSheet.create({
    box: {
        flexDirection: 'row',
        height: 80,
        width: '90%',
        marginHorizontal: 'auto',
        // paddingLeft: 20,
        // backgroundColor: 'red',
        alignItems: 'center',
        borderColor: 'gray',
        borderBottomWidth: 1,
        // borderRadius: 15
    },
    textContainer: {
        flexDirection: 'row',
        // backgroundColor: 'orange',
        paddingHorizontal: 15,
        width: '80%',
        height: 50,
        alignItems: 'center'
        // paddingVertical: 5
    },
    requestBtn: {
        flexDirection: 'row-reverse',
        // backgroundColor: 'red'
    },
    img: {
        height: 55,
        width: 55,
        borderRadius: 15
    },
    name: {
        // marginBottom: 10,
        fontSize: 19,
        fontWeight: '500',
        // backgroundColor: 'green',
        width: 190
    },
    latestMessage: {
        fontSize: 15
    }
});
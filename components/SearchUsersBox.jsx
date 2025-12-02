import axios from "../utils/axiosConfig";
import { Text, View, StyleSheet, Alert, Image, Button, TouchableOpacity, Pressable, TouchableHighlight, TouchableNativeFeedback } from "react-native";
import image from "../assets/images/avatar.png";
import requestIcon from "../assets/images/requestIcon.png";
import { useNavigation } from '@react-navigation/native';
import { getSocket } from '../utils/socketService';  // Import socketService
import { setIsLoggedIn, setPendingRequest, setUser } from "../reducer/authSlice.js";
import { useDispatch, useSelector } from "react-redux";


const SearchUsersBox = ({ avatar, name, userID, friendID, fetchPendingRequest }) => {

    const dispatch = useDispatch();
    const socket = getSocket();  // Get the already initialized socket instance
    axios.defaults.withCredentials = true; //The most important line for cookies
    const handleAddFriend = async (userID, friendID) => {
        try {
            Alert.alert('Add Friend', 'Are you sure you want to add this nigga?', [
                {
                    text: 'Cancel',
                    onPress: () => null,
                    style: 'cancel',
                },
                {
                    text: 'YES', onPress: async () => {
                        try {
                            let res = await axios.post('/sendRequest', { userID, friendID });
                            const { data } = res;
                            if (data.success) {
                                socket.emit('friendRequest', friendID, (response) => {
                                    dispatch(setUser(data.user));
                                    console.log(response);
                                });
                            } else {
                                console.log(data);
                            }
                        } catch (err) {
                            console.log(err);

                        }
                    }
                },
            ]);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        // <TouchableNativeFeedback >
        <View style={styles.box}>
            <Image style={styles.img} source={image} />
            <View style={styles.textContainer}>
                <Text style={styles.name}>{name}</Text>
                <Pressable style={styles.requestBtn} onPress={() => handleAddFriend(userID, friendID)} ><Image source={requestIcon} style={{ height: 30, width: 30 }} /></Pressable>
            </View>
        </View>

        // </TouchableNativeFeedback>
    );
};
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
        width: 230
    },
    latestMessage: {
        fontSize: 15
    }
});

export default SearchUsersBox;
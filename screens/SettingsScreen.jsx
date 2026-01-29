import { Text, View, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { setExpoPushToken, setIsLoggedIn, setUser } from "../reducer/authSlice.js";
import * as SecureStore from 'expo-secure-store';
import { getSocket } from '../utils/socketService';  // Import socketService

const SettingsScreen = ({ navigation }) => {
    const socket = getSocket();  // Get the already initialized socket instance

    const dispatch = useDispatch();
    const logoutAlert = () => {
        Alert.alert('Confirmation', 'Are you sure you want to logout?', [
            {
                text: 'Cancel',
                onPress: () => null,
                style: 'cancel',
            },
            { text: 'YES', onPress: () => handleLogout() }
        ]);
    };
    const handleLogout = async () => {
        try {
            await SecureStore.deleteItemAsync('token');
            await SecureStore.deleteItemAsync('expoPushToken');
            dispatch(setIsLoggedIn(false));
            dispatch(setUser({}));
            dispatch(setExpoPushToken(null));
            navigation.replace('Verification');
            socket.disconnect();
            console.log('Successfully Logged Out');
        } catch (err) {
            console.log(err.response.data.err);
        }
    };
    return (
        <View style={{ backgroundColor: 'white', flex: 1 }}>
            <View style={styles.header} >
                <Text style={styles.headerText}>Settings</Text>
                <TouchableOpacity onPress={logoutAlert} >
                    <Text style={{ fontSize: 20, color: 'red' }}>Log out</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.container}>
                <Text style={{ fontSize: 20 }}>Coming soon...</Text>
            </View>
        </View>
    );
};
export default SettingsScreen;
const styles = StyleSheet.create({
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
        width: 80,

    },
    container: {
        // backgroundColor: 'red',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
import { Text, View, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { setIsLoggedIn, setUser } from "../reducer/authSlice.js";
import * as SecureStore from 'expo-secure-store';

export default SettingsScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const logoutAlert = () => {
        Alert.alert('Confirmation', 'Are you sure you want to Logout?', [
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
            // setIsLoading(true);
            // setDisable(true);
            // let res = await axios.post('/home', { user });
            // if (res.data.success) {
            // setName(res.data.user.firstname);
            // } else {
            // console.log(res.data);
            // }
            await SecureStore.deleteItemAsync('token');
            dispatch(setIsLoggedIn(false));
            dispatch(setUser({}));
            navigation.navigate('Verification');
            console.log('Successfully Logged Out');
        } catch (err) {
            console.log(err.response.data.err);
        }
    };
    return (
        <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
            <Text>Settings Screen</Text>
            <TouchableOpacity onPress={logoutAlert} >
                <Text>Log out</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};
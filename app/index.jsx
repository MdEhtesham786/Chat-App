import { View, Text, SafeAreaView } from "react-native";
import { NavigationConatiner } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Provider } from 'react-redux';
import store from "../store.js";
import WalkthroughScreen from "../screens/WalkthroughScreen";
import VerificationScreen from "../screens/Verification";
import OtpScreen from "../screens/OtpScreen";
import ProfileScreen from "../screens/ProfileScreen";
import HomeScreen from "../screens/HomeScreen";
import CheckScreen from "../screens/CheckScreen";
const Stack = createNativeStackNavigator();

export default App = () => {

    return (
        <Provider store={store}>
            <Stack.Navigator initialRouteName="Walthrough">
                <Stack.Screen name="Walkthrough" component={WalkthroughScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Verification" component={VerificationScreen} options={{ headerShown: false }} />
                <Stack.Screen name="OTP" component={OtpScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
                <Stack.Screen name="CheckScreen" component={CheckScreen} options={{ headerShown: false }} />
            </Stack.Navigator>
        </Provider>
    );
};
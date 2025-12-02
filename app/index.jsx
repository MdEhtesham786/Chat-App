import { View, Text, SafeAreaView } from "react-native";
import { NavigationConatiner } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Provider } from 'react-redux';
import store from "../store";
import WalkthroughScreen from "../screens/WalkthroughScreen";
import VerificationScreen from "../screens/Verification";
import OtpScreen from "../screens/OtpScreen";
import ProfileScreen from "../screens/ProfileScreen";
import HomeScreen from "../screens/HomeScreen";
import CheckScreen from "../screens/CheckScreen";
import MessageScreen from "../screens/MessageScreen";
import AddFriendScreen from "../screens/AddFriendScreen";
// import FlashMessage from "react-native-flash-message";

// function App() {
//   return (
//     <View style={{ flex: 1 }}>
//       <View ref={"otherView1"} />
//       <View ref={"otherView2"} />
//       <View ref={"otherView3"} />
//       {/* GLOBAL FLASH MESSAGE COMPONENT INSTANCE */}
//       <FlashMessage position="top" /> {/* <--- here as the last component */}
//     </View>
//   );
// }
const Stack = createNativeStackNavigator();

const App = () => {

    return (
        <Provider store={store}>
            <Stack.Navigator initialRouteName="Walkthrough">
                <Stack.Screen name="Walkthrough" component={WalkthroughScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Verification" component={VerificationScreen} options={{ headerShown: false }} />
                <Stack.Screen name="OTP" component={OtpScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
                <Stack.Screen name="CheckScreen" component={CheckScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Message" component={MessageScreen} options={{ headerShown: false }} />
                <Stack.Screen name="AddFriend" component={AddFriendScreen} options={{ headerShown: false }} />
            </Stack.Navigator>
        </Provider>
    );
};
export default App;

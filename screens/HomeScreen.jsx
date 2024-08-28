
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, Text } from "react-native";
import AboutScreen from './AboutScreen.jsx';
import ChatScreen from './ChatScreen.jsx';
import SettingsScreen from './SettingsScreen.jsx';
import chatIcon from "../assets/images/chatIcon.png";
import profileIcon from "../assets/images/profileIcon.png";
import settingsIcon from "../assets/images/settingsIcon.png";
const Tab = createBottomTabNavigator();

export default HomeScreen = () => {
    return (
        <Tab.Navigator initialRouteName="chat" screenOptions={({ route }) => ({
            tabBarStyle: { height: 80 },
            tabBarIcon: ({ focused, color, size }) => {
                let iconSource;
                // Determine the icon based on the route name
                switch (route.name) {
                    case 'profile':
                        iconSource = profileIcon;
                        break;
                    case 'chat':
                        iconSource = chatIcon;
                        break;
                    case 'settings':
                        iconSource = settingsIcon;
                        break;
                    default:
                        iconSource = null;
                }
                size = 40;
                return (
                    <Image
                        source={iconSource}
                        style={{ width: size, height: size, tintColor: color }}
                    />
                );
            },
            tabBarLabel: ({ focused, color }) => {
                // Display text labels for all tabs
                if (route.name === 'profile') {
                    return <Text style={{ color: focused ? 'tomato' : color }}>Profile</Text>;
                } else if (route.name === 'chat') {
                    return <Text style={{ color: focused ? 'tomato' : color }}>Chats</Text>;
                } else if (route.name === 'settings') {
                    return <Text style={{ color: focused ? 'tomato' : color }}>Settings</Text>;
                }
            },
        })} >
            <Tab.Screen name="profile" component={AboutScreen} options={{ headerShown: false }} />
            <Tab.Screen name="chat" component={ChatScreen} options={{ headerShown: false }} />
            <Tab.Screen name="settings" component={SettingsScreen} options={{ headerShown: false }} />
        </Tab.Navigator>
    );
};

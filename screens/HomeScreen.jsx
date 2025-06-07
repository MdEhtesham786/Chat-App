
// import firebaseApp from "../utils/firebaseConfig.js"; // Ensure Firebase is initialized
import { getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, Text, BackHandler, Alert, Platform } from "react-native";
import AboutScreen from './AboutScreen.jsx';
import ChatScreen from './ChatScreen.jsx';
import SettingsScreen from './SettingsScreen.jsx';
import chatIcon from "../assets/images/chatIcon.png";
import profileIcon from "../assets/images/profileIcon.png";
import settingsIcon from "../assets/images/settingsIcon.png";
import { useMemo, useEffect, useRef, useState } from "react";
const Tab = createBottomTabNavigator();
import * as SecureStore from 'expo-secure-store';
import { useDispatch, useSelector } from "react-redux";
import { setIsLoggedIn, setUser, setPendingRequest, setFriendList, setExpoPushToken } from "../reducer/authSlice.js";
import { setChat } from "../reducer/chatSlice.js";
import { useNetInfo } from '@react-native-community/netinfo';
import { initializeSocket, disconnectSocket, reconnectSocket } from '../utils/socketService';
import BackButton from "../components/BackButton";
import { useIsFocused, useNavigation } from '@react-navigation/native';
import axios from "../utils/axiosConfig.js";
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Application from "expo-application";

// const url = process.env.EXPO_PUBLIC_API_URL || 'https://chat-app-backend-r1qt.onrender.com/api/v1';
const socketURL = process.env.EXPO_PUBLIC_SOCKET_URL;

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});
function handleRegistrationError(errorMessage) {
    alert(errorMessage);
    throw new Error(errorMessage);
}
async function registerForPushNotificationsAsync() {
    try {
        const pushTokenString = (
            await Notifications.getExpoPushTokenAsync({
                projectId,
            })
        ).data;
        console.log(pushTokenString);
        return pushTokenString;
    } catch (e) {
        handleRegistrationError(`${e}`);
    }
}

export default HomeScreen = () => {
    // const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(undefined);
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const netInfo = useNetInfo();
    const memoizedNetInfo = useMemo(() => netInfo, [netInfo.isConnected]);
    const socketURL = process.env.EXPO_PUBLIC_SOCKET_URL;
    const socketRef = useRef(null);
    const isSocketInitialized = useRef(false);
    const navigation = useNavigation();
    const getValueFor = async (key) => {

        let result = await SecureStore.getItemAsync(key);
        return result;
    };

    const fetchSavedExpoPushToken = async () => {
        try {
            let res = await axios.post('/getExpoPushToken', { userID: user._id });
            const { data } = res;
            if (data.success) {
                dispatch(setExpoPushToken(data.savedExpoPushToken));
                console.log('Saved Expo Push Token fetched successfully', data.savedExpoPushToken);
                return data.savedExpoPushToken;
            } else {
                console.log('err', data);
            }
        } catch (err) {
            console.log('error', err);
        }
    };
    useEffect(() => {
        if (Platform.OS === 'android') {
            console.log('channel is running');
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }
        fetchSavedExpoPushToken().then(async (savedExpoPushToken) => {
            if (Device.isDevice) {
                const { status: existingStatus } = await Notifications.getPermissionsAsync();
                let finalStatus = existingStatus;
                if (existingStatus !== 'granted') {
                    const { status } = await Notifications.requestPermissionsAsync();
                    finalStatus = status;
                }
                if (finalStatus !== 'granted') {
                    handleRegistrationError('Permission not granted to get push token for push notification!');
                    return;
                }
                const projectId =
                    Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
                if (!projectId) {
                    handleRegistrationError('Project ID not found');
                }

            } else {
                handleRegistrationError('Must use physical device for push notifications');
            }
            if (!savedExpoPushToken) {
                registerForPushNotificationsAsync()
                    .then(expoToken => {
                        if (expoToken) {
                            dispatch(setExpoPushToken(expoToken ?? ''));
                            getValueFor('token')
                                .then((token) => {
                                    if (token) {
                                        axios.post('/saveExpoPushToken', { token, expoToken })
                                            .then(() => {
                                                console.log('Expo Push Token saved successfully');
                                            })
                                            .catch((error) => {
                                                console.error('Error saving Expo Push Token:', error);
                                            });
                                    }
                                })
                                .catch((error) => console.error('Error getting user data:', error));
                        }
                    })
                    .catch((error) => setExpoPushToken(`${error}`));
            } else {
                dispatch(setExpoPushToken(savedExpoPushToken ?? ''));
            }
        });
        const notificationListener = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
            console.log('jhaatu', response);
        });

        return () => {
            notificationListener.remove();
            responseListener.remove();
        };
    }, []);
    const fetchPendingRequest = async () => {
        try {
            let res = await axios.post('/pendingRequest', { userID: user._id });
            const { data } = res;
            if (data.success) {
                dispatch(setPendingRequest(data.pendingRequest));
            } else {
                console.log('err', data);
            }
        } catch (err) {
            console.log('error', err);
        }
    };
    const fetchChat = async (userID, friendID) => {
        try {
            const res = await axios.post(`/chat/getChat/${userID}`, { friendID });
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
    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = initializeSocket(socketURL);
        }
        return () => {
            if (socketRef.current) {
                disconnectSocket();
                console.log('Socket disconnected on unmount');
            }
        };
    }, []);
    useEffect(() => {

        if (memoizedNetInfo.isConnected === null) {
            return;
        }
        if (memoizedNetInfo.isConnected && !isSocketInitialized.current) {
            console.log('App is online. Reconnecting socket...');
            reconnectSocket(); //
            socketRef.current.emit("login", user._id);
            isSocketInitialized.current = true;
        } else if (!memoizedNetInfo.isConnected) {
            console.log('App is offline. Disconnecting socket...');
            disconnectSocket(); //
            isSocketInitialized.current = false;
        }
    }, [memoizedNetInfo.isConnected]);
    useEffect(() => {
        console.log('on');
        socketRef.current.on('updatePendingRequest', (res) => {
            if (res) {
                console.log('update hua');

                fetchPendingRequest();
            } else {
                console.log(res);
            }
        });

        return () => {
            socketRef.current.off('updatePendingRequest');
        };
    }, [socketRef.current]);
    const isFocused = useIsFocused(); // Check if the screen is focused
    useEffect(() => {
        if (!isFocused) return;

        const backAction = () => {
            Alert.alert('Hold on!', 'Are you sure you want to exit the app?', [
                {
                    text: 'Cancel',
                    onPress: () => null,
                    style: 'cancel',
                },
                { text: 'YES', onPress: () => BackHandler.exitApp() }, // Exits the app
            ]);
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );

        return () => backHandler.remove();
    }, [isFocused]);
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

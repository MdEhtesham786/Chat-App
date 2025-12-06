
// import firebaseApp from "../utils/firebaseConfig.js"; // Ensure Firebase is initialized
// import { getApps } from "firebase/app";
// import { getAuth } from "firebase/auth";
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


function handleRegistrationError(errorMessage) {
    alert(errorMessage);
    throw new Error(errorMessage);
}
async function registerForPushNotificationsAsync() {
    try {
        const projectId =
            Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        if (!projectId) {
            handleRegistrationError('Project ID not found');
        }
        const pushTokenString = (
            await Notifications.getExpoPushTokenAsync({
                projectId,
            })
        ).data;
        // console.log(pushTokenString);
        return pushTokenString;
    } catch (e) {
        handleRegistrationError(`${e}`);
    }
}

const HomeScreen = () => {
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
                // console.log('Saved ExpoToken', data.savedExpoPushToken);
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
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldPlaySound: true,
                shouldSetBadge: true,
                shouldShowBanner: true,  // Show as banner (pop-up)
                shouldShowList: true
            }),
        });
        fetchSavedExpoPushToken().then(async (savedExpoPushToken) => {
            if (Device.isDevice) {
                const { status: existingStatus } = await Notifications.getPermissionsAsync();
                console.log('Permission status', existingStatus);

                let finalStatus = existingStatus;
                if (existingStatus !== 'granted') {
                    const { status } = await Notifications.requestPermissionsAsync();
                    finalStatus = status;
                }
                if (finalStatus !== 'granted') {
                    handleRegistrationError('Permission not granted to get push token for push notification!');
                    return;
                }

            } else {
                handleRegistrationError('Must use physical device for push notifications');
            }
            registerForPushNotificationsAsync()
                .then(expoToken => {
                    if (expoToken) {
                        dispatch(setExpoPushToken(expoToken ?? ''));
                        if (expoToken === savedExpoPushToken) {
                            // console.log('Expo push token are same, not updating');
                        } else {
                            getValueFor('token')
                                .then((token) => {
                                    if (token) {
                                        axios.post('/saveExpoPushToken', { token, expoToken })
                                            .then(() => {
                                                console.log('Expo Push Token updated successfully');
                                            })
                                            .catch((error) => {
                                                console.error('Error saving Expo Push Token:', error);
                                            });
                                    }
                                })
                                .catch((error) => console.error('Error getting user data:', error));
                        }
                    }
                })
                .catch((error) => setExpoPushToken(`${error}`));

        });
        const notificationListener = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
            console.log('Notification response received:', response);
            const data = response.notification.request.content.data;
            if (data?.type === 'friendRequest') {
                navigation.navigate('AddFriend');
            } else if (data.type === 'sendMessage') {
                // fetchChat(user._id, data.friendID);
                navigation.navigate('Message', { friendID: data.friendID, userID: data.userID });
            }
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


//Initialize Socket
 useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = initializeSocket(socketURL);
        }
        return () => {
            if (socketRef.current) {
                disconnectSocket();
                console.log('Socket disconnected');
            }
        };
    }, []);
// Handle socket connection and online user update
useEffect(() => {
  if (!socketRef.current) return;

  const socket = socketRef.current;
  const handleConnect = () => {
    console.log("Socket connected:", socket.id);
    if (user?._id) {
      socket.emit("login", user._id)
    }
  };

  socket.on("connect", handleConnect);
  return () => {
    socket.off("connect", handleConnect);
  };
}, [user?._id]);

// Handles network changes
    useEffect(() => {
  if (!socketRef.current) return;

  if (memoizedNetInfo.isConnected) {
    console.log("App is online. Reconnecting socket...");
    isSocketInitialized.current = true;

    reconnectSocket();
  } else {
    console.log("App is offline. Disconnecting socket...");
    disconnectSocket(); // or socketRef.current.disconnect()
    isSocketInitialized.current = false;
  }
}, [memoizedNetInfo.isConnected]);


useEffect(() => {
  if (!socketRef.current) return;    // <-- this line is the difference
  const socket = socketRef.current;

  console.log("Registering updatePendingRequest listener");

  const handler = (res) => {
    if (res) {
      console.log("update hua");
      fetchPendingRequest();
    } else {
      console.log(res);
    }
  };

  socket.on("updatePendingRequest", handler);

  return () => {
    socket.off("updatePendingRequest", handler);
  };
}, []);
// or: [user?._id]

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
export default HomeScreen;
// import { initializeApp, getApp, getApps } from "firebase/app";
// import { getReactNativePersistence, initializeAuth } from "firebase/auth";
// // import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as SecureStore from "expo-secure-store";

// // 🔥 Replace with your Firebase credentials (from Firebase Console)
// const firebaseConfig = {
//     apiKey: "AIzaSyC7BP8O8wjByMuWkzddnnjYx0RU1mz7xsM",
//     authDomain: "chat-app-58a22.firebaseapp.com",
//     projectId: "chat-app-58a22",
//     storageBucket: "chat-app-58a22.appspot.com",//chat-app-58a22.firebasestorage.app
//     messagingSenderId: "522160605127",
//     appId: "1:522160605127:web:68aac2c05ac306c90e7be2",
// };

// const securePersistence = {
//     setItem: async (key, value) => await SecureStore.setItemAsync(key, value),
//     getItem: async (key) => await SecureStore.getItemAsync(key),
//     removeItem: async (key) => await SecureStore.deleteItemAsync(key),
// };
// let firebaseApp;
// if (getApps().length === 0) {
//     console.log('idr aaya');
//     firebaseApp = initializeApp(firebaseConfig);
//     initializeAuth(firebaseApp, {
//         persistence: getReactNativePersistence(securePersistence),
//     });
// } else {
//     firebaseApp = getApp();
//     console.log('Firebase app already initialized');
// }
// export default firebaseApp;

// import { EXPO_API_URL } from '@env';
// Create an instance of axios with default configuration
// console.log(EXPO_API_URL);
import axios from 'axios';
import { useState } from "react";
// Create an instance of axios with default configuration
console.log(process.env.EXPO_PUBLIC_API_URL);
const instance = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL || 'https://chat-app-backend-r1qt.onrender.com/api/v1' // Use environment variable for base URL
});

export default instance;
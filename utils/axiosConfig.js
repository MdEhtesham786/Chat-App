import axios from 'axios';
import { useState } from "react";
// import { API_URL } from "@env";
const API_URL = 'abcd';
// Create an instance of axios with default configuration
const instance = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL || 'https://chat-app-backend-b3ys.onrender.com/api/v1' // Use environment variable for base URL
});

export default instance;
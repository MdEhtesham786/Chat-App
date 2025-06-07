// socketService.js
import io from 'socket.io-client';
let socket;

export const initializeSocket = (url) => {
    if (!socket) {
        socket = io(url);
    }
    return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
    }
};

export const reconnectSocket = () => {
    if (socket && socket.disconnected) {
        socket.connect();
    }
};
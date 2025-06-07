import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    isLoggedIn: false,
    user: {},
    pendingRequest: [],
    friendList: [],
    expoPushToken: null

};
export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setIsLoggedIn: (state, action) => {
            state.isLoggedIn = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setPendingRequest: (state, action) => {
            state.pendingRequest = action.payload;
        },
        setFriendList: (state, action) => {
            state.friendList = action.payload;
        },
        setExpoPushToken: (state, action) => {
            state.expoPushToken = action.payload;
        }

    }
});
export const { setIsLoggedIn, setUser, setPendingRequest, setFriendList, setExpoPushToken } = authSlice.actions;
export default authSlice.reducer;
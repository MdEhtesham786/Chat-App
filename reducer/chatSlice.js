import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    chat: {},
    currentChatOpen: ''
};
export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setChat: (state, action) => {
            state.chat = action.payload;
        },
        setCurrentChatOpen: (state, action) => {
            state.currentChatOpen = action.payload;
        }
    }
});
export const { setChat, setCurrentChatOpen } = chatSlice.actions;
export default chatSlice.reducer;
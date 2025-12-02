import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authSlice";
import chatReducer from "./reducer/chatSlice";
// import adminSettingReducer from "./reducer/adminSettingsSlice";
const store = configureStore({
    reducer: {
        auth: authReducer,
        chat: chatReducer
        // adminSettings: adminSettingReducer
    }
});
export default store;
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authSlice";
// import adminSettingReducer from "./reducer/adminSettingsSlice";
const store = configureStore({
    reducer: {
        auth: authReducer,
        // adminSettings: adminSettingReducer
    }
});
export default store;
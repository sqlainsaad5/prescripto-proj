import { configureStore } from '@reduxjs/toolkit';
import doctorReducer from './slices/doctorSlice';
import userReducer from './slices/userSlice';
import appReducer from './slices/appSlice';

export const store = configureStore({
    reducer: {
        doctor: doctorReducer,
        user: userReducer,
        app: appReducer,
    },
});

import { configureStore } from '@reduxjs/toolkit';
import adminReducer from './slices/adminSlice';
import doctorReducer from './slices/doctorSlice';
import appReducer from './slices/appSlice';

export const store = configureStore({
    reducer: {
        admin: adminReducer,
        doctor: doctorReducer,
        app: appReducer,
    },
});

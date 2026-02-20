import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const registerUser = createAsyncThunk('user/register', async ({ name, email, password }, { dispatch, rejectWithValue }) => {
    try {
        const { data } = await axios.post(backendUrl + "/api/user/register", { name, email, password });
        if (data.success) {
            localStorage.setItem("token", data.token);
            dispatch(setToken(data.token));
            return data.token;
        } else {
            toast.error(data.message);
            return rejectWithValue(data.message);
        }
    } catch (error) {
        toast.error(error.message);
        return rejectWithValue(error.message);
    }
});

export const loginUser = createAsyncThunk('user/login', async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
        const { data } = await axios.post(backendUrl + "/api/user/login", { email, password });
        if (data.success) {
            localStorage.setItem("token", data.token);
            dispatch(setToken(data.token));
            return data.token;
        } else {
            toast.error(data.message);
            return rejectWithValue(data.message);
        }
    } catch (error) {
        toast.error(error.message);
        return rejectWithValue(error.message);
    }
});

export const loadUserProfileData = createAsyncThunk('user/loadProfile', async (_, { getState, rejectWithValue }) => {
    try {
        const { token } = getState().user;
        const { data } = await axios.get(backendUrl + '/api/user/get-profile', { headers: { token } });
        if (data.success) {
            return data.userData;
        } else {
            toast.error(data.message);
            return rejectWithValue(data.message);
        }
    } catch (error) {
        toast.error(error.message);
        return rejectWithValue(error.message);
    }
});

const userSlice = createSlice({
    name: 'user',
    initialState: {
        token: localStorage.getItem('token') || false,
        userData: false,
    },
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
            if (action.payload) {
                localStorage.setItem('token', action.payload);
            } else {
                localStorage.removeItem('token');
            }
        },
        setUserData: (state, action) => {
            state.userData = action.payload;
        },
        logout: (state) => {
            state.token = false;
            state.userData = false;
            localStorage.removeItem('token');
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loadUserProfileData.fulfilled, (state, action) => {
            state.userData = action.payload;
        });
    }
});

export const { setToken, setUserData, logout } = userSlice.actions;
export default userSlice.reducer;

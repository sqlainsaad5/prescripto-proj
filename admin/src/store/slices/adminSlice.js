import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const loginAdmin = createAsyncThunk('admin/login', async ({ email, password }, { rejectWithValue }) => {
    try {
        const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password });
        if (data.success) {
            localStorage.setItem('aToken', data.token);
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

export const getAllDoctors = createAsyncThunk('admin/getAllDoctors', async (_, { getState, rejectWithValue }) => {
    try {
        const { aToken } = getState().admin;
        const { data } = await axios.post(backendUrl + '/api/admin/all-doctors', {}, { headers: { aToken } });
        if (data.success) {
            return data.doctors;
        } else {
            toast.error(data.message);
            return rejectWithValue(data.message);
        }
    } catch (error) {
        toast.error(error.message);
        return rejectWithValue(error.message);
    }
});

export const changeAvailability = createAsyncThunk('admin/changeAvailability', async (docId, { getState, dispatch, rejectWithValue }) => {
    try {
        const { aToken } = getState().admin;
        const { data } = await axios.post(backendUrl + '/api/admin/change-availability', { docId }, { headers: { aToken } });
        if (data.success) {
            toast.success(data.message);
            dispatch(getAllDoctors());
            return true;
        } else {
            toast.error(data.message);
            return rejectWithValue(data.message);
        }
    } catch (error) {
        toast.error(error.message);
        return rejectWithValue(error.message);
    }
});

export const getAllAppointments = createAsyncThunk('admin/getAllAppointments', async (_, { getState, rejectWithValue }) => {
    try {
        const { aToken } = getState().admin;
        const { data } = await axios.get(backendUrl + '/api/admin/appointments', { headers: { aToken } });
        if (data.success) {
            return data.appointments;
        } else {
            toast.error(data.message);
            return rejectWithValue(data.message);
        }
    } catch (error) {
        toast.error(error.message);
        return rejectWithValue(error.message);
    }
});

export const cancelAppointment = createAsyncThunk('admin/cancelAppointment', async (appointmentId, { getState, dispatch, rejectWithValue }) => {
    try {
        const { aToken } = getState().admin;
        const { data } = await axios.post(backendUrl + '/api/admin/appointment-cancel', { appointmentId }, { headers: { aToken } });
        if (data.success) {
            toast.success(data.message);
            dispatch(getAllAppointments());
            return true;
        } else {
            toast.error(data.message);
            return rejectWithValue(data.message);
        }
    } catch (error) {
        toast.error(error.message);
        return rejectWithValue(error.message);
    }
});

export const getDashData = createAsyncThunk('admin/getDashData', async (_, { getState, rejectWithValue }) => {
    try {
        const { aToken } = getState().admin;
        const { data } = await axios.get(backendUrl + '/api/admin/dashboard', { headers: { aToken } });
        if (data.success) {
            return data.dashData;
        } else {
            toast.error(data.message);
            return rejectWithValue(data.message);
        }
    } catch (error) {
        toast.error(error.message);
        return rejectWithValue(error.message);
    }
});

export const addDoctor = createAsyncThunk('admin/addDoctor', async (formData, { getState, rejectWithValue }) => {
    try {
        const { aToken } = getState().admin;
        const { data } = await axios.post(backendUrl + "/api/admin/add-doctor", formData, { headers: { aToken } });
        if (data.success) {
            toast.success(data.message);
            return true;
        } else {
            toast.error(data.message);
            return rejectWithValue(data.message);
        }
    } catch (error) {
        toast.error(error.message);
        return rejectWithValue(error.message);
    }
});

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        aToken: localStorage.getItem('aToken') || '',
        doctors: [],
        appointments: [],
        dashData: false,
    },
    reducers: {
        setAToken: (state, action) => {
            state.aToken = action.payload;
            if (action.payload) {
                localStorage.setItem('aToken', action.payload);
            } else {
                localStorage.removeItem('aToken');
            }
        },
        logoutAdmin: (state) => {
            state.aToken = '';
            localStorage.removeItem('aToken');
            state.doctors = [];
            state.appointments = [];
            state.dashData = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginAdmin.fulfilled, (state, action) => {
                state.aToken = action.payload;
            })
            .addCase(getAllDoctors.fulfilled, (state, action) => {
                state.doctors = action.payload;
            })
            .addCase(getAllAppointments.fulfilled, (state, action) => {
                state.appointments = action.payload;
            })
            .addCase(getDashData.fulfilled, (state, action) => {
                state.dashData = action.payload;
            });
    }
});

export const { setAToken, logoutAdmin } = adminSlice.actions;

export default adminSlice.reducer;

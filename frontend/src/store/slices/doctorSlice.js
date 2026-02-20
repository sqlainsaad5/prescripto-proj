import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const getDoctorsData = createAsyncThunk('doctors/getDoctorsData', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(backendUrl + '/api/doctor/list');
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

const doctorSlice = createSlice({
    name: 'doctors',
    initialState: {
        doctors: [],
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getDoctorsData.pending, (state) => {
                state.loading = true;
            })
            .addCase(getDoctorsData.fulfilled, (state, action) => {
                state.doctors = action.payload;
                state.loading = false;
            })
            .addCase(getDoctorsData.rejected, (state) => {
                state.loading = false;
            });
    }
});

export default doctorSlice.reducer;

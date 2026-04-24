import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { apiClient } from '../../api/client';
import { getApiErrorMessage } from '../../utils/apiError';

export const getDoctorsData = createAsyncThunk('doctors/getDoctorsData', async (_, { rejectWithValue }) => {
    try {
        const { data } = await apiClient.get('/api/doctor/list');
        if (data.success) {
            return data.doctors;
        } else {
            toast.error(data.message);
            return rejectWithValue(data.message);
        }
    } catch (error) {
        const message = getApiErrorMessage(error);
        toast.error(message);
        return rejectWithValue(message);
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

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { apiClient } from '../../api/client';
import { getApiErrorMessage } from '../../utils/apiError';

export const loginDoctor = createAsyncThunk('doctor/login', async ({ email, password }, { rejectWithValue }) => {
    try {
        const { data } = await apiClient.post('/api/doctor/login', { email, password });
        if (data.success) {
            localStorage.setItem('dToken', data.token);
            toast.success("Login Successful");
            return data.token;
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

export const getDoctorAppointments = createAsyncThunk('doctor/getAppointments', async (_, { getState, rejectWithValue }) => {
    try {
        const { dToken } = getState().doctor;
        const { data } = await apiClient.get('/api/doctor/appointment', { headers: { dToken } });
        if (data.success) {
            return data.appointments;
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

export const completeAppointment = createAsyncThunk('doctor/completeAppointment', async (appointmentId, { getState, dispatch, rejectWithValue }) => {
    try {
        const { dToken } = getState().doctor;
        const { data } = await apiClient.post('/api/doctor/complete-appointment', { appointmentId }, { headers: { dToken } });
        if (data.success) {
            toast.success(data.message);
            dispatch(getDoctorAppointments());
            return true;
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

export const cancelDoctorAppointment = createAsyncThunk('doctor/cancelAppointment', async (appointmentId, { getState, dispatch, rejectWithValue }) => {
    try {
        const { dToken } = getState().doctor;
        const { data } = await apiClient.post('/api/doctor/cancel-appointment', { appointmentId }, { headers: { dToken } });
        if (data.success) {
            toast.success(data.message);
            dispatch(getDoctorAppointments());
            return true;
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

export const getDoctorDashData = createAsyncThunk('doctor/getDashData', async (_, { getState, rejectWithValue }) => {
    try {
        const { dToken } = getState().doctor;
        const { data } = await apiClient.get('/api/doctor/dashboard', { headers: { dToken } });
        if (data.success) {
            return data.dashData;
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

export const getDoctorProfile = createAsyncThunk('doctor/getProfile', async (_, { getState, rejectWithValue }) => {
    try {
        const { dToken } = getState().doctor;
        const { data } = await apiClient.get('/api/doctor/profile', { headers: { dToken } });
        if (data.success) {
            return data.profileData;
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

export const updateDoctorProfile = createAsyncThunk('doctor/updateProfile', async (updateData, { getState, dispatch, rejectWithValue }) => {
    try {
        const { dToken } = getState().doctor;
        const { data } = await apiClient.post('/api/doctor/update-profile', updateData, { headers: { dToken } });
        if (data.success) {
            toast.success(data.message);
            dispatch(getDoctorProfile());
            return true;
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

export const createPrescription = createAsyncThunk('doctor/createPrescription', async ({ appointmentId, medicines, notes }, { getState, dispatch, rejectWithValue }) => {
    try {
        const { dToken } = getState().doctor;
        const { data } = await apiClient.post('/api/prescription/create', { appointmentId, medicines, notes }, { headers: { dToken } });
        if (data.success) {
            toast.success(data.message);
            dispatch(getDoctorAppointments());
            return data.prescription;
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

export const getPrescriptionByAppointment = createAsyncThunk('doctor/getPrescriptionByAppointment', async (appointmentId, { getState, rejectWithValue }) => {
    try {
        const { dToken } = getState().doctor;
        const { data } = await apiClient.get('/api/prescription/' + appointmentId, { headers: { dToken } });
        if (data.success) {
            return data.prescription;
        } else {
            return rejectWithValue(data.message);
        }
    } catch (error) {
        const message = getApiErrorMessage(error);
        toast.error(message);
        return rejectWithValue(message);
    }
});

export const getPatientHistory = createAsyncThunk('doctor/getPatientHistory', async (patientId, { getState, rejectWithValue }) => {
    try {
        const { dToken } = getState().doctor;
        const { data } = await apiClient.get('/api/doctor/patient-history/' + patientId, { headers: { dToken } });
        if (data.success) {
            return { patient: data.patient, prescriptions: data.prescriptions, labReports: data.labReports || [] };
        } else {
            toast.error(data.message || 'Failed to load patient history');
            return rejectWithValue(data.message);
        }
    } catch (error) {
        const message = getApiErrorMessage(error);
        toast.error(message);
        return rejectWithValue(message);
    }
});

export const updatePatientHealth = createAsyncThunk('doctor/updatePatientHealth', async ({ patientId, allergies, chronicConditions }, { getState, dispatch, rejectWithValue }) => {
    try {
        const { dToken } = getState().doctor;
        const { data } = await apiClient.put('/api/doctor/patient-health/' + patientId, { allergies, chronicConditions }, { headers: { dToken } });
        if (data.success) {
            toast.success(data.message || 'Health information updated');
            dispatch(getPatientHistory(patientId));
            return data.patient;
        } else {
            toast.error(data.message || 'Update failed');
            return rejectWithValue(data.message);
        }
    } catch (error) {
        const message = getApiErrorMessage(error);
        toast.error(message);
        return rejectWithValue(message);
    }
});

export const suggestFollowUp = createAsyncThunk('doctor/suggestFollowUp', async ({ appointmentId, slotDate, slotTime }, { getState, rejectWithValue }) => {
    try {
        const { dToken } = getState().doctor;
        const { data } = await apiClient.post('/api/doctor/suggest-follow-up', { appointmentId, slotDate, slotTime }, { headers: { dToken } });
        if (data.success) {
            toast.success('Follow-up link created');
            return data.followUpLink;
        } else {
            toast.error(data.message || 'Failed to create follow-up');
            return rejectWithValue(data.message);
        }
    } catch (error) {
        const message = getApiErrorMessage(error);
        toast.error(message);
        return rejectWithValue(message);
    }
});

export const startVideoConsultation = createAsyncThunk('doctor/startVideoConsultation', async (appointmentId, { getState, dispatch, rejectWithValue }) => {
    try {
        const { dToken } = getState().doctor;
        const { data } = await apiClient.post('/api/doctor/video/start', { appointmentId }, { headers: { dToken } });
        if (data.success) {
            const joinUrl = data?.session?.joinUrl;
            if (joinUrl) {
                window.open(joinUrl, '_blank', 'noopener,noreferrer');
            }
            toast.success(data.message || 'Video call started');
            dispatch(getDoctorAppointments());
            return data.session;
        }
        toast.error(data.message || 'Unable to start video call');
        return rejectWithValue(data.message);
    } catch (error) {
        const message = getApiErrorMessage(error);
        toast.error(message);
        return rejectWithValue(message);
    }
});

export const joinDoctorVideoConsultation = createAsyncThunk('doctor/joinDoctorVideoConsultation', async (appointmentId, { getState, rejectWithValue }) => {
    try {
        const { dToken } = getState().doctor;
        const { data } = await apiClient.get('/api/doctor/video-session/' + appointmentId, { headers: { dToken } });
        if (data.success) {
            const joinUrl = data?.session?.joinUrl;
            if (!joinUrl) {
                return rejectWithValue('Video join URL missing');
            }
            window.open(joinUrl, '_blank', 'noopener,noreferrer');
            return data.session;
        }
        toast.error(data.message || 'Unable to join video call');
        return rejectWithValue(data.message);
    } catch (error) {
        const message = getApiErrorMessage(error);
        toast.error(message);
        return rejectWithValue(message);
    }
});

export const endVideoConsultation = createAsyncThunk('doctor/endVideoConsultation', async (appointmentId, { getState, dispatch, rejectWithValue }) => {
    try {
        const { dToken } = getState().doctor;
        const { data } = await apiClient.post('/api/doctor/video/end', { appointmentId }, { headers: { dToken } });
        if (data.success) {
            toast.success(data.message || 'Video call ended');
            dispatch(getDoctorAppointments());
            return true;
        }
        toast.error(data.message || 'Unable to end video call');
        return rejectWithValue(data.message);
    } catch (error) {
        const message = getApiErrorMessage(error);
        toast.error(message);
        return rejectWithValue(message);
    }
});

const doctorSlice = createSlice({
    name: 'doctor',
    initialState: {
        dToken: localStorage.getItem('dToken') || '',
        appointments: [],
        dashData: false,
        profileData: false,
    },
    reducers: {
        setDToken: (state, action) => {
            state.dToken = action.payload;
            if (action.payload) {
                localStorage.setItem('dToken', action.payload);
            } else {
                localStorage.removeItem('dToken');
            }
        },
        logoutDoctor: (state) => {
            state.dToken = '';
            localStorage.removeItem('dToken');
            state.appointments = [];
            state.dashData = false;
            state.profileData = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginDoctor.fulfilled, (state, action) => {
                state.dToken = action.payload;
            })
            .addCase(getDoctorAppointments.fulfilled, (state, action) => {
                state.appointments = action.payload;
            })
            .addCase(getDoctorDashData.fulfilled, (state, action) => {
                state.dashData = action.payload;
            })
            .addCase(getDoctorProfile.fulfilled, (state, action) => {
                state.profileData = action.payload;
            });
    }
});

export const { setDToken, logoutDoctor } = doctorSlice.actions;

export default doctorSlice.reducer;

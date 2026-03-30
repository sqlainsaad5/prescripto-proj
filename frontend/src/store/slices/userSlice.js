import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getDoctorsData } from './doctorSlice';

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

export const contactUs = createAsyncThunk('user/contactUs', async (formData, { rejectWithValue }) => {
    try {
        const { data } = await axios.post(backendUrl + "/api/user/contact-us", formData);
        if (data.success) {
            toast.success(data.message);
            return data.message;
        } else {
            toast.error(data.message);
            return rejectWithValue(data.message);
        }
    } catch (error) {
        toast.error(error.message);
        return rejectWithValue(error.message);
    }
});

export const getMyPrescriptions = createAsyncThunk('user/getMyPrescriptions', async (_, { getState, rejectWithValue }) => {
    try {
        const { token, userData } = getState().user;
        if (!token || !userData?._id) {
            return rejectWithValue('Not logged in');
        }
        const { data } = await axios.get(backendUrl + '/api/prescription/patient/' + userData._id, { headers: { token } });
        if (data.success) {
            return data.prescriptions;
        } else {
            toast.error(data.message);
            return rejectWithValue(data.message);
        }
    } catch (error) {
        toast.error(error?.response?.data?.message || error.message);
        return rejectWithValue(error?.response?.data?.message || error.message);
    }
});

// Get follow-up offer by token (no auth) – for priority booking link page
export const getFollowUpByToken = createAsyncThunk(
    'user/getFollowUpByToken',
    async (token, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/follow-up-by-token?token=' + encodeURIComponent(token));
            if (data.success) {
                return data;
            }
            return rejectWithValue(data.message || 'Invalid or expired link');
        } catch (error) {
            const msg = error?.response?.data?.message || error.message;
            return rejectWithValue(msg);
        }
    }
);

// Confirm follow-up appointment (auth required)
export const confirmFollowUp = createAsyncThunk(
    'user/confirmFollowUp',
    async (token, { getState, rejectWithValue }) => {
        try {
            const { token: authToken } = getState().user;
            if (!authToken) {
                toast.warn('Login to confirm this follow-up');
                return rejectWithValue('Not authenticated');
            }
            const { data } = await axios.post(
                backendUrl + '/api/user/confirm-follow-up',
                { token },
                { headers: { token: authToken } }
            );
            if (data.success) {
                toast.success(data.message);
                return data;
            }
            toast.error(data.message);
            return rejectWithValue(data.message);
        } catch (error) {
            const msg = error?.response?.data?.message || error.message;
            toast.error(msg);
            return rejectWithValue(msg);
        }
    }
);

// Book an appointment for a doctor at a specific date/time
export const bookAppointment = createAsyncThunk(
    'user/bookAppointment',
    async ({ docId, slotDate, slotTime, consultationMode }, { getState, dispatch, rejectWithValue }) => {
        try {
            const { token } = getState().user;
            if (!token) {
                toast.warn('Login to book appointment');
                return rejectWithValue('Not authenticated');
            }

            const { data } = await axios.post(
                backendUrl + '/api/user/book-appointment',
                { docId, slotDate, slotTime, consultationMode },
                { headers: { token } }
            );

            if (data.success) {
                toast.success(data.message);
                // refresh doctors so slots update
                dispatch(getDoctorsData());
                return data;
            } else {
                toast.error(data.message);
                dispatch(getDoctorsData());
                return rejectWithValue(data.message);
            }
        } catch (error) {
            toast.error(error.message);
            return rejectWithValue(error.message);
        }
    }
);

// Fetch all appointments for the current user
export const fetchUserAppointments = createAsyncThunk(
    'user/fetchUserAppointments',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().user;
            if (!token) {
                return rejectWithValue('Not authenticated');
            }

            const { data } = await axios.get(
                backendUrl + '/api/user/appointments',
                { headers: { token } }
            );

            if (data.success) {
                return data.appointments.reverse();
            } else {
                toast.error(data.message);
                return rejectWithValue(data.message);
            }
        } catch (error) {
            toast.error(error.message);
            return rejectWithValue(error.message);
        }
    }
);

// Cancel a specific appointment
export const cancelAppointmentThunk = createAsyncThunk(
    'user/cancelAppointment',
    async (appointmentId, { getState, dispatch, rejectWithValue }) => {
        try {
            const { token } = getState().user;
            if (!token) {
                return rejectWithValue('Not authenticated');
            }

            const { data } = await axios.post(
                backendUrl + '/api/user/cancel-appointment',
                { appointmentId },
                { headers: { token } }
            );

            if (data.success) {
                toast.success(data.message);
                // refresh appointments and doctors data
                dispatch(fetchUserAppointments());
                dispatch(getDoctorsData());
                return data;
            } else {
                toast.error(data.message);
                return rejectWithValue(data.message);
            }
        } catch (error) {
            toast.error(error.message);
            return rejectWithValue(error.message);
        }
    }
);

// Start Stripe checkout for an appointment
export const startAppointmentStripe = createAsyncThunk(
    'user/startAppointmentStripe',
    async (appointmentId, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().user;
            if (!token) {
                return rejectWithValue('Not authenticated');
            }

            const { data } = await axios.post(
                backendUrl + '/api/user/payment-stripe',
                { appointmentId },
                { headers: { token } }
            );

            if (data.success) {
                const { session_url } = data;
                window.location.replace(session_url);
                return data;
            } else {
                toast.error(data.message);
                return rejectWithValue(data.message);
            }
        } catch (error) {
            toast.error(error.message);
            return rejectWithValue(error.message);
        }
    }
);

// Verify Stripe checkout result
export const verifyStripePayment = createAsyncThunk(
    'user/verifyStripePayment',
    async ({ appointmentId, success, session_id, navigate }, { getState, dispatch, rejectWithValue }) => {
        try {
            const { token } = getState().user;
            if (!token) {
                return rejectWithValue('Not authenticated');
            }

            const { data } = await axios.post(
                backendUrl + '/api/user/verifyStripe',
                { appointmentId, success, session_id },
                { headers: { token } }
            );

            if (data.success) {
                await dispatch(fetchUserAppointments());
                toast.success(data.message);
                if (navigate) {
                    navigate('/my-appointments');
                }
                return data;
            } else {
                toast.error(data.message);
                return rejectWithValue(data.message);
            }
        } catch (error) {
            toast.error(error.message);
            return rejectWithValue(error.message);
        }
    }
);

// Update user profile (including optional image)
export const updateUserProfile = createAsyncThunk(
    'user/updateUserProfile',
    async ({ editData, image }, { getState, dispatch, rejectWithValue }) => {
        try {
            const { token } = getState().user;
            if (!token) {
                return rejectWithValue('Not authenticated');
            }

            // Patient cannot update allergies/chronicConditions/healthHistory; only doctor can via admin.
            const formData = new FormData();
            formData.append('name', editData.name);
            formData.append('phone', editData.phone);
            formData.append('address', JSON.stringify(editData.address));
            formData.append('gender', editData.gender);
            formData.append('dob', editData.dob);
            if (image) {
                formData.append('image', image);
            }

            const { data } = await axios.post(
                backendUrl + '/api/user/update-profile',
                formData,
                { headers: { token } }
            );

            if (data.success) {
                toast.success(data.message);
                dispatch(loadUserProfileData());
                return data;
            } else {
                toast.error(data.message);
                return rejectWithValue(data.message);
            }
        } catch (error) {
            toast.error(error.message);
            return rejectWithValue(error.message);
        }
    }
);

// Upload lab report (X-ray, blood test, diagnostic) for an appointment
export const uploadLabReport = createAsyncThunk(
    'user/uploadLabReport',
    async ({ appointmentId, type, file }, { getState, dispatch, rejectWithValue }) => {
        try {
            const { token } = getState().user;
            if (!token) {
                return rejectWithValue('Not authenticated');
            }
            const formData = new FormData();
            formData.append('appointmentId', appointmentId);
            formData.append('type', type);
            formData.append('file', file);

            const { data } = await axios.post(
                backendUrl + '/api/user/upload-lab-report',
                formData,
                { headers: { token } }
            );

            if (data.success) {
                toast.success('Lab report uploaded successfully');
                dispatch(fetchUserAppointments());
                return data.labReport;
            } else {
                toast.error(data.message || 'Upload failed');
                return rejectWithValue(data.message);
            }
        } catch (error) {
            const message = error?.response?.data?.message || error.message;
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

export const joinVideoConsultation = createAsyncThunk(
    'user/joinVideoConsultation',
    async (appointmentId, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().user;
            if (!token) {
                return rejectWithValue('Not authenticated');
            }

            const { data } = await axios.get(
                backendUrl + '/api/user/video-session/' + appointmentId,
                { headers: { token } }
            );

            if (data.success) {
                const { joinUrl } = data.session || {};
                if (!joinUrl) {
                    return rejectWithValue('Video join URL missing');
                }
                window.open(joinUrl, '_blank', 'noopener,noreferrer');
                return data.session;
            } else {
                toast.error(data.message || 'Unable to join video call');
                return rejectWithValue(data.message);
            }
        } catch (error) {
            const message = error?.response?.data?.message || error.message;
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState: {
        token: localStorage.getItem('token') || false,
        userData: false,
        prescriptions: [],
        appointments: [],
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
            state.prescriptions = [];
            localStorage.removeItem('token');
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadUserProfileData.fulfilled, (state, action) => {
                state.userData = action.payload;
            })
            .addCase(getMyPrescriptions.fulfilled, (state, action) => {
                state.prescriptions = action.payload || [];
            })
            .addCase(fetchUserAppointments.fulfilled, (state, action) => {
                state.appointments = action.payload || [];
            });
    }
});

export const { setToken, setUserData, logout } = userSlice.actions;
export default userSlice.reducer;

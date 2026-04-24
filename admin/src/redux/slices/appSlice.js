import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currency: 'PKR',
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {},
});

export default appSlice.reducer;

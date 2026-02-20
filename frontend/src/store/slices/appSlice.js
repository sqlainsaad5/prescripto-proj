import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currencySymbol: '$',
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setCurrencySymbol: (state, action) => {
            state.currencySymbol = action.payload;
        }
    },
});

export const { setCurrencySymbol } = appSlice.actions;
export default appSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

export const bankSlice = createSlice({
    name: 'bank',
    initialState: {
        info: {}
    },
    reducers: {
        addInfo: (state, action) => {
            state.info = { ...state.info, ...action.payload}
        },
        clearInfo: (state) => {
            state.info = {}
        }
    }
});

export const { addInfo, clearInfo } = bankSlice.actions;

export const selectBankInfo = state => state.bank.info;

export default bankSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

export const developerSlice = createSlice({
    name: 'developer',
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

export const { addInfo, clearInfo } = developerSlice.actions;

export const selectDeveloperInfo = state => state.developer.info;

export default developerSlice.reducer;
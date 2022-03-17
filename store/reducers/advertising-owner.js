import { createSlice } from "@reduxjs/toolkit";

export const advertisingOwnerSlice = createSlice({
    name: 'advertising_owner',
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

export const { addInfo, clearInfo } = advertisingOwnerSlice.actions;

export const selectAdvertisingOwnerInfo = state => state.advertising_owner.info;

export default advertisingOwnerSlice.reducer;
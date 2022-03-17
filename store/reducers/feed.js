import { createSlice } from "@reduxjs/toolkit";

const initialState = {
activeTypeFeed: '',
};

export const feedSlice = createSlice({
    name: "feed",
    initialState,
    reducers: {
setActiveTypeFeed: (state, action) => {
            state.activeTypeFeed = action.payload;
        }
    },
});

export const { setActiveTypeFeed } = feedSlice.actions;

export const selectActiveTypeFeed = (state) => state.feed.activeTypeFeed;

export default feedSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	activeSubdomainIndex: null,
	contentList: [],
	activePage: null,
};

export const contentSlice = createSlice({
	name: "content",
	initialState,
	reducers: {
		setActiveSubdomainIndex: (state, action) => {
			state.activeSubdomainIndex = action.payload;
		},
		setContentList: (state, action) => {
			state.contentList = action.payload;
		},
		addContentList: (state, action) => {
			state.contentList = [...state.contentList, action.payload];
		},
		setContentElement: (state, action) => {
			const { index, data } = action.payload;
			state.contentList[index] = { ...state.contentList[index], ...data };
		},
		setActivePage: (state, actions) => {
			state.activePage = actions.payload;
		},
	},
});

export const { setActiveSubdomainIndex, addContentList, setContentList, setContentElement, setActivePage } = contentSlice.actions;

export const selectActiveSubDomainIndex = (state) => state.content.activeSubdomainIndex;
export const selectContentList = (state) => state.content.contentList;
export const selectActivePage = (state) => state.content.activePage;

export default contentSlice.reducer;

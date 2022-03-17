import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    activeComplex: null,
    listComplexes: []
};

export const complexSlice = createSlice({
    name: 'complex',
    initialState,
    reducers: {
        setActiveComplexes: (state, action) => {
            state.activeComplex = action.payload;
        },
        setListComplexes: (state, action) => {
            state.listComplexes = [...action.payload];
        },
        addInfo: (state, action) => {
            let resultList = []
            for (const [index, news] of state.listComplexes.entries()) {
                if (index === state.activeComplex) {
                    resultList = [...resultList, {
                        ...news,
                        ...action.payload
                    }]
                } else {
                    resultList = [...resultList, news]
                }
            }
            state.listComplexes = resultList;
        }
    }
});

export const { addInfo, setActiveComplexes, setListComplexes } = complexSlice.actions;

export const selectActiveComplexIndex = state => state.complex.activeComplex;
export const selectListComplexes = state => state.complex.listComplexes;
export const selectComplexInfo = state => state.complex.listComplexes[state.complex.activeComplex] || null;

export default complexSlice.reducer;
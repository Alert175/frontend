import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    activeRegion: null,
    allRegions: []
};

export const complexesListSlice = createSlice({
    name: 'complexes-list',
    initialState,
    reducers: {
        setActiveRegion: (state, action) => {
            state.activeRegion = action.payload.value;
        },
        setAllRegions: (state, action) => {
            state.allRegions = [...action.payload];
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

export const { addInfo, setActiveRegion, setAllRegions } = complexesListSlice.actions;

export const selectActiveRegion = state => state.complexesList.activeRegion
export const selectAllRegions = state => state.complexesList.allRegions;
export const selectComplexInfo = state => state.complex.listComplexes[state.complex.activeComplex] || null;

export default complexesListSlice.reducer;
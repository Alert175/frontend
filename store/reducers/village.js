import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    activeVillage: null,
    listVillages: []
};

export const villageSlice = createSlice({
    name: 'village',
    initialState,
    reducers: {
        setActiveVillages: (state, action) => {
            state.activeVillage = action.payload;
        },
        setListVillages: (state, action) => {
            state.listVillages = [...action.payload];
        },
        addInfo: (state, action) => {
            let resultList = []
            for (const [index, news] of state.listVillages.entries()) {
                if (index === state.activeVillage) {
                    resultList = [...resultList, {
                        ...news,
                        ...action.payload
                    }]
                } else {
                    resultList = [...resultList, news]
                }
            }
            state.listVillages = resultList;
        }
    }
});

export const { addInfo, setActiveVillages, setListVillages } = villageSlice.actions;

export const selectActiveVillageIndex = state => state.village.activeVillage;
export const selectListVillages = state => state.village.listVillages;
export const selectVillageInfo = state => state.village.listVillages[state.village.activeVillage] || null;

export default villageSlice.reducer;
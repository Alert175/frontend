import { createSlice } from "@reduxjs/toolkit";

export const news = createSlice({
    name: 'news',
    initialState: {
        activeNews: null,
        listNews: []
    },
    reducers: {
        setActiveNews: (state, action) => {
            state.activeNews = action.payload;
        },
        setListNews: (state, action) => {
            state.listNews = [...action.payload];
        },
        setActiveNewsData: (state, action) => {
            let resultList = []
            for (const [index, news] of state.listNews.entries()) {
                if (index === state.activeNews) {
                    resultList = [...resultList, {
                        ...news,
                        ...action.payload
                    }]
                } else {
                    resultList = [...resultList, news]
                }
            }
            state.listNews = resultList;
        }
    }
});

export const { setActiveNews, setListNews, setActiveNewsData } = news.actions;

export const selectActiveNewsIndex = state => state.news.activeNews;
export const selectActiveNews = state => state.news.listNews[state.news.activeNews] || null;
export const selectListNews = state => state.news.listNews;

export default news.reducer;
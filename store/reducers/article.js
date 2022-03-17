import { createSlice } from "@reduxjs/toolkit";

export const article = createSlice({
    name: 'article',
    initialState: {
        activeArticle: null,
        listArticles: []
    },
    reducers: {
        setActiveArticle: (state, action) => {
            state.activeArticle = action.payload;
        },
        setListArticles: (state, action) => {
            state.listArticles = [...action.payload];
        },
        setActiveArticlesData: (state, action) => {
            let resultList = []
            for (const [index, news] of state.listArticles.entries()) {
                if (index === state.activeArticle) {
                    resultList = [...resultList, {
                        ...news,
                        ...action.payload
                    }]
                } else {
                    resultList = [...resultList, news]
                }
            }
            state.listArticles = resultList;
        }
    }
});

export const { setActiveArticle, setListArticles, setActiveArticlesData } = article.actions;

export const selectActiveArticleIndex = state => state.article.activeArticle;
export const selectActiveArticle = state => state.article.listArticles[state.article.activeArticle] || null;
export const selectListArticles = state => state.article.listArticles;

export default article.reducer;
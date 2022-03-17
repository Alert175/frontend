import { configureStore } from '@reduxjs/toolkit'

import managerSlice from "~/store/reducers/manager";
import messagesSlice from "~/store/reducers/messages";
import complexSlice from "~/store/reducers/complex";
import villageSlice from "~/store/reducers/village";
import bankSlice from "~/store/reducers/bank";
import developerSlice from "~/store/reducers/developer";
import newsSlice from "~/store/reducers/news";
import articleSlice from "~/store/reducers/article";
import complexesListSlice from "~/store/reducers/complexes-list";
import contentSlice from './reducers/content';
import feedSlice from './reducers/feed';
import advertisingOwnerSlice from './reducers/advertising-owner';

export const store = configureStore({
    reducer: {
        manager: managerSlice,
        messages: messagesSlice,
        complex: complexSlice,
        village: villageSlice,
        bank: bankSlice,
        developer: developerSlice,
        news: newsSlice,
        article: articleSlice,
        complexesList: complexesListSlice,
        content: contentSlice,
        feed: feedSlice,
        advertising_owner: advertisingOwnerSlice
    },
});
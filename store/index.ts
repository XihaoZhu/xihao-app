import { configureStore } from '@reduxjs/toolkit';
import pageCcontrol from './pageControl';
import ballControlSlice from './ballControl';

export const store = configureStore({
    reducer: {
        currentPage: pageCcontrol,
        ballInfo: ballControlSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
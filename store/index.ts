import { configureStore } from '@reduxjs/toolkit';
import pageCcontrol from './pageControl';

export const store = configureStore({
    reducer: {
        currentPage: pageCcontrol,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
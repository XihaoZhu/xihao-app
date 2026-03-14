import { configureStore } from '@reduxjs/toolkit';
import pageCcontrol from './pageControl';
import ballControlSlice from './ballControl';
import mouseControlSlice from './mouseControl';

export const store = configureStore({
    reducer: {
        currentPage: pageCcontrol,
        ballInfo: ballControlSlice,
        mouseControlSlice: mouseControlSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
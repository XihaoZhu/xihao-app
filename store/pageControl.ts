import { createSlice, current } from '@reduxjs/toolkit';
import next from 'next';

const pageControlSlice = createSlice({
    name: 'pageControl',
    initialState: {
        currentSection: 0,
    },
    reducers: {
        nextSection(state) {
            if (state.currentSection < 4) {
                state.currentSection += 1;
            } else {
                state.currentSection = 0;
            }
        }
    }
});

export const { nextSection } = pageControlSlice.actions;
export default pageControlSlice.reducer;

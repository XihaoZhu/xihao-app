import { createSlice, current } from '@reduxjs/toolkit';
import next from 'next';

const getWindowWidth = () =>
    typeof window !== "undefined" ? window.innerWidth : 0;

const vw = getWindowWidth() / 100;

const ballControlSlice = createSlice({
    name: 'ballControl',
    initialState: {
        x: 50 * vw,
        y: 0,
        scale: 1,
    },
    reducers: {
        move(state, action) {
            if (action.payload.x !== undefined) {
                state.x = action.payload.x;
            }
            if (action.payload.y !== undefined) {
                state.y = action.payload.y;
            }
        },
        resize(state, action) {
            if (action.payload.scale !== undefined) {
                state.scale = action.payload.scale;
            }
        }
    }
});

export const { move, resize } = ballControlSlice.actions;
export default ballControlSlice.reducer;

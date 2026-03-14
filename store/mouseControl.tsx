import { createSlice } from '@reduxjs/toolkit'

type CursorLayer = "red" | "blue" | "green"

const initialState = {
    layers: {
        red: false,
        blue: false,
        green: false,
    } as Record<CursorLayer, boolean>
}

const mouseControlSlice = createSlice({
    name: 'mouseControl',
    initialState,
    reducers: {
        setCursorLayers(state, action) {
            const active = new Set<CursorLayer>(action.payload)

            for (const layer in state.layers) {
                state.layers[layer as CursorLayer] = active.has(layer as CursorLayer)
            }
        }
    }
})

export const { setCursorLayers } = mouseControlSlice.actions
export default mouseControlSlice.reducer
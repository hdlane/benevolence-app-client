import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";

interface MealResource {
    id: number;
    date: string;
    provider_name: string;
    name: string;
}

interface MealResourcesState {
    list: MealResource[];
    details: MealResource | null;
    id: number | null;
}

const initialState: MealResourcesState = {
    list: [],
    details: null,
    id: null,
};

export const mealResourcesSlice = createSlice({
    name: 'mealResources',
    initialState,
    reducers: {
        setRequest(state, action: PayloadAction<MealResource>) {
            state.details = { ...action.payload };
        },
        setRequestId(state, action: PayloadAction<{ id: number }>) {
            state.id = action.payload.id;
        },
        clearRequest(state) {
            state.details = null;
            state.id = null;
        },
    },
});

export const { setRequest, setRequestId, clearRequest } = mealResourcesSlice.actions;
export default mealResourcesSlice.reducer;

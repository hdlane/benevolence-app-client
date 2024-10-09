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
        setMealResource(state, action: PayloadAction<MealResource>) {
            state.details = { ...action.payload };
        },
        setMealId(state, action: PayloadAction<{ id: number }>) {
            state.id = action.payload.id;
        },
        clearMeal(state) {
            state.details = null;
            state.id = null;
        },
        clearMeals(state) {
            state.list = [];
        },
    },
});

export const { setMealResource, setMealId, clearMeal, clearMeals } = mealResourcesSlice.actions;
export default mealResourcesSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";

interface Error {
    message: string;
}

interface ErrorsState {
    errors: Error[];
    currentError: string | null;
}

const initialState: ErrorsState = {
    errors: [],
    currentError: null,
};

export const errorsSlice = createSlice({
    name: 'errors',
    initialState,
    reducers: {
        setErrors(state, action: PayloadAction<Error[]>) {
            state.errors = action.payload;
        },
        setError(state, action: PayloadAction<{ message: string }>) {
            state.currentError = action.payload.message;
        },
        clearError(state) {
            state.currentError = null;
        },
        clearErrors(state) {
            state.errors = [];
        },
    },
});

export const { setErrors: setMessages, setError: setMessage, clearError: clearMessage, clearErrors: clearMessages } = errorsSlice.actions;
export default errorsSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";

interface TokenState {
    token: string | null;
}

const initialState: TokenState = {
    token: null,
};

export const tokenSlice = createSlice({
    name: 'token',
    initialState,
    reducers: {
        setToken(state, action: PayloadAction<{ token: string | null }>) {
            state.token = action.payload.token;
        },
        clearToken(state) {
            state.token = null;
        },
    },
});

export const { setToken, clearToken } = tokenSlice.actions;
export default tokenSlice.reducer;

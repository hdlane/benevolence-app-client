import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";

interface User {
    id: number;
    organization_name: string;
    name: string;
    is_admin: boolean;
    logged_in: boolean;
}

interface UserState {
    id: number | null;
    organization_name: string | null;
    name: string | null;
    is_admin: boolean | null;
    logged_in: boolean | null;
}

const initialState: UserState = {
    id: null,
    organization_name: null,
    name: null,
    is_admin: null,
    logged_in: null,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<User>) {
            state.id = action.payload.id;
            state.organization_name = action.payload.organization_name,
                state.name = action.payload.name;
            state.is_admin = action.payload.is_admin;
            state.logged_in = action.payload.logged_in;
        },
        setIsLoggedIn(state, action: PayloadAction<{ logged_in: boolean | null }>) {
            state.logged_in = action.payload.logged_in;
        },
        setIsAdmin(state, action: PayloadAction<{ is_admin: boolean | null }>) {
            state.is_admin = action.payload.is_admin;
        },
        clearUser(state) {
            state.id = null;
            state.name = null;
            state.is_admin = null;
            state.logged_in = null;
        },
    },
});

export const { setUser, setIsLoggedIn, setIsAdmin, clearUser } = userSlice.actions;
export default userSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";

interface Request {
    id: number;
    name: string;
}

interface RequestState {
    requests: Request[];
    selectedRequestId: number | null;
    selectedRequestName: string | null;
}

const initialState: RequestState = {
    requests: [],
    selectedRequestId: null,
    selectedRequestName: null,
};

export const requestsSlice = createSlice({
    name: 'requests',
    initialState,
    reducers: {
        setRequests(state, action: PayloadAction<Request[]>) {
            state.requests = action.payload;
        },
        setRequest(state, action: PayloadAction<{ id: number, name: string }>) {
            state.selectedRequestId = action.payload.id;
            state.selectedRequestName = action.payload.name;
        },
        clearRequest(state) {
            state.selectedRequestId = null;
            state.selectedRequestName = null;
        },
        clearRequests(state) {
            state.requests = [];
        },
    },
});

export const { setRequest, setRequests, clearRequest, clearRequests } = requestsSlice.actions;
export default requestsSlice.reducer;

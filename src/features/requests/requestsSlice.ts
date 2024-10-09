import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";

interface Request {
    id: number;
    title: string;
    start_date: string;
    end_date: string;
    num_resources: number;
    request_type: string;
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
        clearRequests(state) {
            state.requests = [];
        },
    },
});

export const { setRequests, clearRequests } = requestsSlice.actions;
export default requestsSlice.reducer;

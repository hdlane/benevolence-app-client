import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";

interface RequestDetails {
    id: number;
    resources: any;
    recipient_name: string;
    recipient_id: number;
    coordinator_name: string;
    coordinator_id: number;
    creator_name: string;
    organization_id: number;
    request_type: string;
    title: string | null;
    notes: string | null;
    allergies: string | null;
    start_date: string | number | Date | null;
    start_time: string | number | Date | null;
    end_date: string | number | Date | null;
    end_time: string | number | Date | null;
    street_line: string | null;
    city: string | null;
    state: string | null;
    zip_code: string | null;
    created_at: string | null;
    updated_at: string | null;
}

interface RequestDetailsState {
    request: RequestDetails | null;
    selectedRequestId: number | null;
}

const initialState: RequestDetailsState = {
    request: null,
    selectedRequestId: null,
};

export const requestDetailsSlice = createSlice({
    name: 'request',
    initialState,
    reducers: {
        setRequest(state, action: PayloadAction<RequestDetails>) {
            state.request = { ...action.payload };
        },
        setRequestId(state, action: PayloadAction<{ id: number }>) {
            state.selectedRequestId = action.payload.id;
        },
        clearRequest(state) {
            state.request = null;
            state.selectedRequestId = null;
        },
    },
});

export const { setRequest, setRequestId, clearRequest } = requestDetailsSlice.actions;
export default requestDetailsSlice.reducer;

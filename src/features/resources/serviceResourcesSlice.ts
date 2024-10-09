import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";

interface ServiceResource {
    id: number;
    provider_names: string[];
    name: string;
    quantity: number;
}

interface ServiceResourcesState {
    list: ServiceResource[];
    details: ServiceResource | null;
    id: number | null;
}

const initialState: ServiceResourcesState = {
    list: [],
    details: null,
    id: null,
};

export const serviceResourcesSlice = createSlice({
    name: 'serviceResources',
    initialState,
    reducers: {
        setServiceResource(state, action: PayloadAction<ServiceResource>) {
            state.details = { ...action.payload };
        },
        setServiceId(state, action: PayloadAction<{ id: number }>) {
            state.id = action.payload.id;
        },
        clearService(state) {
            state.details = null;
            state.id = null;
        },
        clearServices(state) {
            state.list = [];
        },
    },
});

export const { setServiceResource, setServiceId, clearService, clearServices } = serviceResourcesSlice.actions;
export default serviceResourcesSlice.reducer;

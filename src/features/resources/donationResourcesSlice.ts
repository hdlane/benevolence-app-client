import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";

interface DonationResource {
    id: number;
    provider_names: string[];
    name: string;
    quantity: number;
}

interface DonationResourcesState {
    list: DonationResource[];
    details: DonationResource | null;
    id: number | null;
}

const initialState: DonationResourcesState = {
    list: [],
    details: null,
    id: null,
};

export const donationResourcesSlice = createSlice({
    name: 'donationResources',
    initialState,
    reducers: {
        setDonationResource(state, action: PayloadAction<DonationResource>) {
            state.details = { ...action.payload };
        },
        setDonationId(state, action: PayloadAction<{ id: number }>) {
            state.id = action.payload.id;
        },
        clearDonation(state) {
            state.details = null;
            state.id = null;
        },
        clearDonations(state) {
            state.list = [];
        },
    },
});

export const { setDonationResource, setDonationId, clearDonation, clearDonations } = donationResourcesSlice.actions;
export default donationResourcesSlice.reducer;

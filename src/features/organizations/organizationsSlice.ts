import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";

interface Organization {
    id: number;
    name: string;
}

interface OrganizationsState {
    organizations: Organization[];
    selectedOrganizationId: number | null;
    selectedOrganizationName: string | null;
}

const initialState: OrganizationsState = {
    organizations: [],
    selectedOrganizationId: null,
    selectedOrganizationName: null,
};

export const organizationsSlice = createSlice({
    name: 'organizations',
    initialState,
    reducers: {
        setOrganizations(state, action: PayloadAction<Organization[]>) {
            state.organizations = action.payload;
        },
        setOrganizationId(state, action: PayloadAction<{ id: number }>) {
            state.selectedOrganizationId = action.payload.id;
        },
        setOrganizationName(state, action: PayloadAction<{ name: string }>) {
            state.selectedOrganizationName = action.payload.name;
        },
        clearOrganization(state) {
            state.selectedOrganizationId = null;
            state.selectedOrganizationName = null;
        },
        clearOrganizations(state) {
            state.organizations = [];
        },
    },
});

export const { setOrganizations, setOrganizationId, setOrganizationName, clearOrganization, clearOrganizations } = organizationsSlice.actions;
export default organizationsSlice.reducer;

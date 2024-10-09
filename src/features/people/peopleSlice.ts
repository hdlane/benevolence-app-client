import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";

interface Person {
    id: number;
    name: string;
}

interface PeopleState {
    people: Person[];
    selectedPersonId: number | null;
    selectedPersonName: string | null;
}

const initialState: PeopleState = {
    people: [],
    selectedPersonId: null,
    selectedPersonName: null,
};

export const peopleSlice = createSlice({
    name: 'people',
    initialState,
    reducers: {
        setPeople(state, action: PayloadAction<Person[]>) {
            state.people = action.payload;
        },
        setPersonId(state, action: PayloadAction<{ id: number }>) {
            state.selectedPersonId = action.payload.id;
        },
        setPersonName(state, action: PayloadAction<{ name: string }>) {
            state.selectedPersonName = action.payload.name;
        },
        clearPerson(state) {
            state.selectedPersonId = null;
            state.selectedPersonName = null;
        },
        clearPeople(state) {
            state.people = [];
        },
    },
});

export const { setPeople, setPersonId, setPersonName, clearPerson, clearPeople } = peopleSlice.actions;
export default peopleSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";

interface Message {
    message: string;
}

interface MessagesState {
    messages: Message[];
    currentMessage: string | null;
}

const initialState: MessagesState = {
    messages: [],
    currentMessage: null,
};

export const messagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        setMessages(state, action: PayloadAction<Message[]>) {
            state.messages = action.payload;
        },
        setMessage(state, action: PayloadAction<{ message: string }>) {
            state.currentMessage = action.payload.message;
        },
        clearMessage(state) {
            state.currentMessage = null;
        },
        clearMessages(state) {
            state.messages = [];
        },
    },
});

export const { setMessages, setMessage, clearMessage, clearMessages } = messagesSlice.actions;
export default messagesSlice.reducer;

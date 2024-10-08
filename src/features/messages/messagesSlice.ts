import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";

export const enum MessageColors {
    "SUCCESS" = "#A7F3D0",
    "WARNING" = "#FED7AA",
    "ERROR" = "#FECACA",
}

interface Message {
    message: string;
    background: MessageColors;
}

interface MessagesState {
    messages: Message[];
    currentMessage: string | null;
    background: MessageColors;
}

const initialState: MessagesState = {
    messages: [],
    currentMessage: null,
    background: MessageColors.SUCCESS,
};

export const messagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        setMessages(state, action: PayloadAction<Message[]>) {
            state.messages = action.payload;
        },
        setMessage(state, action: PayloadAction<{ message: string, background: MessageColors }>) {
            state.currentMessage = action.payload.message;
            state.background = action.payload.background;
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

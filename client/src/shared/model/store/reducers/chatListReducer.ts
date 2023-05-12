import type DialogueChat from "../../../types/features/DialogueChat";

import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type ChatListState = {
    payload: DialogueChat[] | null;
};

const initialState = { payload: null } as ChatListState;

const chatListSlice = createSlice({
    name: "chatList",
    initialState,
    reducers: {
        setChatList(state, action: PayloadAction<DialogueChat[]>) {
            state.payload = action.payload;
        },
        updateChat(state, action: PayloadAction<DialogueChat>) {
            if (!state.payload) {
                return;
            }

            const targetedChat = state.payload.find((chat) => chat.id === action.payload.id);

            if (!targetedChat) {
                throw new Error("Targeted chat wasn't found");
            }

            state.payload.splice(state.payload.indexOf(targetedChat), 1);
            state.payload = [...state.payload, action.payload];
        },
        clearChatList(state) {
            state.payload = null;
        },
    },
});

export default chatListSlice;

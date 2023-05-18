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
            const newState = action.payload;
            const currentState = state.payload;

            // Comparing new and current state. (This excludes at least 1 excess render)
            if (currentState && currentState.length === newState.length) {
                if (isChatListsSame(currentState, newState)) {
                    return;
                }
            }

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
            state.payload = [action.payload, ...state.payload];
        },
        clearChatList(state) {
            state.payload = null;
        },
    },
});

// TODO require testing with several chats
function isChatListsSame(currentChatList: DialogueChat[], newChatList: DialogueChat[]): boolean {
    const dictionary = {} as { [key: string]: number };

    for (let i = 0; i < currentChatList.length; i++) {
        const curChatID = currentChatList[i].id;

        if (typeof dictionary[curChatID] !== "undefined") {
            dictionary[curChatID] = 1;
            continue;
        }

        dictionary[curChatID] += dictionary[curChatID];
    }

    for (let i = 0; i < newChatList.length; i++) {
        const newStateChatID = newChatList[i].id;

        // If new state icludes chat wich not included in current state.
        if (!dictionary[newStateChatID]) {
            return false;
        }

        if (dictionary[newStateChatID] > 1) {
            throw new Error("Incorrect value of new chat list. Chat duplicate was found for: " + newStateChatID);
        }
    }

    return true;
}

export default chatListSlice;

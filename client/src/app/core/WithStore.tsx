import React from "react";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { Provider as StoreProvider } from "react-redux";
import widnowLayoutSlice from "../model/reducers/windowLayoutReducer";
import { navigatorSlice } from "../../pages";
import { friendsSlice, incomingFriendRequestsSlice, outcomingFriendRequestsSlice } from "../../features/Friends";
import chatListSlice from "../../shared/model/store/reducers/chatListReducer";
import { authSlice } from "../../features/Auth";

interface withStoreProps {
    children: React.ReactNode;
}

export const rootReducer = combineReducers({
    auth: authSlice["reducer"],
    windowLayout: widnowLayoutSlice["reducer"],
    navigator: navigatorSlice["reducer"],
    friends: friendsSlice["reducer"],
    chatList: chatListSlice["reducer"],
    incomingFriendRequests: incomingFriendRequestsSlice["reducer"],
    outcomingFriendRequests: outcomingFriendRequestsSlice["reducer"],
});

export const store = configureStore({
    reducer: rootReducer,
});

export default function WithStore({ children }: withStoreProps) {
    return <StoreProvider store={store}>{children}</StoreProvider>;
}

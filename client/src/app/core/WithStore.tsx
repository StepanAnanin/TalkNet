import React from "react";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { Provider as StoreProvider } from "react-redux";
import { authSlice } from "../../entities/User";
import widnowLayoutSlice from "../model/reducers/windowLayoutReducer";
import { navigatorSlice } from "../../pages";
import friendsSlice from "../../widgets/Navigator/model/store/reducers/friendsReducer";
import incomingFriendRequestsSlice from "../../widgets/Navigator/model/store/reducers/incomingFriendRequestsReducer";
import outcomingFriendRequestsSlice from "../../widgets/Navigator/model/store/reducers/outcomingFriendRequestsReducer";

interface withStoreProps {
    children: React.ReactNode;
}

export const rootReducer = combineReducers({
    auth: authSlice["reducer"],
    windowLayout: widnowLayoutSlice["reducer"],
    navigator: navigatorSlice["reducer"],
    friends: friendsSlice["reducer"],
    incomingFriendRequests: incomingFriendRequestsSlice["reducer"],
    outcomingFriendRequests: outcomingFriendRequestsSlice["reducer"],
});

export const store = configureStore({
    reducer: rootReducer,
});

export default function WithStore({ children }: withStoreProps) {
    return <StoreProvider store={store}>{children}</StoreProvider>;
}

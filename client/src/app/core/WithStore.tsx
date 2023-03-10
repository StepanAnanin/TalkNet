import React from "react";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { Provider as StoreProvider } from "react-redux";
import { authSlice } from "../../entities/User";
import widnowLayoutSlice from "../model/reducers/windowLayoutReducer";

interface withStoreProps {
    children: React.ReactNode;
}

export const rootReducer = combineReducers({
    auth: authSlice["reducer"],
    windowLayout: widnowLayoutSlice["reducer"],
});

export const store = configureStore({
    reducer: rootReducer,
});

export default function WithStore({ children }: withStoreProps) {
    return <StoreProvider store={store}>{children}</StoreProvider>;
}

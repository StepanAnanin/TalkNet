import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { Provider as StoreProvider } from "react-redux";
import { authSlice } from "../../entities/User";

interface withStoreProps {
    children: React.ReactNode;
}

export const rootReducer = combineReducers({
    auth: authSlice["reducer"],
});

export const store = configureStore({
    reducer: rootReducer,
});

export default function WithStore({ children }: withStoreProps) {
    return <StoreProvider store={store}>{children}</StoreProvider>;
}

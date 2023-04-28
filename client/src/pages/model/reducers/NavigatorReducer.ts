import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface NavigatorState {
    isOpen: boolean;
}

const initialState: NavigatorState = { isOpen: false };

const authSlice = createSlice({
    name: "navigator",
    initialState,
    reducers: {
        closeNavigator(state) {
            state.isOpen = false;
        },
        openNavigator(state) {
            state.isOpen = true;
        },
    },
});

export default authSlice;

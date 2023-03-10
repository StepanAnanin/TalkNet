import type WindowLayoutState from "../../../shared/types/app/store/windowLayoutReducer";

import getWindowLayout from "../../../shared/lib/helpers/geWindowLayout";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

// BREAKPOINTS:
// mobile: 576 px
// tablet: 768 px
// laptop: 998 px
// pc: 1200 px

const initialState: WindowLayoutState = getWindowLayout();

const widnowLayoutSlice = createSlice({
    name: "windowLayout",
    initialState,
    reducers: {
        setWindowLayout(state, action: PayloadAction<WindowLayoutState>) {
            state.breakpoint = action.payload.breakpoint;
            state.name = action.payload.name;
        },
    },
});

export default widnowLayoutSlice;

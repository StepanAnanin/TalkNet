import { useSelector } from "react-redux";
import { TypedUseSelectorHook } from "react-redux";
import { RootState } from "../../types/store";

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

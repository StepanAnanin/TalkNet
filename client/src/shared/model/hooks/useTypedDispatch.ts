import { useDispatch } from "react-redux";
import { AppDispatch } from "../../types/store";

export const useTypedDispatch = () => useDispatch<AppDispatch>();

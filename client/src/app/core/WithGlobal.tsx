import React from "react";
import useDebounce from "../../shared/model/hooks/useDebounce";
import { useTypedDispatch } from "../../shared/model/hooks/useTypedDispatch";
import getWindowLayout from "../../shared/lib/helpers/geWindowLayout";
import widnowLayoutSlice from "../model/reducers/windowLayoutReducer";

interface WithGlobalProps {
    children: React.ReactElement;
}
/**
 * This component is used to add global event listeners.
 *
 * Must be placed only in `App.tsx` below `WithStore` (otherwise app will crash) and
 * above `WithRouter` (otherwise will be an additional renders on path changes).
 */
export default function WithGlobal({ children }: WithGlobalProps) {
    const dispatch = useTypedDispatch();
    const prevWindowWidthRef = React.useRef(window.innerWidth);

    React.useEffect(() => {
        window.addEventListener("resize", windowResizeHandler as any);

        return function () {
            window.removeEventListener("resize", windowResizeHandler as any);
        };
    }, []);

    const windowResizeHandler = useDebounce(function (e: UIEvent) {
        const windowWidth = window.innerWidth;

        // If width wasn't changed
        if (prevWindowWidthRef.current === windowWidth) {
            return;
        }

        prevWindowWidthRef.current = windowWidth;

        const newWindowLayout = getWindowLayout();

        dispatch(widnowLayoutSlice.actions.setWindowLayout(newWindowLayout));
    }, 75);

    return <>{children}</>;
}

import React from "react";

export default function useThrottle(callback: (...args: any[]) => void, delay: number) {
    const isThrottled = React.useRef(false);

    return React.useCallback(
        (...throttledFunctionArgs: any[]) => {
            if (isThrottled.current) {
                return;
            }

            callback(...throttledFunctionArgs);

            isThrottled.current = true;

            setTimeout(() => (isThrottled.current = false), delay);
        },
        [callback, delay]
    );
}

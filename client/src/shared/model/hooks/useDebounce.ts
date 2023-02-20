import React from "react";

/**
 * Used to debounce function (mostly action handlers).
 *
 * (Already use useCallback inside)
 *
 * @returns memoised and debounced version of callback
 */

export default function useDebounce(callback: (...args: any[]) => void, delay: number) {
    const debounceTimerRef = React.useRef<NodeJS.Timeout | null>(null);

    return React.useCallback(
        (args: any[]) => {
            if (debounceTimerRef.current) {
                window.clearTimeout(debounceTimerRef.current);
            }

            debounceTimerRef.current = setTimeout(callback.bind(null, args), delay);
        },
        [callback, delay]
    );
}

// ---------------------------------- Example of usage ----------------------------------
//
// function TestComponent(props: any) {
//     const [value, setValue] = React.useState<string>("");
//     const inputChangeHandler = useDebounce<React.ChangeEventHandler<HTMLInputElement>>((e) => {
//         setValue(e.target.value);
//     }, 250);

//     return (
//         <div>
//             <input type="text" onChange={inputChangeHandler} />
//             <div>{value}</div>
//         </div>
//     );
// }

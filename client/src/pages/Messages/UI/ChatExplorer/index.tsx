import "./ChatExplorer.scss";
import React from "react";

import type { UiComponentProps } from "../../../../shared/types/UI/UiComponentProps";

import ChatExplorerControl from "../ChatExplorerControl";
import ChatPreview from "../../../../features/ChatPreview";
import useDebounce from "../../../../shared/model/hooks/useDebounce";

interface ChatExplorerProps extends UiComponentProps<HTMLDivElement> {
    //
}

/*
    TODO
    Change this component to the global component named Navigator, which should
    provide navigation through entire application, include friends, groups, chats etc.
    (don't forget about ChatExplorerControl)
*/
export default function ChatExplorer(props: ChatExplorerProps) {
    const { className = "", ...otherProps } = props;

    const [isMinified, setIsMinified] = React.useState(window.innerWidth < 900);
    const prevWidthRef = React.useRef<number>(window.innerWidth);

    React.useEffect(() => {
        window.addEventListener("resize", resizeChatExplorerHandler as any);

        return function () {
            window.removeEventListener("resize", resizeChatExplorerHandler as any);
        };
    }, []);

    const resizeChatExplorerHandler = useDebounce(function (e: UIEvent) {
        const windowWidth = window.innerWidth;

        // If changed was only height
        if (prevWidthRef.current === windowWidth) {
            return;
        }

        prevWidthRef.current = windowWidth;

        if (windowWidth < 900) {
            setIsMinified(true);
            return;
        }

        setIsMinified(false);
    }, 100);

    const classes = ["TNUI-ChatExplorer", isMinified ? "TNUI-ChatExplorer-closed" : "", className].join(" ");

    // =================== For test only ===================

    const x: any[] = [];

    for (let i = 0; i < 5; i++) {
        x.push(null);
    }

    // =====================================================

    return (
        <div className={classes} {...otherProps}>
            <ChatExplorerControl isMinifiedState={[isMinified, setIsMinified]} />
            <div className="TNUI-ChatExplorer-content">
                {x.map((e, i) => {
                    return (
                        <ChatPreview
                            active={i === 1}
                            key={i}
                            imgURL=""
                            lastMessage="Lorem ipsum dolor sit amet consectetur adipisicing elit.Lorem ipsum dolor sit amet consectetur adipisicing elit."
                            chatName="Test chat"
                            minified={isMinified}
                        />
                    );
                })}
            </div>
        </div>
    );
}

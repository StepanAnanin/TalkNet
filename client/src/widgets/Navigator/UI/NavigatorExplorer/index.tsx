import "./NavigatorExplorer.scss";
import React from "react";

import type { UiComponentProps } from "../../../../shared/types/UI/UiComponentProps";

import ChatPreview from "../../../../features/ChatPreview";
import { useTypedSelector } from "../../../../shared/model/hooks/useTypedSelector";

interface NavigatorExplorerProps extends UiComponentProps<HTMLDivElement> {
    //
}

export default function NavigatorExplorer(props: NavigatorExplorerProps) {
    const { className = "", ...otherProps } = props;

    const classes = ["TNUI-NavigatorExplorer", className].join(" ");

    // =================== For test only ===================

    const x: any[] = [];

    for (let i = 0; i < 25; i++) {
        x.push(null);
    }

    // =====================================================

    return (
        <div className={classes} {...otherProps}>
            {x.map((e, i) => {
                return (
                    <ChatPreview
                        active={i === 1}
                        key={i}
                        imgURL=""
                        lastMessage="Lorem ipsum dolor sit amet consectetur adipisicing elit.Lorem ipsum dolor sit amet consectetur adipisicing elit."
                        chatName="Test chat"
                    />
                );
            })}
        </div>
    );
}

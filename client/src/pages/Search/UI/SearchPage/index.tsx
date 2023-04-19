import "./SearchPage.scss";
import React from "react";

import type { UiComponentProps } from "../../../../shared/types/UI/UiComponentProps";

import Page from "../../../../shared/UI/Page";
import NavigatorLayout from "../../../UI/layouts/NavigatorLayout";
import ChatSearch from "../SearchForm";

interface SearchProps extends UiComponentProps<HTMLDivElement> {
    //
}

export default function SearchPage(props: SearchProps) {
    const { className = "", ...otherProps } = props;

    const classes = ["TNUI-MessagesPage", className].join(" ");

    return (
        <Page>
            <Page title="TalkNet | Добавить чат" className={classes} {...otherProps}>
                {/* TODO add option for user to toggle is navigator closed or not */}
                <NavigatorLayout closed={false} hideAddButton>
                    <ChatSearch />
                </NavigatorLayout>
            </Page>
        </Page>
    );
}

import "./SearchPage.scss";
import React from "react";

import type { UiComponentProps } from "../../../../shared/types/UI/UiComponentProps";

import Page from "../../../../shared/UI/Page";
import SearchForm from "../SearchForm";

interface SearchProps extends UiComponentProps<HTMLDivElement> {
    //
}

export default function SearchPage(props: SearchProps) {
    const { className = "", ...otherProps } = props;

    const classes = ["TNUI-SearchPage", className].join(" ");

    return (
        <Page title="TalkNet | Поиск" className={classes} {...otherProps}>
            <SearchForm />
        </Page>
    );
}

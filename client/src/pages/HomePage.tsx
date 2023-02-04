import React from "react";
import Page from "../shared/UI/Page";
import Button from "../shared/UI/Button";
import Header from "../widgets/Header";

export default function HomePage() {
    function clickHandler(e: any) {
        console.log(e.currentTarget);
    }

    return (
        <Page>
            <Header />
            <br />
            <br />
            <br />
            <Button onClick={clickHandler}>Назад</Button>
        </Page>
    );
}

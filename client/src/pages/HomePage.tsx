import React from "react";
import Page from "../shared/UI/Page";
import Button from "../shared/UI/Button";
import TextInput from "../shared/UI/TextInput";

export default function HomePage() {
    function clickHandler(e: any) {
        console.log(e.currentTarget);
    }

    return (
        <Page>
            <Button onClick={clickHandler} variant="outlined">
                Назад
            </Button>
            <br />
            <br />
            <br />
            <br />
            <TextInput />
        </Page>
    );
}

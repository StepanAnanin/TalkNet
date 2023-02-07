import React from "react";
import Page from "../../shared/UI/Page";
import Button from "../../shared/UI/Button";
import Header from "../../widgets/Header";
import UserRegistrationForm from "../SignUp/UI/UserRegistrationForm";

export default function HomePage() {
    function clickHandler(e: any) {
        console.log(e.currentTarget);
    }

    return (
        <Page>
            <Header />
            <div style={{ paddingInline: "50px" }}>
                <br />
                <br />
                <br />
                <Button onClick={clickHandler}>Назад</Button>
                <UserRegistrationForm />
            </div>
        </Page>
    );
}

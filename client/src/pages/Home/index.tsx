import React from "react";
import Page from "../../shared/UI/Page";
import Button from "../../shared/UI/Button";
import Header from "../../widgets/Header";
import UserRegistrationForm from "../SignUp/UI/UserRegistrationForm";
import { useTypedSelector } from "../../shared/model/hooks/useTypedSelector";
import Alert from "../../shared/UI/Alert";

export default function HomePage() {
    const { user } = useTypedSelector((state) => state.auth);

    function clickHandler() {
        console.log(user);
    }

    return (
        <Page>
            <Header />
            <div style={{ paddingInline: "50px" }}>
                <br />
                <br />
                <br />
                <Button onClick={clickHandler}>Log Auth Data</Button>
                <Alert severity="Info" header="Внимание">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minus ducimus enim, aliquid, nihil numquam
                    dicta asperiores ullam maiores laboriosam, qui in distinctio repellat voluptates dolorum facere officia
                    repudiandae inventore. Cumque!
                </Alert>
                <UserRegistrationForm />
            </div>
        </Page>
    );
}

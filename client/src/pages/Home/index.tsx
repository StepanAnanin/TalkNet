import React from "react";
import Page from "../../shared/UI/Page";
import Button from "../../shared/UI/Button";
import Header from "../../widgets/Header";
import { useTypedSelector } from "../../shared/model/hooks/useTypedSelector";
import FileSelectForm from "../../shared/UI/FileSelectForm";
import { Link } from "react-router-dom";

export default function HomePage() {
    const { payload: user } = useTypedSelector((state) => state.auth);
    const [x, sx] = React.useState(null as any);

    function clickHandler() {
        console.log(user);
    }

    return (
        <Page title="TalkNet | Главная">
            <Header />
            <div style={{ paddingInline: "50px" }}>
                <br />
                <br />
                <br />
                <Button onClick={clickHandler}>Button</Button>
            </div>
            <Link
                to="/n"
                style={{
                    textDecoration: "none",
                    fontSize: "24px",
                    margin: "10px 50px",
                    padding: "5px 20px",
                    color: "white",
                    border: "1px solid white",
                    borderRadius: "5px",
                    width: "fit-content",
                }}
            >
                to navigator
            </Link>
            <FileSelectForm
                name="test"
                selectedFileState={[x, sx]}
                allowedFileTypes={["image/jpeg", "image/png", "image/svg+xml"]}
            />
        </Page>
    );
}

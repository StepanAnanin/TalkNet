import React from "react";
import Page from "../../shared/UI/Page";
import Button from "../../shared/UI/Button";
import Header from "../../widgets/Header";
import { useTypedSelector } from "../../shared/model/hooks/useTypedSelector";
import FileSelectForm from "../../features/FileSelectForm";

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
            <FileSelectForm
                name="test"
                selectedFileState={[x, sx]}
                allowedFileTypes={["image/jpeg", "image/png", "image/svg+xml"]}
            />
        </Page>
    );
}

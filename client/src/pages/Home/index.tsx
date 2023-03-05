import React from "react";
import Page from "../../shared/UI/Page";
import Button from "../../shared/UI/Button";
import Header from "../../widgets/Header";
import { useTypedSelector } from "../../shared/model/hooks/useTypedSelector";
import Avatar from "../../shared/UI/Avatar";
import Menu from "../../shared/UI/Menu";
import MenuItem from "../../shared/UI/MenuItem";
import TextFiled from "../../shared/UI/TextField";

export default function HomePage() {
    const { user } = useTypedSelector((state) => state.auth);

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
                <Button onClick={clickHandler}>Log Auth Data</Button>
                <Avatar alt="C" />
                <Menu>
                    <MenuItem>Abaxoth</MenuItem>
                    <MenuItem>Test</MenuItem>
                    <MenuItem>Тест</MenuItem>
                    <MenuItem>Выход</MenuItem>
                </Menu>
                <TextFiled defaultValue="Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex, molestiae!" />
            </div>
        </Page>
    );
}

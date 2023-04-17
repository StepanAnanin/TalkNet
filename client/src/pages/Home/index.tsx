import React from "react";
import Page from "../../shared/UI/Page";
import Button from "../../shared/UI/Button";
import Header from "../../widgets/Header";
import { useTypedSelector } from "../../shared/model/hooks/useTypedSelector";
import Avatar from "../../shared/UI/Avatar";
import { ConfirmModal } from "../../features/Modal";

export default function HomePage() {
    const { user } = useTypedSelector((state) => state.auth);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    function clickHandler() {
        setIsModalOpen((p) => !p);
    }

    function confirmHandler() {
        console.log("confirm");
        setIsModalOpen(false);
    }

    return (
        <Page title="TalkNet | Главная">
            <Header />
            <div style={{ paddingInline: "50px" }}>
                <br />
                <br />
                <br />
                <Button onClick={clickHandler}>Button</Button>
                <Avatar alt="C" />
            </div>
            {isModalOpen && (
                <ConfirmModal
                    header="Подтвердите действие"
                    variant="outlined"
                    closeButtonLabel="Отмена"
                    onConfirm={confirmHandler}
                    setIsOpen={setIsModalOpen}
                    hideCloseIcon
                >
                    Вы уверены что хотите выйти из аккаунта?
                </ConfirmModal>
            )}
        </Page>
    );
}

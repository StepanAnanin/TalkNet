import React from "react";
import Page from "../../shared/UI/Page";
import Button from "../../shared/UI/Button";
import Header from "../../widgets/Header";
import { useTypedSelector } from "../../shared/model/hooks/useTypedSelector";
import Avatar from "../../shared/UI/Avatar";
import { ConfirmModal, CustomModal, InputModal } from "../../features/Modal";

export default function HomePage() {
    const { user } = useTypedSelector((state) => state.auth);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    function clickHandler() {
        setIsModalOpen((p) => !p);
    }

    function confirmHandler() {
        const element = inputRef.current;

        if (!element) {
            console.log("not found");
            return;
        }

        console.log(element.value);
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
                <CustomModal
                    header="Подтвердите действие"
                    variant="outlined"
                    closeButtonLabel="Отмена"
                    onConfirm={confirmHandler}
                    setIsOpen={setIsModalOpen}
                    hideCloseIcon
                >
                    Вы уверены что хотите выйти из аккаунта?
                </CustomModal>
            )}
        </Page>
    );
}

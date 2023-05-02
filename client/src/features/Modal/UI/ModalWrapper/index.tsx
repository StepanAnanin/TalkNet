import "./ModalWrapper.scss";
import React from "react";
import ReactDOM from "react-dom";

import type ModalWindowsProps from "../../../../shared/types/features/ModalWindowsProps";

import ClickAwayListener from "../../../../shared/UI/ClickAwayListener";
import ModalControl from "../ModalWindowControl";
import ModalHeader from "../ModalWindowHeader";

// Must be equal to $ModalsRootElement_z-index variable in
const defaultModalWindowZ_Index = 1000;

// TODO CSS properties transition works correctly only on open, but not on close
export default function ModalWrapper(props: ModalWindowsProps.AnyModal) {
    const { className, variant = "default", dontCloseOnClickAway = false, priority = 0, setIsOpen, children } = props;

    const modalsRootElement = document.getElementById("modals-root");

    if (!modalsRootElement) {
        throw new Error("Failed to find modals root element");
    }

    function modalWrapperClickAwayHandler() {
        if (dontCloseOnClickAway) {
            return;
        }

        handleClose();
        setIsOpen((p) => !p);
    }

    function handleClose() {
        props.onClose && props.onClose();
    }

    function handleConfirm() {
        props.onConfirm && props.onConfirm();
    }

    function handleReject() {
        // @ts-ignore
        props.onReject && props.onReject();
    }

    const classes = ["TNUI-ModalWrapper", "TNUI-ModalWrapper-" + variant, className ?? ""].join(" ");

    return ReactDOM.createPortal(
        <ClickAwayListener
            onClickAway={modalWrapperClickAwayHandler}
            className={classes}
            style={{ zIndex: defaultModalWindowZ_Index + priority }}
        >
            {!props.hideHeader && (
                <ModalHeader label={props.header ?? ""} setIsOpen={props.setIsOpen} hideCloseIcon={props.hideCloseIcon} />
            )}
            <div className="TNUI-Modal-body">{children}</div>
            {!props.hideControl && (
                <ModalControl
                    confirmButtonLabel={props.confirmButtonLabel}
                    closeButtonLabel={props.closeButtonLabel}
                    setIsOpen={props.setIsOpen}
                    onConfirm={handleConfirm}
                    onClose={handleClose}
                    onReject={handleReject}
                    hideCloseButton={props.hideCloseButton}
                />
            )}
        </ClickAwayListener>,
        modalsRootElement
    );
}

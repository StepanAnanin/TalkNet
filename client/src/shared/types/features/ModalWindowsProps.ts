import React from "react";

import type TextInputType from "../UI/TextInputType";
import type { UiComponentProps } from "../UI/UiComponentProps";

// TODO require refactoring, need to remove this
namespace ModalWindowsProps {
    interface UnspecifiedModal extends UiComponentProps<HTMLDivElement> {
        header: string | null;
        setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
        variant?: "outlined" | "default";
        priority?: number; // This is about z-index (Maybe get rid of it?)
        dontCloseOnClickAway?: boolean;
        hideCloseIcon?: boolean;
        hideCloseButton?: boolean;
        hideHeader?: boolean;
        hideControl?: boolean;
        closeButtonLabel?: string;
        confirmButtonLabel?: string;
        onClose?: () => void;
        onConfirm?: () => void;
    }

    export interface AlertModal extends UnspecifiedModal {
        //
    }

    export interface InputModal extends UnspecifiedModal {
        inputPlaceholder?: string;
        inputClassName?: string;
        type?: TextInputType;
    }

    export interface ConfirmModal extends UnspecifiedModal {
        onReject?: () => void; // close !== reject
    }

    /**
     * Content of this modal must be passed as children
     */
    export interface CustomModal extends UnspecifiedModal {
        //
    }

    /**
     * Any extended modal type, except custom modal
     */
    export type AnyModal = AlertModal | InputModal | ConfirmModal;
}

export default ModalWindowsProps;

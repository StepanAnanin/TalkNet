import "./FileSelectForm.scss";
import React from "react";

import type { UiComponentProps } from "../../types/UI/UiComponentProps";

interface FileSelectFormProps extends UiComponentProps<HTMLFormElement> {
    selectedFileState: [File | null, React.Dispatch<React.SetStateAction<File | null>>];

    /** Name must be unique for each form */
    name: string;

    /**
     * For all existed file types see:
     * https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
     */
    allowedFileTypes?: string[];
    onInvalidFileType?: (file: File) => void;
    onFolderSelect?: (file: File) => void;
}

function checkIsFolder(file: File) {
    if (file.size === 0 && file.type === "" && file.webkitRelativePath === "") {
        return true;
    }

    return false;
}

const fileSelectFormsNames: string[] = [];

export default function FileSelectForm(props: FileSelectFormProps) {
    const {
        className = "",
        name,
        selectedFileState,
        allowedFileTypes = [],
        onInvalidFileType,
        onFolderSelect,
        ...otherProps
    } = props;

    const [selectedFile, setSelectedFile] = selectedFileState;

    if (typeof name !== "string" || name === "") {
        throw new TypeError("FileSelectForm's name must be non-empty string");
    }

    React.useEffect(() => {
        if (fileSelectFormsNames.includes(name)) {
            throw new Error("FileSelectForm with this name arleady exist");
        }

        fileSelectFormsNames.push(name);

        return function () {
            fileSelectFormsNames.splice(fileSelectFormsNames.indexOf(name), 1);
        };
    }, []);

    function updateSelectedFile(file: File) {
        // If file has non-allowed type
        if (allowedFileTypes.length !== 0 && !allowedFileTypes.includes(file.type)) {
            onInvalidFileType && onInvalidFileType(file);
            return;
        }

        // If file is folder (they obvioulsy can't be send through HTTP)
        if (checkIsFolder(file)) {
            console.error(new TypeError(`File "${file.name}" is folder. It can't be selected.`));
            onFolderSelect && onFolderSelect(file);
            return;
        }

        setSelectedFile(file);
    }

    // --------------------------------- handlers ---------------------------------

    function fileSelectHandler(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.currentTarget.files || e.currentTarget.files.length === 0) {
            console.warn(`No files was selected`);
            return;
        }

        updateSelectedFile(e.currentTarget.files[0]);
    }

    function onDropHandler(e: React.DragEvent<HTMLFormElement>) {
        e.preventDefault();

        updateSelectedFile(e.dataTransfer.files[0]);

        props.onDrop && props.onDrop(e);
    }

    // This function needed to prevent browser to open file on drag and drop.
    // see: https://stackoverflow.com/questions/6756583/prevent-browser-from-loading-a-drag-and-dropped-file
    function onDragOverHander(e: React.DragEvent<HTMLFormElement>) {
        e.preventDefault();

        props.onDragOver && props.onDragOver(e);
    }

    const classes = ["TNUI-FileSelectForm", className ?? ""].join(" ");
    const fileInputID = "TNUI-FileSelectForm_" + name;

    return (
        <form
            className={classes}
            method="post"
            encType="multipart/form-data"
            onDragOver={onDragOverHander}
            onDrop={onDropHandler}
            {...otherProps}
        >
            <input type="file" id={fileInputID} className="TNUI-FileSelectForm_input" onChange={fileSelectHandler} />
            <label className="TNUI-FileSelectForm_label" htmlFor={fileInputID}>
                Выберите файл или перетащите его сюда
            </label>
        </form>
    );
}

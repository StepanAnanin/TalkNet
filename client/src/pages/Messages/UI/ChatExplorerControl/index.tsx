import "./ChatExplorerControl.scss";

import OpenedIcon from "@mui/icons-material/StartOutlined";
import ClosedIcon from "@mui/icons-material/ArrowBack";
import TuneIcon from "@mui/icons-material/Tune";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

import type { UiComponentProps } from "../../../../shared/types/UI/UiComponentProps";

interface ChatExplorerControlProps extends UiComponentProps<HTMLDivElement> {
    isMinifiedState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}

export default function ChatExplorerControl(props: ChatExplorerControlProps) {
    const { className = "", isMinifiedState, ...otherProps } = props;

    const [isMinified, setIsMinified] = isMinifiedState;

    function toggleMinified() {
        setIsMinified((p) => !p);
    }

    const classes = ["TNUI-ChatExplorerControl", className].join(" ");

    return (
        <div className={classes} {...otherProps}>
            {isMinified ? (
                <ClosedIcon className="TNUI-ChatExplorerControl-icon" onClick={toggleMinified} />
            ) : (
                <>
                    <TuneIcon className="TNUI-ChatExplorerControl-icon" />
                    <div className="TNUI-ChatExplorerControl-search">
                        <input className="TNUI-ChatExplorerControl-search_input" placeholder="Поиск" />
                        <SearchOutlinedIcon className="TNUI-ChatExplorerControl-search_icon" />
                    </div>
                    <OpenedIcon className="TNUI-ChatExplorerControl-icon" onClick={toggleMinified} />
                </>
            )}
        </div>
    );
}

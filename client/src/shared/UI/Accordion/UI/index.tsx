import "./Accordion.scss";

import ArrowDownIcon from "@mui/icons-material/KeyboardArrowDownRounded";

import type { UiComponentProps } from "../../../types/UI/UiComponentProps";

interface AccordionProps extends UiComponentProps<HTMLDivElement> {
    header: React.ReactNode;
    bodyClassName?: string;
    headerClassName?: string;
    defaultOpen?: boolean;
}

// TODO Need to make it open smooth
export default function Accordion(props: AccordionProps) {
    const { className, bodyClassName, headerClassName, defaultOpen = false, header, children, ...otherProps } = props;

    function toggleAccordion(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        // This handler bound to header, so his paren is accordion root
        const accordionRootElement = e.currentTarget.parentElement!;

        accordionRootElement.classList.toggle("TNUI-Accordion__open");
    }

    const classes = ["TNUI-Accordion", defaultOpen ? "TNUI-Accordion__open" : "", className ?? ""].join(" ");
    const headerClasses = ["TNUI-Accordion_header", headerClassName ?? ""].join(" ");
    const bodyClasses = ["TNUI-Accordion_body", bodyClassName ?? ""].join(" ");

    return (
        <div className={classes} {...otherProps}>
            <div className={headerClasses} onClick={toggleAccordion}>
                {header}
                <ArrowDownIcon className="TNUI-Accordion_header-icon" />
            </div>
            <div className={bodyClasses}>{children}</div>
        </div>
    );
}

import type WindowLayouts from "../../types/common/WindowsLayouts";

import { tabletLayout, mobileLayout, laptopLayout, PCLayout } from "./WindowLayoutBreakPoints";

export default function getWindowLayout(): WindowLayouts.Any {
    const windowWidth = window.innerWidth;

    if (windowWidth < mobileLayout.breakpoint) {
        return { ...mobileLayout };
    }

    if (windowWidth < tabletLayout.breakpoint) {
        return { ...tabletLayout };
    }

    if (windowWidth < laptopLayout.breakpoint) {
        return { ...laptopLayout };
    }

    return { ...PCLayout };
}

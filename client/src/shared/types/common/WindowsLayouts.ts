type WindowLayoutBreakpoints = 576 | 768 | 998 | 1200;

interface WindowLayoutType<N extends string, WB extends WindowLayoutBreakpoints> {
    name: N;
    breakpoint: WB;
}

namespace WindowLayouts {
    // Must match with breakpoints in file at path "src/app/core/styles/screen-breakpoints.scss"

    export type Mobile = WindowLayoutType<"mobile", 576>;

    export type Tablet = WindowLayoutType<"tablet", 768>;

    export type Laptop = WindowLayoutType<"laptop", 998>;

    export type PC = WindowLayoutType<"pc", 1200>;

    //

    export type Any = Mobile | Tablet | Laptop | PC;
}

export default WindowLayouts;

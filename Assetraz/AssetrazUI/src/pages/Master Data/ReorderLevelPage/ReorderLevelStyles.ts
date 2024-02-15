import { DefaultPalette, IDropdownStyles, IStackItemStyles } from "@fluentui/react";

export const stackItemStyles: IStackItemStyles = {
    root: {
        width: "100%",
        background: DefaultPalette.white,
        color: DefaultPalette.white,
        display: "flex",
        height: "max",
        padding: "20px",
    },
};

export const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: { width: 300 },
};
import { DefaultPalette, IDropdownStyles, IStackItemStyles } from "@fluentui/react";

export const dropdownStyles: Partial<IDropdownStyles> = {
        dropdown: { width: 300 },
    };
export const inlineInputStyle = {
  root: {
      label: {
          whiteSpace: "nowrap",
          padding: "5px 5px 5px 0",
          lineHeight: 22,
          minWidth: 120,
          fontSize: 16,
      },
      lineHeight: "22px",
      marginTop: "25px",
  },
  fieldGroup: { marginLeft: 10, minWidth: 200, width: "80%" },
  wrapper: { display: "flex" },
};

export const input50 = {
  root: { marginRight: "4%", width: "40%" },
};

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
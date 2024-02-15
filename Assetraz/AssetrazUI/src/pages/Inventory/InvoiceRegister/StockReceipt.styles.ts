import { IDropdownStyles, IIconProps, ITooltipHostStyles, getTheme } from "@fluentui/react";

const theme = getTheme();

export const inlineInputStyle = {
    root: {
        margin: "16px 0",
        label: {
            whiteSpace: "nowrap",
            padding: "5px 0px 5px 0",
            lineHeight: 22,
            fontSize: 16,
        },
    },
    wrapper: { display: "flex" },
};

export const downloadIcon: IIconProps = { iconName: "download" };

export const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: { width: 200, border: "none" },
};

export const hostStyles: Partial<ITooltipHostStyles> = {
  root: { display: "inline-block", marginLeft: "5px" },
};

export const calloutProps = { gapSpace: 0 };

export const infoButtonStyles = {
  root: {
      background: "transparent",
      color: theme.palette.blueLight,
      border: "none",
      minWidth: "16px",
      padding: 0,
  },
};

export const filterStyles = {
  root: {
    paddingTop: "25px",
  }
};

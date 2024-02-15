import { ITooltipHostStyles, getTheme } from "@fluentui/react";

const theme = getTheme();

export const infoButtonStyles = {
  root: {
      background: "transparent",
      color: theme.palette.blueLight,
      border: "none",
      minWidth: "16px",
      padding: 0,
  },
};

export const hostStyles: Partial<ITooltipHostStyles> = {
  root: { display: "inline-block", marginLeft: "5px" },
};
export const calloutProps = { gapSpace: 0 };

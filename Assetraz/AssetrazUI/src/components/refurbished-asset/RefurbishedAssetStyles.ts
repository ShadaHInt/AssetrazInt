import { IStackTokens } from "@fluentui/react";

export const stackToken: IStackTokens = {
  childrenGap: 5,
  padding: 10,
};

export const wrapStackTokens: IStackTokens = {
  childrenGap: 10,
};

export const buttonStyles = { root: { margin: 8 } };

export const infoButtonStyles = {
  root: {
      background: "transparent",
      border: "none",
      minWidth: "16px",
      padding: 0,
  },
};
export const inlineInputStyle = {
  root: {
      padding: "16px 0",
      label: {
          whiteSpace: "nowrap",
          padding: "5px 0px 5px 0",
          lineHeight: 22,
          fontSize: 16,
      },
      lineHeight: "22px",
  },
  wrapper: { display: "flex" },
};

export const input25 = {
  root: { padding: "16px 0", width: "25%" },
};
export const input30 = {
  root: { width: "90%" },
};

export const inputFullWidth = {
  root: { padding: "16px 0", width: "69%" },
};
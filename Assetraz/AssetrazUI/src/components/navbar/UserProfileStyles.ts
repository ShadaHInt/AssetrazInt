import { ITheme, getFocusStyle, getTheme, mergeStyleSets } from "@fluentui/react";

export const styles = mergeStyleSets({
    callout: {
        width: 350,
        padding: "20px 24px",
        backgroundColor: "white",
    },
});

export const theme: ITheme = getTheme();
export const { palette, semanticColors } = theme;

export const classNames = mergeStyleSets({
    itemCell: [
        getFocusStyle(theme, { inset: -1 }),
        {
            minHeight: 40,
            padding: 5,
            boxSizing: "border-box",
            borderBottom: `1px solid ${semanticColors.bodyDivider}`,
            display: "flex",
            selectors: {
                "&:hover": { background: palette.neutralLight },
            },
            cursor: "pointer",
        },
    ],
});
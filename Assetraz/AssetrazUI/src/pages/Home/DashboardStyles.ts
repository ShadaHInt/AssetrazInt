import { FontWeights, getTheme, IDropdownStyles, mergeStyleSets } from "@fluentui/react";

const theme = getTheme();
const contentStyles = mergeStyleSets({
    container: {
        display: "flex",
        flexFlow: "column nowrap",
        alignItems: "stretch",
        width: "50%",
    },
    header: [
        theme.fonts.xxLarge,
        {
            flex: "1 1 auto",
            borderTop: `4px solid ${theme.palette.themePrimary}`,
            color: theme.palette.neutralPrimary,
            display: "flex",
            alignItems: "center",
            fontWeight: FontWeights.semibold,
            padding: "12px 12px 14px 24px",
        },
    ],
    body: {
        flex: "4 4 auto",
        padding: "0 24px 24px 24px",
        selectors: {
            p: { margin: "14px 0" },
            "p:first-child": { marginTop: 0 },
            "p:last-child": { marginBottom: 0 },
        },
    },
});

const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: { width: 200, border: "none" },
};

const iconButtonStyles = {
    root: {
        color: theme.palette.neutralPrimary,
        marginLeft: "auto",
        marginTop: "2px",
        marginRight: "2px",
    },
    rootHovered: {
        color: theme.palette.neutralDark,
    },
};

const buttonStyles = { root: { margin: 8 } };

const deleteIconStyles = {
    icon: {
        fontSize: "x-large",
    },
    root: {
        color: theme.palette.redDark,
        marginLeft: "auto",
        marginTop: "2px",
        marginRight: "2px",
    },
    rootHovered: {
        color: theme.palette.neutralDark,
    },
};

const textstyle = {root: {width: 200}};

const textFieldStyle = {root: {width: 220}};

const comboBoxStyles = { root: { width: 200 } };

const DashboardStyle = {
    contentStyles: contentStyles,
    iconButtonStyles: iconButtonStyles,
    buttonStyles: buttonStyles,
    deleteIconStyles: deleteIconStyles,
    dropdownStyles: dropdownStyles,
    textstyle:textstyle,
    comboBoxStyles:comboBoxStyles,
    textFieldStyle:textFieldStyle
};

export default DashboardStyle;
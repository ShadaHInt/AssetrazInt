import { IDropdownStyles } from "@fluentui/react";
import { makeStyles } from "@fluentui/react-theme-provider";

export const dropdownStyles: Partial<IDropdownStyles> = {
        dropdown: { width: 210 },
    };

export const updateQuoteDropdownStyle: Partial<IDropdownStyles> = {
        dropdown: { width: 150 },
    };

export const detailsListStyles = makeStyles(() => ({
    tooltip: {
        "& .ms-TooltipHost": {
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
        },
    },
    table: {
        borderCollapse: "collapse",
    },
    tableData: {
        border: "1px solid #ccc",
        padding: 8,
    },
    textField: {
        maxWidth: "300px",
    },
    root: {
        width: "100%",
        backgroundColor: "#fff",
        marginBottom: 16,
        padding: 16,
    },
    iconClass: { fontSize: 16, height: 16, width: 16, paddingTop: 8 },
}));

import { makeStyles } from "@fluentui/react";

export const detailsListStyles = makeStyles(() => ({
    root: {
        width: "100%",
        backgroundColor: "#fff",
        marginBottom: 16,
        padding: 16,
    },
    textField: {
        maxWidth: "300px",
    },
    tooltip: {
        "& .ms-TooltipHost": {
            width: "62px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
        },
    },
}));

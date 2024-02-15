import { IDetailsListStyles,makeStyles } from "@fluentui/react";

export const gridStyles: Partial<IDetailsListStyles> = {
    root: {
        selectors: {
            "& [role=grid]": {
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
                maxHeight: "50vh",
            },
        },
    },
    headerWrapper: {
        flex: "1 1 auto",
        width: "100%",
    },
    contentWrapper: {
        width: "100%",
        flex: "1 1 auto",
        overflow: "auto",
    },
};

export const detailsListStyles = makeStyles(() => ({
    root: {
        width: "100%",
        marginBottom: 50,
        //paddingRight: 16,

        "& .ms-DetailsHeader": {
            paddingTop: 0,
        },

        "& .ms-DetailsRow": {
            minWidth: "100% !important",
        },

        "& .ms-DetailsList": {
            overflow: "hidden",
        },
        "& .ms-DetailsList :hover": {
            backgroundColor: "rgb(230,230,230)",
        },
    },
    details: {},
    textField: {
        maxWidth: "300px",
    },
    table: {
        "& .ms-TooltipHost": {
            width: "150px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
        },
    },
    noData: {
        align: "center",
        width: "70%",
        height: "50px",
    },
    header: {
        height: "50px",
        backgroundColor: "white",
    },
}));
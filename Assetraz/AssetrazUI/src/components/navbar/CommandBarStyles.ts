import { makeStyles } from "@fluentui/react";

export const CommandBarStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,

        "& .ms-CommandBar": {
            paddingLeft: 6,
            paddingRight: 6,
            height: 48,
        },
        "button.ms-Button": {
            paddingRight: 16,
        },
        "button.ms-Button.is-checked": {
            borderBottom: "2px solid #0078d4",
            backgroundColor: theme.palette.white,
        },
        ".ms-Icon": {
            fontSize: 14,
        },
    },
}));
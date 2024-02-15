import { IIconProps } from "@fluentui/react";
import { theme } from "../../../components/navbar/UserProfileStyles";

export const deleteIcon: IIconProps = { iconName: "Delete" };
export const deleteIconStyles = {
    icon: {
        fontSize: "x-large",
    },
    root: {
        color: theme.palette.redDark,
    },
    rootHovered: {
        color: theme.palette.neutralDark,
    },
};

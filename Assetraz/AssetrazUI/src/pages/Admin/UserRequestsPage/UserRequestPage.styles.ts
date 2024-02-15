import { makeStyles } from "@fluentui/react-theme-provider";
import { ShimmerElementType, getTheme, mergeStyleSets } from "@fluentui/react";
import { mergeStyles } from "@fluentui/react/lib/Styling";

export const detailsListStyles = makeStyles(() => ({
    tooltip: {
        "& .ms-TooltipHost": {
            width: "62px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
        },
    },
    textField: {
        maxWidth: "300px",
    },
    root: {
        width: "100%",
        backgroundColor: "var(--white)",
        marginBottom: 16,
        padding: "10px 16px 16px 16px",
    },
}));

export const inputStyle = {
    root: {
        width: "75%",
        padding: "16px 0",
        div: {
            p: {
                position: "absolute",
                right: 0,
                width: "100%",
                span: {
                    position: "absolute",
                    right: 0,
                    top: "1px",
                },
            },
            flex: 2,
        },
        label: {
            flex: 1,
            whiteSpace: "nowrap",
            padding: "5px 0px 5px 0",
            lineHeight: 22,
        },
    },
    wrapper: { display: "flex" },
};

export const textAreaStyle = {
    root: {
        padding: "4px 0",
        div: { 
          flex: 4 ,
          marginRight: "20px"
        },
        label: { flex: 1, whiteSpace: "nowrap" },
    },
    wrapper: { display: "flex" },
};

export const dropDownStyle = {
    root: {
        width: "75%",
        marginBottom: "80px",
        padding: "16px 0",
        display: "flex",
        div: { flex: 2 },
        label: { flex: 1, whiteSpace: "nowrap" },
    },
    wrapper: { display: "flex" },
};
const theme = getTheme();

export const contentStyles = mergeStyleSets({
    comboBox: {
        display: "flex",
        width: "75%",
        padding: "16px 0",
        selectors: {
            div: {
                flex: 2,
            },
            label: { flex: 1, whiteSpace: "nowrap", marginRight: "20px" },
        },
    },
    flexRight: {
        display: "flex",
        justifyContent: "end",
    },
    padding10: {
        padding: "13px",
    },
});

export const iconButtonStyles = {
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

export const buttonStyles = { root: { margin: 8 } };

export const iconClass = mergeStyles({
    fontSize: 16,
    height: 16,
    width: 16,
    paddingTop: 8,
});

export const inlineInputStyle = {
    root: {
        label: {
            flex: "0 0 150px",
            whiteSpace: "nowrap",
            padding: "5px 0px 5px 0",
            lineHeight: 22,
            minWidth: 120,
            fontSize: 16,
        },
        lineHeight: "22px",
    },
    fieldGroup: { marginLeft: 0, minWidth: 230, width: "80%" },
    wrapper: { flex: "1",display: "flex" , alignItems: "flex-start"},
};

export const textAreaStyleReadOnly = {
  root: {
      padding: "4px 0",
      div: { 
        flex: 4 ,
        marginRight: "20px",
        borderColor: "#ccc"
      },
      label: { flex: "0 0 150px", whiteSpace: "nowrap" },
  },
  wrapper: { display: "flex", alignItems: "flex-start", },
  fieldGroup: {
    flex: "1",
    borderColor: "#ccc",
  },
};

export const checkBoxStyle = {
  root: {
      label: {
        span: { fontSize: "14px", fontWeight: "600" },
          paddingTop: "5px",
      },
  },
};

export const shimmerElements = [
    { type: ShimmerElementType.circle, height: 24 },
    { type: ShimmerElementType.gap, width: "2%" },
    { type: ShimmerElementType.line, height: 16, width: "20%" },
    { type: ShimmerElementType.gap, width: "5%" },
    { type: ShimmerElementType.line, height: 16, width: "20%" },
    { type: ShimmerElementType.gap, width: "10%" },
    { type: ShimmerElementType.line, height: 16, width: "15%" },
    { type: ShimmerElementType.gap, width: "10%" },
    { type: ShimmerElementType.line, height: 16, width: "15%" },
];

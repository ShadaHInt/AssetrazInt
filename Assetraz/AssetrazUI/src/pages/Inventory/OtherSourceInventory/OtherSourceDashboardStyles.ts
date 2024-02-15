import { makeStyles } from "@fluentui/react-theme-provider";

export const toolTipStyle = makeStyles(() => ({
  tooltip: {
      "& .ms-TooltipHost": {
          width: "62px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          position: "relative",
      },
  },
  table: {
      borderCollapse: "collapse",
  },
  tableData: {
      border: "1px solid #ccc",
      padding: 8,
  },
}));

export const clearIconStyle = {
    root: {
    marginTop: "30%",
    border: "none",
    height: "5px",
  },
  icon: {
    fontSize: "13px",
  },
};
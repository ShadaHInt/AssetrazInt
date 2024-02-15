import { IButtonStyles, IDetailsRowStyleProps, IDetailsRowStyles, IStyleFunctionOrObject } from "@fluentui/react";
import { reOrderLevel } from "../../types/ReOrderLevel";

export const notificationBadgeStyle: IButtonStyles = {
  textContainer: {
            fontSize: 10,
            position: "relative",
            top: "-6px",
            right: "6px",
            color: "white",
            backgroundColor: "#0078d4",
            borderRadius: "50%",
            width: "15px",
            height: "15px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
    },  
};

export const rowStyle = (item: reOrderLevel):IStyleFunctionOrObject<IDetailsRowStyleProps, IDetailsRowStyles> => {
  if (
      item.available <= item.warningLevel &&
      item.available > item.criticalLevel
  ) {
      return {
          root: {
              backgroundColor: "rgb(250 227 205)",
              color: "rgb(239 122 5)",
          },
      };
  }
  if (item.available <= item.criticalLevel) {
      return {
          root: {
              backgroundColor: "rgb(253, 231, 233)",
              color: "rgb(168, 0, 0)",
          },
      };
  } else return {};
};
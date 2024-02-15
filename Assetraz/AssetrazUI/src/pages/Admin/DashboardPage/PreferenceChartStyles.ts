import { IDocumentCardStyles, IDropdownStyles, IIconProps, mergeStyles } from "@fluentui/react";

export const cardStyles: IDocumentCardStyles = {
  root: {
      display: "inline-block",
      marginRight: 20,
      marginBottom: 20,
      width: 320,
      border: "1px solid #ccc",
      borderRadius: 5,
      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
      transition: "transform 0.2s",
      ":hover": {
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)",
          transform: "scale(1.03)",
      },
  },
};

export const conversationTileClass = mergeStyles({
  height: 420,
  padding: 10,
});

export const emojiIcon: IIconProps = { iconName: "ChromeClose" };

export const customStyles = {
  root: {
      fontSize: 10,
      width: 20,
      height: 20,
      marginTop: 5,
  },
};

export const alignCenterStyles = {
  
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "auto",

};


export const preferenceHeaderContainer = {
  width: "100%",
  backgroundColor: "#fff",
  alignItems: "center",
  marginBottom: 16,
  padding: 16,
};

export const dropdownStyles: Partial<IDropdownStyles> = {
  dropdown: { width: 210 },
};

export const addIcon: IIconProps = { iconName: "Add" };

export const chartWrapper = {
  root:{
    marginTop: "20px",
    display: "flex",
    flexWrap: "wrap",
  }
};

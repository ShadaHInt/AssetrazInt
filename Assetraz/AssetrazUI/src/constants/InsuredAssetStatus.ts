import { IDropdownOption } from "@fluentui/react";

export const InsuredAssetStatus = {
    None:"None",
    Insured: "Insured",
    "Request Submitted": "Request Submitted",
};

export const noneOption: IDropdownOption<any> = {
    key: "None",
    text: InsuredAssetStatus.None
  };

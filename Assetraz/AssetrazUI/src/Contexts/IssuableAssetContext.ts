import React from "react";
import { createContext, useContext } from "react";
import { IDropdownOption } from "@fluentui/react";
import { Range } from "react-date-range";

import IAsset from "../types/Asset";
import { IDocument } from "../pages/Approvals/ApprovalDashboard";

export interface IIssuableAssetContext {
  assets: IAsset[] | null | undefined;
  allItems: IDocument[] | undefined;
  filterValue: string | null | undefined;
  filtered: IDocument[] | undefined;
  selectedItem: string;
  selectedInventoryId: string | undefined;
  networkCompanyOption: IDropdownOption<any>[] | null;
  initialOption: IDropdownOption<any> | undefined;
  selectedDateRange: Range | undefined;
  selectedIssuedDateRange: Range | undefined;
  setAssets: React.Dispatch<React.SetStateAction<IAsset[] | null | undefined>>;
  setAllItems: React.Dispatch<React.SetStateAction<IDocument[] | undefined>>;
  setFilterValue: React.Dispatch<React.SetStateAction<string | null>>;
  setFiltered: React.Dispatch<React.SetStateAction<IDocument[] | undefined>>;
  setSelectedItem: React.Dispatch<React.SetStateAction<string>>;
  setSelectedInventoryId: React.Dispatch<React.SetStateAction<string | undefined>>;
  setNetworkCompanyOption: React.Dispatch<React.SetStateAction<IDropdownOption<any>[] | null>>;
  setInitialOption: React.Dispatch<React.SetStateAction<IDropdownOption<any> | undefined>>;
  setDateRange: React.Dispatch<React.SetStateAction<Range>>;
  setSelectedIssuedDate: React.Dispatch<React.SetStateAction<Range>>;
}

export const IssuableContext = createContext<IIssuableAssetContext | undefined>(
    {} as IIssuableAssetContext
);

export const IssuableContextProvider = IssuableContext.Provider;
export const useIssuableAssetContext = () => useContext(IssuableContext);

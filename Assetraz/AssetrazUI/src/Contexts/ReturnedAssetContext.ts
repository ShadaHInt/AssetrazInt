import React from "react";
import { createContext,  useContext } from "react";
import { IDropdownOption } from "@fluentui/react";
import { RefurbishedAsset } from "../types/RefurbishedAsset";

export interface IReturnedContext {
  refurbishedAssets: RefurbishedAsset[] | null | undefined;
  setRefurbishedAssets: React.Dispatch<
    React.SetStateAction<RefurbishedAsset[] | null | undefined>
  >;
  networkCompanyOptions: IDropdownOption<any>[] | null | undefined;
  setNetworkCompanyOptions: React.Dispatch<
    React.SetStateAction<IDropdownOption<any>[] | null>
  >;
  initialOption: IDropdownOption<any> | null | undefined;
  setInitialOption: React.Dispatch<
    React.SetStateAction<IDropdownOption<any> | undefined>
  >;
  allItems: RefurbishedAsset[];
  setAllItems: React.Dispatch<React.SetStateAction<RefurbishedAsset[]>>;
  filtered: RefurbishedAsset[];
  setFiltered: React.Dispatch<React.SetStateAction<RefurbishedAsset[]>>;
  errorMessage: string | undefined;
  setErrorMessage: React.Dispatch<React.SetStateAction<string | undefined>>;
  selectedItem:string|undefined;
  setSelectedItem:React.Dispatch<React.SetStateAction<string | undefined>>;
}

export const ReturnedContext = createContext<IReturnedContext | undefined>(
    {} as IReturnedContext
);

export const ReturnedContextProvider = ReturnedContext.Provider;
export const useReturnAssetContext = () => useContext(ReturnedContext);

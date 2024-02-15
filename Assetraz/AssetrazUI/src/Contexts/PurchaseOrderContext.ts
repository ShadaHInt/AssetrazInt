import { Dispatch, SetStateAction, createContext, useContext } from "react";
import { PurchaseDetails } from "../types/PurchaseOrder";
import { IDropdownOption } from "@fluentui/react";

export interface IPOContext {
  data: PurchaseDetails[];
  filteredData: PurchaseDetails[];
  filterQuery: string;
  networkCompanyOptions: IDropdownOption<any>[] | null;
  selectedPOState: string;
  initialOption?: IDropdownOption<any>;
  selectedHandedOverState: string;
  setData: Dispatch<SetStateAction<PurchaseDetails[]>>;
  setFilterQuery: Dispatch<SetStateAction<string>>;
  setFilteredData: Dispatch<SetStateAction<PurchaseDetails[]>>;
  setNetworkCompanyOptions: Dispatch<SetStateAction<IDropdownOption<any>[] | null>>;
  setSelectedPOState: Dispatch<SetStateAction<string>>;
  setInitialOption: Dispatch<SetStateAction<IDropdownOption<any> | undefined>>;
  setSelectedHandedOverState: Dispatch<SetStateAction<string>>;
  getPurchaseOrderList: () => Promise<void>;
}


export const POContext = createContext<IPOContext | undefined>(
  {} as IPOContext
);

export const POContextProvider = POContext.Provider;
export const usePOContext = () => useContext(POContext);

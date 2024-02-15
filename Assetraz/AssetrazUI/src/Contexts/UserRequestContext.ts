
import { IDropdownOption } from "@fluentui/react";
import IPurchaseRequest from "../types/PurchaseRequest";
import { Dispatch, SetStateAction, createContext, useContext } from "react";


export interface IURContext{
  data :IPurchaseRequest[];
  setData : Dispatch<SetStateAction<IPurchaseRequest[]>>;
  filteredData: IPurchaseRequest[];
  setFilteredData: Dispatch<SetStateAction<IPurchaseRequest[]>>;
  filterQuery: string;
  setFilterQuery: Dispatch<SetStateAction<string>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  initialOption?: IDropdownOption<any>;
  setInitialOption: Dispatch<SetStateAction<IDropdownOption<any> | undefined>>;
  selectedStatus: string;
  setSelectedStatus : Dispatch<SetStateAction<string>>;
  networkCompanyOptions: IDropdownOption<any>[] | null;
  setNetworkCompanyOptions :Dispatch<SetStateAction<IDropdownOption<any>[] | null>>;
  getApprovedUserRequests: () => Promise<void>;
};

export const URContext = createContext<IURContext | undefined>(
  {} as IURContext
);

export const UserRequestContextProvider = URContext.Provider;
export const useURContext = () => useContext(URContext);
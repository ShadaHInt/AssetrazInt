import { IDropdownOption } from "@fluentui/react";
import { IInsuredAsset } from "../types/InsuredAsset";
import { Dispatch, SetStateAction, createContext, useContext } from "react";
import { Range } from "react-date-range";

export interface IInsuranceContextState {
  insuredAssets: IInsuredAsset[];
  filteredData: IInsuredAsset[];
  setInsuredAssets: Dispatch<SetStateAction<IInsuredAsset[]>>;
  setFiltered: Dispatch<SetStateAction<IInsuredAsset[]>>;
  filterQuery: string;
  setFilterQuery: Dispatch<SetStateAction<string>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  selectedDateRange: Range;
  setDateRange: Dispatch<SetStateAction<Range>>;
  networkCompanyOption: IDropdownOption<any>[] | null;
  setNetworkCompanyOption: Dispatch<
    SetStateAction<IDropdownOption<any>[] | null>
  >;
  initialOption: IDropdownOption<any> | undefined;
  setInitialOption: Dispatch<
    SetStateAction<IDropdownOption<any> | undefined>
  >;
  statusOption: IDropdownOption<any> | undefined;
  setStatusOption: Dispatch<
    SetStateAction<IDropdownOption<any> | undefined>
  >;
}

export const InsuranceContext = createContext<IInsuranceContextState | undefined>(
  {} as IInsuranceContextState
);

export const InsuranceContextProvider = InsuranceContext.Provider;
export const useInsuranceAssetContext = () => useContext(InsuranceContext);
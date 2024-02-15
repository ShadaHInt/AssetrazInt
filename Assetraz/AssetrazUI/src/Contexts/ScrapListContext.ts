import { Dispatch, SetStateAction, createContext, useContext } from "react";
import { IDropdownOption } from "@fluentui/react";
import { NetworkCompany } from "../types/NetworkCompany";
import { ScrapList } from "../types/ScrapList";
import { Range } from "react-date-range";

export interface ScrapContextState {
  scrapAssets: ScrapList[] | undefined;
  isLoading: boolean;
  errorOccured: boolean;
  setScrapAssets: Dispatch<SetStateAction<ScrapList[] | undefined>>;
  refresh: () => void;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  filteredData: ScrapList[] | undefined;
  selectedCompany: string | undefined;
  filterQuery: string;
  selectedDateRange: Range;
  networkCompanies: IDropdownOption<NetworkCompany>[] | any;
  initialOption: IDropdownOption<any> | undefined;
  setFilteredData: Dispatch<SetStateAction<ScrapList[] | undefined>>;
  setSelectedCompany: Dispatch<SetStateAction<string | undefined>>;
  setFilterQuery: Dispatch<SetStateAction<string>>;
  setDateRange: Dispatch<SetStateAction<Range>>;
  setNetworkCompanies: Dispatch<SetStateAction<IDropdownOption<NetworkCompany>[] | any>
  >;
  setInitialOption: Dispatch<SetStateAction<IDropdownOption<any> | undefined>>;
}

export const ScrapListContext = createContext<ScrapContextState | undefined>(
  {} as ScrapContextState
);

export const ScrapListContextProvider = ScrapListContext.Provider;
export const useScrapListContext = () => useContext(ScrapListContext);

import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { IDropdownOption } from "@fluentui/react";
import { IProcurements } from "../types/Procurement";
import { NetworkCompany } from "../types/NetworkCompany";

export interface IProcurementContext {
  procurementData : IProcurements[] | undefined,
  setData: Dispatch<SetStateAction<IProcurements[] | undefined>>,
    filterdData : IProcurements[] | null,
    setFilteredData: Dispatch<SetStateAction<IProcurements[]>>,
    networkCompanies :IDropdownOption<NetworkCompany>[] | null ,
    selectedItem:string | undefined,
    setSelectedItem:Dispatch<SetStateAction<string| undefined>>,
    initialOption: IDropdownOption<any> | undefined;
    setInitialOption: Dispatch<
        SetStateAction<IDropdownOption<any> | undefined>
    >;
    selectedCompany:string | undefined;
    setSelectedCompany:Dispatch<SetStateAction<string| undefined>>;
    filterQuery: string;
    setFilterQuery: Dispatch<SetStateAction<string> >;
}

export const ProcurementContext = createContext<IProcurementContext | undefined>(
    {} as IProcurementContext
);

export const ProcurementContextProvider = ProcurementContext.Provider;
export const useProcurementFilterContext = () => useContext(ProcurementContext);

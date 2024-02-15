import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { IDropdownOption } from "@fluentui/react";
import { IOtherSourceInventory } from "../types/OtherSourceInventory";

export interface IFilterContext {
    otherSourceData : IOtherSourceInventory[] | null,
    setOtherSourceData: Dispatch<SetStateAction<IOtherSourceInventory[]>>,
    filterdData : IOtherSourceInventory[] | null,
    setFilteredData: Dispatch<SetStateAction<IOtherSourceInventory[]>>,
    networkCompanyOption :IDropdownOption<any>[] | null ,
    setNetworkCompanyOption : Dispatch<SetStateAction<IDropdownOption<any>[] | null>>,
    initialOption: IDropdownOption<any> | undefined;
    setInitialOption: Dispatch<
        SetStateAction<IDropdownOption<any> | undefined>
    >;
    statusOption: IDropdownOption<any> | undefined;
    setStatusOption: Dispatch<SetStateAction<IDropdownOption<any> | undefined>>;
    filterQuery: string;
    setFilterQuery: Dispatch<SetStateAction<string>>;
}

export const FilterContext = createContext<IFilterContext | undefined>(
    {} as IFilterContext
);

export const FilterContextProvider = FilterContext.Provider;
// eslint-disable-next-line react-hooks/rules-of-hooks
export const useFilterContext = () => useContext(FilterContext);

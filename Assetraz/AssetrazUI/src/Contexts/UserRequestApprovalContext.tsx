import { IDropdownOption } from "@fluentui/react";
import { Dispatch, SetStateAction, createContext, useContext } from "react";

import { NetworkCompany } from "../types/NetworkCompany";
import { UserRequest } from "../pages/Approvals/UserRequestTypes";

export interface IURAContext {
    data: UserRequest[];
    setData: Dispatch<SetStateAction<UserRequest[]>>;
    filteredData: UserRequest[];
    setFilteredData: Dispatch<SetStateAction<UserRequest[]>>;
    filterQuery: string;
    setFilterQuery: Dispatch<SetStateAction<string>>;
    isLoading: boolean;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
    selectedNetworkCompany: IDropdownOption<NetworkCompany>;
    setSelectedNetworkCompany: Dispatch<
        SetStateAction<IDropdownOption<NetworkCompany>>
    >;
    selectedStatus: string;
    setSelectedStatus: Dispatch<SetStateAction<string>>;
    networkCompanyOptions: IDropdownOption<NetworkCompany>[] | null;
    getUserRequests: () => Promise<void>;
}

export const URAContext = createContext<IURAContext | undefined>(
    {} as IURAContext
);

export const URApprovalContextProvider = URAContext.Provider;
export const useURAContext = () => useContext(URAContext);

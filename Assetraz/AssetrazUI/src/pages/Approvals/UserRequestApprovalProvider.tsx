import { useCallback, useEffect, useState } from "react";

import { IDropdownOption } from "@fluentui/react";

import { GetAllNetworkCompanies } from "../../services/networkCompanyService";
import { getRequestsBySupervisor } from "../../services/requestService";
import { URApprovalContextProvider } from "../../Contexts/UserRequestApprovalContext";

import UserRequests from "./UserRequests";

import { NetworkCompany } from "../../types/NetworkCompany";
import { STATUS_OPTIONS } from "./UserRequestApprovalConstants";
import { DROPDOWN_INITIALOPTION } from "../Inventory/OtherSourceInventory/OtherSourceConstants";
import { UserRequest } from "./UserRequestTypes";

export const UserRequestApprovalProvider = () => {
    const [data, setData] = useState<UserRequest[]>([]);
    const [filteredData, setFilteredData] = useState<UserRequest[]>([]);
    const [filterQuery, setFilterQuery] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [networkCompanyOptions, setNetworkCompanyOptions] = useState<
        IDropdownOption<NetworkCompany>[]
    >([]);
    const [selectedNetworkCompany, setSelectedNetworkCompany] = useState<
        IDropdownOption<NetworkCompany> | any
    >();
    const [selectedStatus, setSelectedStatus] = useState<string>(
        STATUS_OPTIONS.Submitted
    );

    useEffect(() => {
        let filteredData = data.filter(
            (i) =>
                i.purchaseRequestNumber
                    .toLowerCase()
                    .indexOf(filterQuery.toLowerCase()) > -1 ||
                i.associateName
                    .toLowerCase()
                    .indexOf(filterQuery.toLocaleLowerCase()) > -1 ||
                i.approverName
                    .toLowerCase()
                    .indexOf(filterQuery.toLowerCase()) > -1 ||
                i.priority.toLowerCase().indexOf(filterQuery.toLowerCase()) >
                    -1 ||
                i.categoryName
                    .toLowerCase()
                    .indexOf(filterQuery.toLowerCase()) > -1
        );

        filteredData =
            selectedNetworkCompany?.key !== DROPDOWN_INITIALOPTION.key
                ? filteredData.filter(
                      (i) => i.networkCompanyId === selectedNetworkCompany?.key
                  )
                : filteredData;

        if (selectedStatus) {
            filteredData =
                selectedStatus !== STATUS_OPTIONS.All
                    ? filteredData.filter((i) => i.status === selectedStatus)
                    : filteredData;
        }

        setFilteredData(filteredData);
    }, [data, filterQuery, selectedNetworkCompany?.key, selectedStatus]);

    const GetNetworkCompanies = useCallback(async () => {
        try {
            let networkCompanies = await GetAllNetworkCompanies();
            networkCompanies.unshift(DROPDOWN_INITIALOPTION);
            setNetworkCompanyOptions(networkCompanies);
            const initialOption = networkCompanies.find(
                (i: NetworkCompany) => i.isPrimary === true
            );
            setSelectedNetworkCompany(initialOption ?? DROPDOWN_INITIALOPTION);
        } catch (err: any) {
            setErrorMessage(err);
        }
    }, []);

    useEffect(() => {
        GetNetworkCompanies();
    }, [GetNetworkCompanies]);

    const getUserRequests = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await getRequestsBySupervisor();
            setData(res);
        } catch (err: any) {
            setErrorMessage(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        getUserRequests();
    }, [getUserRequests]);

    const contextValue = {
        data,
        setData,
        filteredData,
        setFilteredData,
        filterQuery,
        setFilterQuery,
        networkCompanyOptions,
        selectedNetworkCompany,
        setSelectedNetworkCompany,
        isLoading,
        setIsLoading,
        setSelectedStatus,
        selectedStatus,
        getUserRequests,
    };

    return (
        <URApprovalContextProvider value={contextValue}>
            <UserRequests
                errorMessage={errorMessage}
                setErrorMessage={setErrorMessage}
            />
        </URApprovalContextProvider>
    );
};

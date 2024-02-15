import { useCallback, useEffect, useState } from "react";

import { IDropdownOption } from "@fluentui/react";

import { GetAllNetworkCompanies } from "../../../services/networkCompanyService";
import { approvedUserRequests } from "../../../services/requestService";
import { UserRequestContextProvider } from "../../../Contexts/UserRequestContext";

import UserRequestsPage from "./UserRequestsPage";

import { APPROVED_OPTIONS } from "./UserRequestConstants";
import { DROPDOWN_INITIALOPTION } from "../../Inventory/OtherSourceInventory/OtherSourceConstants";
import IPurchaseRequest from "../../../types/PurchaseRequest";
import { NetworkCompany } from "../../../types/NetworkCompany";

export const UserRequestProvider = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [data, setData] = useState<IPurchaseRequest[]>([]);
    const [filteredData, setFilteredData] = useState<IPurchaseRequest[]>([]);
    const [filterQuery, setFilterQuery] = useState<string>("");

    const [networkCompanyOptions, setNetworkCompanyOptions] = useState<
        IDropdownOption<any>[] | null
    >([]);

    const [initialOption, setInitialOption] = useState<
        IDropdownOption<any> | undefined
    >();

    const [selectedStatus, setSelectedStatus] = useState<string>(
        APPROVED_OPTIONS.Approved
    );

    useEffect(() => {
        let filteredData = data?.filter(
            (d: IPurchaseRequest) =>
                d.purchaseRequestNumber
                    ?.toLowerCase()
                    .indexOf(filterQuery.toLowerCase()) > -1 ||
                d.priority?.toLowerCase().indexOf(filterQuery.toLowerCase()) >
                    -1 ||
                d.categoryName
                    ?.toLowerCase()
                    .indexOf(filterQuery.toLowerCase()) > -1 ||
                d.associateName
                    ?.toLowerCase()
                    .indexOf(filterQuery.toLowerCase()) > -1 ||
                d.approverName
                    ?.toLowerCase()
                    .indexOf(filterQuery.toLowerCase()) > -1
        );

        filteredData =
            initialOption?.key !== DROPDOWN_INITIALOPTION.key
                ? filteredData.filter(
                      (i) => i?.networkCompanyId === initialOption?.key
                  )
                : filteredData;

        if (selectedStatus) {
            filteredData =
                selectedStatus === APPROVED_OPTIONS.All
                    ? filteredData
                    : filteredData.filter(
                          (i: IPurchaseRequest) => i.status === selectedStatus
                      );
        }
        setFilteredData(filteredData);
    }, [data, filterQuery, initialOption?.key, selectedStatus]);

    const GetNetworkCompanies = useCallback(async () => {
        try {
            const networkCompanies = await GetAllNetworkCompanies();
            networkCompanies.unshift(DROPDOWN_INITIALOPTION);
            setNetworkCompanyOptions(networkCompanies);
            const initialOption = networkCompanies.find(
                (element: NetworkCompany) => element.isPrimary === true
            );

            setInitialOption(
                initialOption ??
                    networkCompanies.find((element: any) =>
                        element.text
                            .toLowerCase()
                            .includes(DROPDOWN_INITIALOPTION.key.toLowerCase())
                    )
            );
        } catch (err: any) {
            setErrorMessage(err);
        }
    }, []);

    const getApprovedUserRequests = useCallback(async () => {
        setIsLoading(true);
        try {
            let response = await approvedUserRequests();
            if (response) {
                setData(response);
            }
        } catch (err: any) {
            setErrorMessage(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        getApprovedUserRequests();
    }, [getApprovedUserRequests]);

    useEffect(() => {
        GetNetworkCompanies();
    }, [GetNetworkCompanies]);

    const contextValue = {
        data,
        setData,
        filteredData,
        setFilteredData,
        filterQuery,
        setFilterQuery,
        isLoading,
        setIsLoading,
        initialOption,
        selectedStatus,
        setSelectedStatus,
        networkCompanyOptions,
        setInitialOption,
        setNetworkCompanyOptions,
        getApprovedUserRequests,
    };
    return (
        <UserRequestContextProvider value={contextValue}>
            <UserRequestsPage
                errorMessage={errorMessage}
                setErrorMessage={setErrorMessage}
                isLoading={isLoading}
            />
        </UserRequestContextProvider>
    );
};

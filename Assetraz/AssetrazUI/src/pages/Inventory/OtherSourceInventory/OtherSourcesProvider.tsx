import React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { IDropdownOption } from "@fluentui/react";

import {
    FilterContextProvider,
    IFilterContext,
} from "../../../Contexts/OtherSourceFilterContext";

import OtherSourceInventories from "./OtherSourceInventories";

import {
    DROPDOWN_INITIALOPTION,
    dropdownOptions,
} from "./OtherSourceConstants";

import { IOtherSourceInventory } from "../../../types/OtherSourceInventory";

import { getOtherSourcesInventory } from "../../../services/assetService";
import { GetAllNetworkCompanies } from "../../../services/networkCompanyService";

import { NetworkCompany } from "../../../types/NetworkCompany";

export const OtherSourcesProvider: React.FC = () => {
    const [otherSourceData, setOtherSourceData] = useState<
        IOtherSourceInventory[]
    >([]);

    const [filterdData, setFilteredData] = useState<IOtherSourceInventory[]>(
        []
    );

    const [networkCompanyOption, setNetworkCompanyOption] = useState<
        IDropdownOption<any>[] | null
    >([]);

    const [initialOption, setInitialOption] = useState<
        IDropdownOption<any> | undefined
    >();

    const [statusOption, setStatusOption] = useState<
        IDropdownOption<any> | undefined
    >(dropdownOptions.find((option) => option.key === "false"));
    const [filterQuery, setFilterQuery] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const getNetworkCompaniesDetails = useCallback(async () => {
        try {
            const networkCompanies = await GetAllNetworkCompanies();
            networkCompanies.unshift(DROPDOWN_INITIALOPTION);
            setNetworkCompanyOption(networkCompanies);
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
        } catch (err) {
            setNetworkCompanyOption(null);
        }
    }, []);

    const getData = useCallback(async () => {
        setIsLoading(true);
        try {
            const otherSourcesInventory = await getOtherSourcesInventory();
            setOtherSourceData(otherSourcesInventory);
        } catch (error) {
            setOtherSourceData([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const refetchWithoutLoading = useCallback(async () => {
        try {
            const otherSourcesInventory = await getOtherSourcesInventory();
            setOtherSourceData(otherSourcesInventory);
        } catch (error) {
            setOtherSourceData([]);
        }
    }, []);

    useEffect(() => {
        getData();
        getNetworkCompaniesDetails();
    }, [getData, getNetworkCompaniesDetails]);

    const isCategoryMatching = (
        category: string[],
        searchKeyWord: string
    ): boolean => {
        const filteredArray = category.filter((el) =>
            el.toLowerCase().includes(searchKeyWord.toLowerCase())
        );

        return filteredArray.length > 0;
    };

    const filteredData = useMemo(() => {
        return otherSourceData
            ?.filter((i) => {
                const lowerCaseFilterQuery = filterQuery?.toLowerCase();
                const lowerCaseSourceName = i.sourceName?.toLowerCase();
                const lowerCaseDocumentNumber =
                    i.documentNumber?.toLowerCase() ?? "";

                return (
                    lowerCaseSourceName?.includes(lowerCaseFilterQuery) ||
                    lowerCaseDocumentNumber.includes(lowerCaseFilterQuery) ||
                    isCategoryMatching(i.categoryList, filterQuery)
                );
            })
            .filter((i) => {
                const isMatchingInitialOption =
                    initialOption?.key === DROPDOWN_INITIALOPTION.key ||
                    i.networkCompanyName === initialOption?.text;

                const isMatchingStatusOption =
                    statusOption?.key === "all" ||
                    (statusOption?.key === "true"
                        ? i.assetStatus !== ""
                        : i.assetStatus === "");

                return isMatchingInitialOption && isMatchingStatusOption;
            });
    }, [filterQuery, otherSourceData, initialOption, statusOption]);

    useEffect(() => {
        setFilteredData(filteredData);
    }, [filteredData, setFilteredData]);

    const contextValue: IFilterContext = {
        filterdData,
        setFilteredData,
        otherSourceData,
        setOtherSourceData,
        networkCompanyOption,
        setNetworkCompanyOption,
        initialOption,
        setInitialOption,
        statusOption,
        setStatusOption,
        filterQuery,
        setFilterQuery,
    };
    return (
        <FilterContextProvider value={contextValue}>
            <OtherSourceInventories
                isLoading={isLoading}
                getData={getData}
                refetchWithoutLoading={refetchWithoutLoading}
            />
        </FilterContextProvider>
    );
};

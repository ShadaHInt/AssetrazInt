import { useCallback, useEffect, useState } from "react";
import { Range } from "react-date-range";
import { IDropdownOption } from "@fluentui/react";

import { IInsuredAsset } from "../../types/InsuredAsset";
import { NetworkCompany } from "../../types/NetworkCompany";

import { GetInsuredAssets } from "../../services/insuranceService";
import { GetAllNetworkCompanies } from "../../services/networkCompanyService";

import { DROPDOWN_INITIALOPTION } from "./OtherSourceInventory/OtherSourceConstants";
import {
    InsuredAssetStatus,
    noneOption,
} from "../../constants/InsuredAssetStatus";

import {
    IInsuranceContextState,
    InsuranceContextProvider,
} from "../../Contexts/InsuranceContext";

import InsuredAssetsPage from "./InsuredAssetsPage";
import { convertUTCDateToLocalDate } from "../../Other/DateFormat";

export const InsuredAssetsProvider = () => {
    const [insuredAssets, setInsuredAssets] = useState<IInsuredAsset[]>([]);
    const [filteredData, setFiltered] = useState<IInsuredAsset[]>([]);
    const [filterQuery, setFilterQuery] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    let today = new Date();
    let next30Days = new Date();
    next30Days.setDate(today.getDate() + 30);

    let DATE_RANGE = {
        startDate: undefined,
        endDate: undefined,
        key: "selection",
    };
    const [selectedDateRange, setDateRange] = useState<Range>(DATE_RANGE);

    const [networkCompanyOption, setNetworkCompanyOption] = useState<
        IDropdownOption<any>[] | null
    >([]);

    const [initialOption, setInitialOption] = useState<
        IDropdownOption<any> | undefined
    >();

    const [statusOption, setStatusOption] = useState<
        IDropdownOption<any> | undefined
    >(noneOption);

    const getNetworkCompaniesDetails = useCallback(async () => {
        try {
            const networkCompanies = await GetAllNetworkCompanies();
            networkCompanies.push(DROPDOWN_INITIALOPTION);
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
            const insuredAssets = await GetInsuredAssets();
            setInsuredAssets(insuredAssets);
        } catch (error) {
            setInsuredAssets([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        getData();
        getNetworkCompaniesDetails();
    }, [getData, getNetworkCompaniesDetails]);

    useEffect(() => {
        let filteredData = insuredAssets.filter(
            (i: IInsuredAsset) =>
                i.categoryName
                    ?.toLowerCase()
                    .indexOf(filterQuery?.toLowerCase()) > -1 ||
                i.serialNumber
                    ?.toLowerCase()
                    .indexOf(filterQuery?.toLowerCase()) > -1 ||
                (i.purchaseOrderNumber &&
                    i.purchaseOrderNumber
                        .toLowerCase()
                        .indexOf(filterQuery?.toLowerCase()) > -1) ||
                (i.invoiceNumber &&
                    i.invoiceNumber
                        .toLowerCase()
                        .indexOf(filterQuery?.toLowerCase()) > -1)
        );

        //status filter
        filteredData =
            statusOption?.key === InsuredAssetStatus.None
                ? filteredData.filter((i) => i.status === "Available")
                : filteredData.filter((i) => i.status === statusOption?.key);

        //network company filter
        filteredData =
            initialOption?.key !== DROPDOWN_INITIALOPTION.key
                ? filteredData.filter(
                      (i) =>
                          i.networkCompanyName?.toLowerCase() ===
                          initialOption?.text.toLowerCase()
                  )
                : filteredData;

        //date range filter
        if (
            selectedDateRange.startDate !== undefined &&
            selectedDateRange.endDate !== undefined
        ) {
            filteredData = filteredData.filter((item) => {
                const warrantyDate =
                    item.warrentyDate &&
                    convertUTCDateToLocalDate(new Date(item.warrentyDate));
                const endDate = new Date(selectedDateRange.endDate!);
                endDate.setDate(endDate.getDate());

                return (
                    warrantyDate >= selectedDateRange.startDate! &&
                    warrantyDate <= endDate
                );
            });
        }

        setFiltered(filteredData);
    }, [
        filterQuery,
        initialOption?.key,
        initialOption?.text,
        insuredAssets,
        selectedDateRange.endDate,
        selectedDateRange.startDate,
        statusOption?.key,
    ]);

    const contextValues: IInsuranceContextState = {
        insuredAssets,
        setInsuredAssets,
        filterQuery,
        setFilterQuery,
        isLoading,
        setIsLoading,
        selectedDateRange,
        setDateRange,
        networkCompanyOption,
        setNetworkCompanyOption,
        initialOption,
        setInitialOption,
        statusOption,
        setStatusOption,
        filteredData,
        setFiltered,
    };
    return (
        <InsuranceContextProvider value={contextValues}>
            <InsuredAssetsPage getData={getData} />
        </InsuranceContextProvider>
    );
};

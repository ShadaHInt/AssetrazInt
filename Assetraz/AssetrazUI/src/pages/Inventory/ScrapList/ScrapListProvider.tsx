import { useCallback, useEffect, useState } from "react";
import { IDropdownOption } from "@fluentui/react";
import { Range } from "react-date-range";

import { ScrapList } from "../../../types/ScrapList";
import { NetworkCompany } from "../../../types/NetworkCompany";
import { GetScrapList } from "../../../services/assetService";
import { GetAllNetworkCompanies } from "../../../services/networkCompanyService";
import useService from "../../../Hooks/useService";
import { DROPDOWN_INITIALOPTION } from "../OtherSourceInventory/OtherSourceConstants";
import {
    ScrapContextState,
    ScrapListContextProvider,
} from "../../../Contexts/ScrapListContext";

import ScrapListRegisterPage from "./ScrapListRegisterPage";
import { convertUTCDateToLocalDate } from "../../../Other/DateFormat";

export const ScrapListProvider = () => {
    const {
        data: scrapAssets,
        isLoading,
        errorOccured,
        setData: setScrapAssets,
        refresh,
        setIsLoading,
    } = useService<ScrapList>(GetScrapList);

    const [filteredData, setFilteredData] = useState<ScrapList[] | undefined>(
        []
    );
    const [selectedCompany, setSelectedCompany] = useState<string>();
    const [filterQuery, setFilterQuery] = useState<string>("");

    let today = new Date();
    let past180Days = new Date();
    past180Days.setDate(today.getDate() - 180);

    let DATE_RANGE = {
        startDate: past180Days,
        endDate: today,
        key: "selection",
    };
    const [selectedDateRange, setDateRange] = useState<Range>(DATE_RANGE);

    const [networkCompanies, setNetworkCompanies] = useState<
        IDropdownOption<NetworkCompany>[] | any
    >([]);
    const [initialOption, setInitialOption] = useState<
        IDropdownOption<any> | undefined
    >();

    const getNetworkCompaies = useCallback(async () => {
        try {
            const networkCompanies = await GetAllNetworkCompanies();
            networkCompanies.unshift(DROPDOWN_INITIALOPTION);
            setNetworkCompanies(networkCompanies);
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
        } catch (error) {
            setNetworkCompanies([]);
        }
    }, []);

    useEffect(() => {
        getNetworkCompaies();
    }, [getNetworkCompaies]);

    useEffect(() => {
        let filteredData =
            scrapAssets &&
            scrapAssets.filter(
                (i) =>
                    (i.categoryName &&
                        i.categoryName
                            .toLowerCase()
                            .indexOf(filterQuery.toLowerCase()) > -1) ||
                    (i.manufacturerName &&
                        i.manufacturerName
                            .toLowerCase()
                            .indexOf(filterQuery.toLowerCase()) > -1) ||
                    (i.markedBy &&
                        i.markedBy
                            .toLowerCase()
                            .indexOf(filterQuery.toLowerCase()) > -1) ||
                    (i.assetTagNumber &&
                        i.assetTagNumber
                            .toLowerCase()
                            .indexOf(filterQuery.toLowerCase()) > -1)
            );

        //network company filter
        filteredData =
            filteredData && initialOption?.text !== DROPDOWN_INITIALOPTION.key
                ? filteredData.filter(
                      (i) => i.networkCompanyName === initialOption?.text
                  )
                : filteredData;

        //date range filter
        filteredData = filteredData?.filter((item) => {
            const scrappedDate = convertUTCDateToLocalDate(item.scrappedDate);

            const endDate = new Date(selectedDateRange.endDate!);
            endDate.setDate(endDate.getDate());
            return (
                selectedDateRange.startDate &&
                endDate &&
                scrappedDate >= selectedDateRange.startDate &&
                scrappedDate <= endDate
            );
        });

        setFilteredData(filteredData);
    }, [
        filterQuery,
        scrapAssets,
        selectedCompany,
        selectedDateRange.endDate,
        selectedDateRange.startDate,
        initialOption?.text,
    ]);

    const initialScrapContextState: ScrapContextState = {
        scrapAssets,
        isLoading,
        errorOccured,
        setScrapAssets,
        refresh,
        setIsLoading,
        filteredData,
        selectedCompany,
        filterQuery,
        selectedDateRange,
        networkCompanies,
        initialOption,
        setFilteredData,
        setSelectedCompany,
        setFilterQuery,
        setDateRange,
        setNetworkCompanies,
        setInitialOption,
    };

    return (
        <ScrapListContextProvider value={initialScrapContextState}>
            <ScrapListRegisterPage />
        </ScrapListContextProvider>
    );
};

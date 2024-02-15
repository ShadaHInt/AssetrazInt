import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Range } from "react-date-range";
import { IDropdownOption } from "@fluentui/react";

import IAsset from "../../types/Asset";
import { IDocument } from "./AssetList";
import { convertUTCDateToLocalDate } from "../../Other/DateFormat";
import getAssets from "../../services/assetService";
import { DROPDOWN_INITIALOPTION } from "../Inventory/OtherSourceInventory/OtherSourceConstants";
import { GetAllNetworkCompanies } from "../../services/networkCompanyService";
import { NetworkCompany } from "../../types/NetworkCompany";
import {
    IIssuableAssetContext,
    IssuableContextProvider,
} from "../../Contexts/IssuableAssetContext";

import IssueReturnPage from "../Inventory/IssueReturnPage";

export const IssuableAssetProvider = () => {
    const options = React.useMemo(
        () => ({ All: "All", Available: "Available", Issued: "Issued" }),
        []
    );
    const location = useLocation();
    const filteredCategory = location?.state?.categoryName;
    const [assets, setAssets] = useState<IAsset[] | null>();
    const [allItems, setAllItems] = useState<IDocument[] | undefined>([]);
    const [filterValue, setFilterValue] = useState<string | null>(null);
    const [filtered, setFiltered] = useState<IDocument[] | undefined>([]);
    const [selectedItem, setSelectedItem] = React.useState<string>(options.All);
    const [selectedInventoryId, setSelectedInventoryId] = useState<
        string | undefined
    >();
    const [networkCompanyOption, setNetworkCompanyOption] = useState<
        IDropdownOption<any>[] | null
    >([]);

    const [initialOption, setInitialOption] = useState<
        IDropdownOption<any> | undefined
    >();

    let DATE_RANGE = {
        startDate: undefined,
        endDate: undefined,
        key: "selection",
    };

    const [selectedDateRange, setDateRange] = useState<Range>(DATE_RANGE);
    const [selectedIssuedDateRange, setSelectedIssuedDate] =
        useState<Range>(DATE_RANGE);

    const setAssetsAPi = () => {
        getAssets()
            .then((response) => {
                setAssets(response);
            })
            .catch((err) => setAssets(null));
    };

    const getData = React.useCallback(async () => {
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
        } catch (error) {
            setNetworkCompanyOption(null);
        }
    }, []);

    useEffect(() => {
        var filteredList = assets?.map(
            (asset) =>
                ({
                    inventoryId: asset.inventoryId,
                    categoryName: asset.categoryName,
                    manufacturerName: asset.manufacturerName,
                    assetStatus: asset.assetStatus,
                    key: asset.inventoryId,
                    name: asset.modelNumber,
                    modelNumber: asset.modelNumber,
                    serialNumber: asset.serialNumber,
                    assetTagNumber: asset.assetTagNumber,
                    networkCompanyName: asset.networkCompanyName,
                    issuedBy: asset.issuedBy,
                    warrentyDate:
                        asset.warrentyDate &&
                        convertUTCDateToLocalDate(
                            new Date(asset.warrentyDate)
                        ).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        }),
                    emailId: asset.issuedTo,
                    issuedDate:
                        asset.issuedDate &&
                        convertUTCDateToLocalDate(
                            new Date(asset.issuedDate)
                        ).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        }),
                } as unknown as IDocument)
        );
        setAllItems(filteredList);
        setFiltered(filteredList);
    }, [assets, options]);

    useEffect(() => {
        const applyFilters = () => {
            if (allItems?.length) {
                let filteredItems = allItems;

                // Apply status filter
                const status = selectedItem;
                if (status !== options.All) {
                    if (filterValue === null && filteredCategory) {
                        filteredItems = filteredItems.filter(
                            (i) =>
                                i.assetStatus === selectedItem &&
                                i.categoryName === filteredCategory
                        );
                    } else {
                        filteredItems = filteredItems.filter(
                            (i) => i.assetStatus === selectedItem
                        );
                    }
                }

                //warranty filter
                if (
                    selectedDateRange.startDate !== undefined &&
                    selectedDateRange.endDate !== undefined
                ) {
                    filteredItems = filteredItems.filter((item) => {
                        const warrantyDate = new Date(item.warrentyDate);
                        const endDate = new Date(selectedDateRange.endDate!);
                        endDate.setDate(endDate.getDate());
                        return (
                            selectedDateRange.startDate &&
                            endDate &&
                            warrantyDate >= selectedDateRange.startDate &&
                            warrantyDate >= selectedDateRange.startDate! &&
                            warrantyDate <= endDate
                        );
                    });
                }

                //issued filter
                if (
                    selectedIssuedDateRange.startDate !== undefined &&
                    selectedIssuedDateRange.endDate !== undefined
                ) {
                    filteredItems = filteredItems.filter((item) => {
                        const issuedDate = new Date(item.issuedDate);
                        const endDate = new Date(
                            selectedIssuedDateRange.endDate!
                        );

                        endDate.setDate(endDate.getDate());
                        return (
                            selectedIssuedDateRange.startDate &&
                            endDate &&
                            issuedDate >= selectedIssuedDateRange.startDate &&
                            issuedDate >= selectedIssuedDateRange.startDate! &&
                            issuedDate <= endDate
                        );
                    });
                }

                // Apply text filter
                if (filterValue) {
                    filteredItems = filteredItems.filter((i) => {
                        const categoryNameMatch = i.categoryName
                            .toLowerCase()
                            .includes(filterValue.toLowerCase());
                        const manufacturerNameMatch = i.manufacturerName
                            .toLowerCase()
                            .includes(filterValue.toLowerCase());
                        const modelNumberMatch =
                            i.modelNumber &&
                            i.modelNumber
                                .toLowerCase()
                                .includes(filterValue.toLowerCase());
                        const assetStatusMatch = i.assetStatus
                            .toLowerCase()
                            .includes(filterValue.toLowerCase());
                        const serialNumberMatch =
                            i.serialNumber &&
                            i.serialNumber
                                .toLowerCase()
                                .includes(filterValue.toLowerCase());
                        const assetTagNumberMatch =
                            i.assetTagNumber &&
                            i.assetTagNumber
                                .toLowerCase()
                                .includes(filterValue.toLowerCase());
                        const emailIdMatch =
                            i.emailId &&
                            i.emailId
                                .toLowerCase()
                                .includes(filterValue.toLowerCase());

                        return (
                            categoryNameMatch ||
                            manufacturerNameMatch ||
                            modelNumberMatch ||
                            assetStatusMatch ||
                            serialNumberMatch ||
                            assetTagNumberMatch ||
                            emailIdMatch
                        );
                    });
                }

                // Apply network company filter
                filteredItems =
                    initialOption?.key !== DROPDOWN_INITIALOPTION.key
                        ? filteredItems.filter(
                              (i) =>
                                  i?.networkCompanyName?.toLowerCase() ===
                                  initialOption?.text.toLowerCase()
                          )
                        : filteredItems;

                setFiltered(filteredItems);
            }
        };

        applyFilters();
    }, [
        allItems,
        selectedItem,
        options,
        filteredCategory,
        filterValue,
        selectedDateRange.startDate,
        selectedDateRange.endDate,
        selectedIssuedDateRange.startDate,
        selectedIssuedDateRange.endDate,
        initialOption,
    ]);

    useEffect(() => {
        getData();
    }, [getData]);

    useEffect(() => {
        setAssetsAPi();
    }, []);

    const contextValues: IIssuableAssetContext = {
        assets,
        allItems,
        filterValue,
        filtered,
        selectedItem,
        selectedInventoryId,
        networkCompanyOption,
        initialOption,
        selectedDateRange,
        selectedIssuedDateRange,
        setAssets,
        setAllItems,
        setFilterValue,
        setFiltered,
        setSelectedItem,
        setSelectedInventoryId,
        setNetworkCompanyOption,
        setInitialOption,
        setDateRange,
        setSelectedIssuedDate,
    };

    return (
        <IssuableContextProvider value={contextValues}>
            <IssueReturnPage
                setAssetsAPi={setAssetsAPi}
                filteredCategory={filteredCategory}
            />
        </IssuableContextProvider>
    );
};

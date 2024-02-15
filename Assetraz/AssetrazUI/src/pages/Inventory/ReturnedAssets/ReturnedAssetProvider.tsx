import React, { useCallback, useEffect, useState } from "react";
import { IDropdownOption } from "@fluentui/react";

import { RefurbishedAsset } from "../../../types/RefurbishedAsset";

import { getRefurbishedAssets } from "../../../services/assetService";
import { GetAllNetworkCompanies } from "../../../services/networkCompanyService";

import { DROPDOWN_INITIALOPTION } from "../OtherSourceInventory/OtherSourceConstants";
import {
    AssetReturnReasonFor,
    RefurbishementAssetStatusForKey,
    options,
} from "./ReturnedPageConstants";
import { AssetReturnReason } from "../../../constants/AssetReturnReason";
import { RefurbishmentStatus } from "../../../constants/RefurbishmentStatus";
import { convertUTCDateToLocalDate } from "../../../Other/DateFormat";

import {
    IReturnedContext,
    ReturnedContextProvider,
} from "../../../Contexts/ReturnedAssetContext";

import RefurbishedAssetsPage from "./RefurbishedAssetsPage";
import { NetworkCompany } from "../../../types/NetworkCompany";

export const ReturnedAssetProvider: React.FC = () => {
    const [allItems, setAllItems] = useState<RefurbishedAsset[]>([]);
    const [filtered, setFiltered] = useState<RefurbishedAsset[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | undefined>();
    const [selectedItem, setSelectedItem] = useState<string | undefined>(
        options["Not Started"]
    );
    const [refurbishedAssets, setRefurbishedAssets] = useState<
        RefurbishedAsset[] | null
    >();

    const [networkCompanyOptions, setNetworkCompanyOptions] = useState<
        IDropdownOption<any>[] | null
    >([]);

    const [initialOption, setInitialOption] = useState<
        IDropdownOption<any> | undefined
    >();

    useEffect(() => {
        setAssetsAPi();
        getNetworkCompaniesDetails();
    }, []);

    useEffect(() => {
        const filteredList = refurbishedAssets?.map((asset) => {
            const { warrentyDate, returnDate, refurbishedDate, ...rest } =
                asset;

            return {
                ...rest,
                status: getDisplayedRefurbishmentStatus(
                    asset.status as keyof RefurbishementAssetStatusForKey
                ),
                reason: getDisplayedStatus(
                    asset.reason as keyof AssetReturnReasonFor
                ),
                warrentyDate:
                    warrentyDate &&
                    convertUTCDateToLocalDate(
                        new Date(warrentyDate)
                    ).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    }),
                returnDate:
                    returnDate &&
                    new Date(returnDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    }),
                refurbishedDate:
                    refurbishedDate &&
                    new Date(refurbishedDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    }),
            } as RefurbishedAsset;
        });

        setAllItems(filteredList ?? []);
        setFiltered(filteredList ?? []);
    }, [refurbishedAssets]);

    function getDisplayedStatus(reason: keyof AssetReturnReasonFor) {
        return AssetReturnReason[reason];
    }

    function getDisplayedRefurbishmentStatus(
        status: keyof RefurbishementAssetStatusForKey
    ) {
        return RefurbishmentStatus[status];
    }

    const getNetworkCompaniesDetails = useCallback(async () => {
        try {
            let networkCompanies = await GetAllNetworkCompanies();
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
        } catch (err) {
            setNetworkCompanyOptions(null);
            setErrorMessage(err as string | undefined);
        }
    }, []);

    const setAssetsAPi = async () => {
        try {
            let response = await getRefurbishedAssets();
            if (response) {
                setRefurbishedAssets(response);
            } else {
                setRefurbishedAssets(null);
            }
        } catch (err: any) {
            setErrorMessage(err);
        }
    };

    const contextValue: IReturnedContext = {
        refurbishedAssets: refurbishedAssets,
        setRefurbishedAssets: setRefurbishedAssets,
        networkCompanyOptions: networkCompanyOptions,
        setNetworkCompanyOptions: setNetworkCompanyOptions,
        initialOption: initialOption,
        setInitialOption: setInitialOption,
        allItems: allItems,
        setAllItems: setAllItems,
        filtered: filtered,
        setFiltered: setFiltered,
        errorMessage: errorMessage,
        setErrorMessage: setErrorMessage,
        selectedItem: selectedItem,
        setSelectedItem: setSelectedItem,
    };

    return (
        <ReturnedContextProvider value={contextValue}>
            <RefurbishedAssetsPage setAssetsAPi={setAssetsAPi} />
        </ReturnedContextProvider>
    );
};

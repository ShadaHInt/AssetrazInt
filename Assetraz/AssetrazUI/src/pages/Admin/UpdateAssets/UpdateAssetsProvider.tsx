import { useCallback, useEffect, useState } from "react";
import { AssetDetails } from "../../../types/Asset";
import { IDropdownOption } from "@fluentui/react";
import { DROPDOWN_INITIALOPTION } from "../../Approvals/ITProcurementConstants";
import { NetworkCompany } from "../../../types/NetworkCompany";
import { GetAllNetworkCompanies } from "../../../services/networkCompanyService";
import { GetAllAssets } from "../../../services/assetService";
import { UpdateAssetContextProvider } from "../../../Contexts/UpdateAssetsContext";
import { UpdateAssetsDashboard } from "./UpdateAssetsDashboard";

export const UpdateAssetsProvider = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [assets, setAssets] = useState<AssetDetails[]>([]);
    const [filteredAssets, setFilteredAssets] = useState<AssetDetails[]>([]);
    const [filterQuery, setFilterQuery] = useState<string>("");

    const [networkCompanyOptions, setNetworkCompanyOptions] = useState<
        IDropdownOption<NetworkCompany>[] | null
    >([]);

    const [selectedNetworkCompany, setSelectedNetworkCompany] = useState<
        IDropdownOption<NetworkCompany> | undefined
    >();

    const GetNetworkCompanies = useCallback(async () => {
        try {
            const networkCompanies = await GetAllNetworkCompanies();
            networkCompanies.unshift(DROPDOWN_INITIALOPTION);
            setNetworkCompanyOptions(networkCompanies);
            const initialOption = networkCompanies.find(
                (element: NetworkCompany) => element.isPrimary === true
            );

            setSelectedNetworkCompany(initialOption ?? DROPDOWN_INITIALOPTION);
        } catch (err: any) {
            setErrorMessage(err);
        }
    }, []);

    const GetAllAssetDetails = useCallback(async () => {
        setIsLoading(true);
        try {
            const assetDetails: AssetDetails[] = await GetAllAssets();
            if (assetDetails) {
                setAssets(assetDetails);
            }
        } catch (err: any) {
            setErrorMessage(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        GetNetworkCompanies();
    }, [GetNetworkCompanies]);

    useEffect(() => {
        GetAllAssetDetails();
    }, [GetAllAssetDetails]);

    useEffect(() => {
        let filteredData = assets.filter(
            (i: AssetDetails) =>
                i.categoryName
                    .toLowerCase()
                    .indexOf(filterQuery.toLocaleLowerCase()) > -1 ||
                i.manufacturerName
                    .toLowerCase()
                    .indexOf(filterQuery.toLocaleLowerCase()) > -1 ||
                (i.serialNumber &&
                    i.serialNumber
                        .toLowerCase()
                        .indexOf(filterQuery.toLowerCase()) > -1) ||
                (i.modelNumber &&
                    i.modelNumber
                        .toLowerCase()
                        .indexOf(filterQuery.toLowerCase()) > -1) ||
                (i.assetTagNumber &&
                    i.assetTagNumber
                        .toLowerCase()
                        .indexOf(filterQuery.toLowerCase()) > -1)
        );

        filteredData =
            selectedNetworkCompany?.key !== DROPDOWN_INITIALOPTION.key
                ? filteredData.filter(
                      (i) => i?.networkCompanyId === selectedNetworkCompany?.key
                  )
                : filteredData;

        setFilteredAssets(filteredData);
    }, [assets, filterQuery, selectedNetworkCompany]);

    const contextValue = {
        assets,
        setAssets,
        filteredAssets,
        setFilteredAssets,
        filterQuery,
        setFilterQuery,
        errorMessage,
        setErrorMessage,
        isLoading,
        setIsLoading,
        selectedNetworkCompany,
        setSelectedNetworkCompany,
        networkCompanyOptions,
        setNetworkCompanyOptions,
        GetAllAssetDetails,
    };

    return (
        <UpdateAssetContextProvider value={contextValue}>
            <UpdateAssetsDashboard />
        </UpdateAssetContextProvider>
    );
};

import { useCallback, useEffect, useState } from "react";
import { IDropdownOption } from "@fluentui/react";

import { GetAllNetworkCompanies } from "../../../services/networkCompanyService";
import { PurchaseOrderList } from "../../../services/purchaseOrderServices";
import { NetworkCompany } from "../../../types/NetworkCompany";
import { PurchaseDetails } from "../../../types/PurchaseOrder";

import { POContextProvider } from "../../../Contexts/PurchaseOrderContext";
import PurchaseOrderDashBoard from "./PurchaseOrderDashboard";
import { DROPDOWN_INITIALOPTION } from "../../Inventory/OtherSourceInventory/OtherSourceConstants";
import { HANDOVER_OPTIONS, PO_OPTIONS } from "./PurchaseOrderConstants";

export const PurchaseOrderProvider = () => {
    const [errorMessage, setErrorMessage] = useState<string>();
    const [data, setData] = useState<PurchaseDetails[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [filterQuery, setFilterQuery] = useState<string>("");
    const [filteredData, setFilteredData] = useState<PurchaseDetails[]>([]);

    const [networkCompanyOptions, setNetworkCompanyOptions] = useState<
        IDropdownOption<any>[] | null
    >([]);

    const [initialOption, setInitialOption] = useState<
        IDropdownOption<any> | undefined
    >();

    const [selectedPOState, setSelectedPOState] = useState<string>(
        PO_OPTIONS.CreatePO
    );

    const [selectedHandedOverState, setSelectedHandedOverState] =
        useState<string>(HANDOVER_OPTIONS.All);

    useEffect(() => {
        let filteredData = data.filter(
            (i: PurchaseDetails) =>
                i.requestNumber
                    .toLowerCase()
                    .indexOf(filterQuery.toLowerCase()) > -1 ||
                i.approvedBy.toLowerCase().indexOf(filterQuery.toLowerCase()) >
                    -1 ||
                (i.purchaseOrderNumber &&
                    i.purchaseOrderNumber
                        .toLowerCase()
                        .indexOf(filterQuery.toLowerCase()) > -1) ||
                (i.invoiceNumber &&
                    i.invoiceNumber
                        .toLowerCase()
                        .indexOf(filterQuery.toLowerCase()) > -1)
        );

        filteredData =
            selectedPOState !== PO_OPTIONS.All
                ? filteredData.filter((i) => i.purchaseOrderNumber === null)
                : filteredData;

        filteredData =
            initialOption?.key !== DROPDOWN_INITIALOPTION.key
                ? filteredData.filter(
                      (i) =>
                          i?.networkCompanyName?.toLowerCase() ===
                          initialOption?.text.toLowerCase()
                  )
                : filteredData;

        if (selectedHandedOverState) {
            filteredData =
                selectedHandedOverState === HANDOVER_OPTIONS.All
                    ? filteredData
                    : selectedHandedOverState === HANDOVER_OPTIONS.Yes
                    ? filteredData.filter((i) => i.isHandedOver === true)
                    : filteredData.filter((i) => i.isHandedOver !== true);
        }

        setFilteredData(filteredData);
    }, [
        data,
        selectedPOState,
        initialOption?.key,
        initialOption?.text,
        selectedHandedOverState,
        filterQuery,
    ]);

    const getNetworkDetails = useCallback(async () => {
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
        } catch (err) {
            setErrorMessage(err as string | undefined);
        }
    }, []);

    const getPurchaseOrderList = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await PurchaseOrderList();
            if (result) {
                setData(result);
            }
        } catch (err: any) {
            setErrorMessage(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        getPurchaseOrderList();
        getNetworkDetails();
    }, [getPurchaseOrderList, getNetworkDetails]);

    const contextValue = {
        data,
        setData,
        filterQuery,
        setFilterQuery,
        filteredData,
        setFilteredData,
        networkCompanyOptions,
        setNetworkCompanyOptions,
        selectedPOState,
        setSelectedPOState,
        initialOption,
        setInitialOption,
        selectedHandedOverState,
        setSelectedHandedOverState,
        getPurchaseOrderList,
    };

    return (
        <POContextProvider value={contextValue}>
            <PurchaseOrderDashBoard
                errorMessage={errorMessage}
                isLoading={isLoading}
            />
        </POContextProvider>
    );
};

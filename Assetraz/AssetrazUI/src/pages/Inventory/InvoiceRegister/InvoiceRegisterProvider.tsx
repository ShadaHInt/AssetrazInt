import React, { useState, useEffect } from "react";
import {
    InvoiceRegisterContextType,
    InvoiceRegisterContextProvider,
} from "../../../Contexts/InvoiceRegisterContext";
import IStockReceiptDocument from "../../../types/StockReceiptDocument";
import { GetInvoicesHandedOver } from "../../../services/invoiceService";
import StockReceiptPage from "./StockReceiptPage";
import { useParams } from "react-router-dom";

const DROPDOWN_STATUS = "Not Taken to stock";
const DROPDOWN_OPTIONS = {
    All: "All",
    "Taken to stock": "Taken to stock",
    "Not Taken to stock": "Not Taken to stock",
};

export const InvoiceRegisterProvider: React.FC<{
    isAccountsAdmin: boolean;
}> = ({ children, isAccountsAdmin }) => {
    const params = useParams();
    const [invoices, setInvoices] = useState<IStockReceiptDocument[]>([]);
    const [filteredInvoices, setFilteredInvoices] = useState<
        IStockReceiptDocument[]
    >([]);
    const [selectedNetworkCompany, setSelectedNetworkCompany] =
        useState<string>("");
    const [selectedStatus, setSelectedStatus] = useState<string>(
        isAccountsAdmin ? DROPDOWN_OPTIONS["Taken to stock"] : DROPDOWN_STATUS
    );
    const [filterQuery, setFilterQuery] = useState<string>("");
    const [isDataPresent, setIsDataPresent] = useState<boolean>(false);

    useEffect(() => {
        if (params.id) {
            if (selectedStatus !== DROPDOWN_OPTIONS["Taken to stock"]) {
                setSelectedStatus(DROPDOWN_OPTIONS["Taken to stock"]);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            await GetInvoicesHandedOver()
                .then((res) => {
                    if (res.length > 0) {
                        setIsDataPresent(true);
                    } else {
                        setIsDataPresent(false);
                    }
                    return setInvoices(res);
                })
                .catch((err) => setInvoices([]));
        };

        fetchData();
    }, []);

    useEffect(() => {
        const filtered = invoices.filter((invoice) => {
            if (
                selectedNetworkCompany &&
                invoice.networkCompanyName !== selectedNetworkCompany &&
                selectedNetworkCompany !== "All Companies"
            ) {
                return false;
            }

            if (
                filterQuery &&
                !invoice.vendorName
                    .toLowerCase()
                    .includes(filterQuery.toLowerCase()) &&
                !invoice.invoiceNumber
                    .toLowerCase()
                    .includes(filterQuery.toLowerCase()) &&
                !invoice.purchaseOrderNumber
                    .toLowerCase()
                    .includes(filterQuery.toLowerCase())
            ) {
                return false;
            }

            return true;
        });

        const filterdBystatus =
            selectedStatus !== DROPDOWN_OPTIONS.All
                ? selectedStatus !== DROPDOWN_OPTIONS["Taken to stock"]
                    ? filtered.filter((i) => !i.status)
                    : filtered.filter((i) => i.status === selectedStatus)
                : filtered;

        setFilteredInvoices(filterdBystatus);
    }, [invoices, selectedNetworkCompany, selectedStatus, filterQuery]);

    const contextValue: InvoiceRegisterContextType = {
        invoices,
        filteredInvoices,
        selectedNetworkCompany,
        selectedStatus,
        filterQuery,
        setSelectedNetworkCompany,
        setSelectedStatus,
        setFilterQuery,
        setFilteredInvoices,
    };

    return (
        <InvoiceRegisterContextProvider value={contextValue}>
            <StockReceiptPage
                setInvoices={setInvoices}
                isDataPresent={isDataPresent}
                isAccountsAdmin={isAccountsAdmin}
                invoiceNumber={params.id}
            ></StockReceiptPage>
        </InvoiceRegisterContextProvider>
    );
};

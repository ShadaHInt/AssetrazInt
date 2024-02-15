import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { useBoolean } from "@fluentui/react-hooks";

//Fluent & other 3rd party components
import {
    DefaultButton,
    DirectionalHint,
    Dropdown,
    IColumn,
    IDropdownOption,
    IStackTokens,
    Link,
    Stack,
    StackItem,
    TooltipHost,
} from "@fluentui/react";

//Services
import { GetAllNetworkCompanies } from "../../../services/networkCompanyService";
import { useInvoiceRegisterContext } from "../../../Contexts/InvoiceRegisterContext";

//Components
import PageTemplate from "../../../components/common/PageTemplate";
import StyledDetailsList from "../../../components/common/StyledDetailsList";
import { sort } from "../../../components/common/StyledDetailsList";

import { Tooltip } from "../../../components/common/Tooltip";
import StyledSearchBar from "../../../components/common/StyledSearchBar";
import SearchTooltip from "../../../components/common/SearchTooltip";
import AddAssetsModal from "./AddAssetsModal";

//Helper functions
import { convertUTCDateToLocalDate } from "../../../Other/DateFormat";

//Types
import { NetworkCompany } from "../../../types/NetworkCompany";

//Styles
import IStockReceiptDocument from "../../../types/StockReceiptDocument";
import {
    dropdownStyles,
    hostStyles,
    calloutProps,
    infoButtonStyles,
    filterStyles,
} from "./StockReceipt.styles";
import { detailsListStyles } from "../../Admin/UserRequestsPage/UserRequestPage.styles";
import { INITIAL_NETWORK_COMPANY } from "../../Admin/ProcurementPage/ProcurementConstants";
import { GetInvoicesHandedOver } from "../../../services/invoiceService";

//Regex & const
const DROPDOWN_OPTIONS = {
    All: "All",
    "Taken to stock": "Taken to stock",
    "Not Taken to stock": "Not Taken to stock",
};

const DROPDOWN_ALL_COMPANIES = {
    key: "All Companies",
    text: "All Companies",
};

interface StockReceiptPageProps {
    setInvoices: React.Dispatch<React.SetStateAction<IStockReceiptDocument[]>>;
    isDataPresent: boolean;
    isAccountsAdmin: boolean;
    invoiceNumber?: string;
}

const StockReceiptPage: React.FC<StockReceiptPageProps> = ({
    setInvoices,
    isDataPresent,
    isAccountsAdmin,
    invoiceNumber,
}) => {
    const [invoiceId, setInvoiceId] = useState<string>();
    const [columns, setColumns] = useState<IColumn[]>();
    const [hasModalOpened, setHasModalOpened] = useState<boolean>(false);
    const [isPageLoading, { setTrue: setLoading, setFalse: stopLoading }] =
        useBoolean(false);
    const [operationSuccess, setOperationSuccess] = useState<string>();
    const classes = detailsListStyles();
    const [networkCompanies, setNetworkCompanies] = useState<
        IDropdownOption<NetworkCompany>[] | any
    >([]);
    const [initialOption, setInitialOption] = useState<
        IDropdownOption<any> | undefined
    >();

    const itemAlignmentsStackTokens: IStackTokens = {
        childrenGap: 15,
    };

    const {
        filteredInvoices,
        selectedStatus,
        setSelectedNetworkCompany,
        setSelectedStatus,
        setFilterQuery,
        setFilteredInvoices,
    } = useInvoiceRegisterContext();

    const getNetworkCompaniesDetails = useCallback(async () => {
        try {
            await GetAllNetworkCompanies().then((companies) => {
                const networkCompanies = companies;
                networkCompanies.unshift(DROPDOWN_ALL_COMPANIES);
                setNetworkCompanies(companies);
                let primaryCompany = companies.find(
                    (company: any) => company.isPrimary === true
                );
                primaryCompany
                    ? setSelectedNetworkCompany(primaryCompany.text)
                    : setSelectedNetworkCompany(INITIAL_NETWORK_COMPANY.text);

                setInitialOption(primaryCompany ?? INITIAL_NETWORK_COMPANY);
            });
        } catch (err) {
            setNetworkCompanies(null);
        }
    }, [setSelectedNetworkCompany]);

    const fetchData = useCallback(async () => {
        setLoading();
        await GetInvoicesHandedOver()
            .then((res) => {
                return setInvoices(res);
            })
            .catch((err) => setInvoices([]));
        stopLoading();
    }, [setInvoices, setLoading, stopLoading]);

    useEffect(() => {
        fetchData();
        getNetworkCompaniesDetails();
    }, [fetchData, getNetworkCompaniesDetails]);

    const _onColumnClick = useCallback(
        (event: React.MouseEvent<HTMLElement>, column: IColumn) => {
            setFilteredInvoices((prevInvoices: IStockReceiptDocument[]) => {
                if (!prevInvoices) return prevInvoices;

                const { newItems, newColumns } = sort(
                    prevInvoices,
                    column,
                    sortedColumn
                );
                setColumns(newColumns);
                return newItems;
            });
        },

        // eslint-disable-next-line react-hooks/exhaustive-deps
        [filteredInvoices]
    );

    useEffect(() => {
        if (invoiceNumber && !hasModalOpened) {
            setInvoiceId(invoiceNumber);
        }
    }, [filteredInvoices, hasModalOpened, invoiceNumber]);

    useEffect(() => {
        if (invoiceId !== undefined) {
            setHasModalOpened(true);
        }
    }, [invoiceId]);

    const _columns: IColumn[] = [
        {
            key: "purchaseOrderNumber",
            name: "PO Number",
            fieldName: "purchaseOrderNumber",
            minWidth: 100,
            isResizable: true,
            onColumnClick: _onColumnClick,
        },
        {
            key: "requestRaisedOn",
            name: "PO Date",
            fieldName: "requestRaisedOn",
            minWidth: 100,
            isResizable: true,
            onRender: (item: IStockReceiptDocument) =>
                new Date(item.requestRaisedOn).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                }),
            onColumnClick: _onColumnClick,
        },
        {
            key: "invoiceNumber",
            name: "Invoice Number",
            fieldName: "invoiceNumber",
            minWidth: 150,
            isResizable: true,
            onRender: (item: IStockReceiptDocument) => {
                return (
                    <Link
                        onClick={(e) => {
                            setInvoiceId(item?.invoiceId);
                        }}
                    >
                        {item?.invoiceNumber}
                    </Link>
                );
            },
            onColumnClick: _onColumnClick,
        },
        {
            key: "invoiceDate",
            name: "Invoice Date",
            fieldName: "invoiceDate",
            minWidth: 100,
            isResizable: true,
            onRender: (item: IStockReceiptDocument) =>
                convertUTCDateToLocalDate(
                    new Date(item.invoiceDate)
                ).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                }),
            onColumnClick: _onColumnClick,
        },
        {
            key: "updatedDate",
            name: "Stock Received On",
            fieldName: "updatedDate",
            minWidth: 150,
            isResizable: true,
            onRender: (item: IStockReceiptDocument) =>
                new Date(item.updatedDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                }),
            isSorted: true,
            isSortedDescending: true,
            onColumnClick: _onColumnClick,
        },
        {
            key: "vendorName",
            name: "Vendor",
            fieldName: "vendorName",
            minWidth: 100,
            isResizable: true,
        },
        {
            key: "categoryList",
            name: "Category",
            fieldName: "categoryList",
            minWidth: 100,
            isResizable: true,
            onRender: (item: IStockReceiptDocument) => {
                if (item?.categoryList?.length > 0) {
                    return (
                        <Tooltip content={item?.categoryList.join(",")}>
                            {item?.categoryList.join(",")}
                        </Tooltip>
                    );
                } else {
                    return item?.categoryList;
                }
            },
        },
        {
            key: "updatedBy",
            name: "Updated By",
            fieldName: "invoiceUploadedBy",
            minWidth: 150,
            isResizable: true,
        },
        {
            key: "status",
            name: "Status",
            fieldName: "status",
            minWidth: 100,
            isResizable: true,
        },
        {
            key: "networkCompanyName",
            name: "Network CompanyName",
            fieldName: "networkCompanyName",
            minWidth: 100,
            isResizable: true,
        },
    ];

    const sortedColumn = columns ?? _columns;

    const onChange = (
        event: React.FormEvent<HTMLDivElement>,
        item: IDropdownOption<any> | undefined
    ): void => {
        item && setSelectedStatus(item?.text as string);
    };
    return (
        <PageTemplate
            heading="Invoice Register"
            isLoading={isPageLoading}
            errorOccured={filteredInvoices === null}
            successMessageBar={operationSuccess}
            setSuccessMessageBar={setOperationSuccess}
        >
            {filteredInvoices && isDataPresent && (
                <Stack
                    className={classes.root}
                    horizontal
                    horizontalAlign="space-between"
                >
                    <StackItem styles={filterStyles}>
                        <Stack horizontal tokens={itemAlignmentsStackTokens}>
                            <StyledSearchBar onFilterChange={setFilterQuery} />
                            <TooltipHost
                                content={
                                    <SearchTooltip
                                        filterColumns={[
                                            "PO Number, Invoice Number, Vendor",
                                        ]}
                                    />
                                }
                                calloutProps={calloutProps}
                                styles={hostStyles}
                                directionalHint={DirectionalHint.rightCenter}
                            >
                                <DefaultButton
                                    aria-label={"more info"}
                                    styles={infoButtonStyles}
                                    iconProps={{ iconName: "Info" }}
                                />
                            </TooltipHost>
                        </Stack>
                    </StackItem>
                    <StackItem>
                        <Stack horizontal tokens={itemAlignmentsStackTokens}>
                            <StackItem>
                                <Dropdown
                                    placeholder="Select network company"
                                    label="Network Company"
                                    options={
                                        networkCompanies ? networkCompanies : []
                                    }
                                    onChange={(e, item) => {
                                        item &&
                                            setSelectedNetworkCompany(
                                                item?.text
                                            );
                                        setInitialOption(item);
                                    }}
                                    selectedKey={
                                        initialOption ? initialOption.key : null
                                    }
                                />
                            </StackItem>
                            <StackItem>
                                <Dropdown
                                    placeholder="Select status"
                                    label="Status"
                                    options={Object.keys(DROPDOWN_OPTIONS).map(
                                        (option) => ({
                                            key: option,
                                            text: option,
                                        })
                                    )}
                                    onChange={onChange}
                                    styles={dropdownStyles}
                                    selectedKey={Object.keys(
                                        DROPDOWN_OPTIONS
                                    ).find(
                                        (option) => option === selectedStatus
                                    )}
                                    disabled={isAccountsAdmin}
                                />
                            </StackItem>
                        </Stack>
                    </StackItem>
                </Stack>
            )}

            {filteredInvoices && (
                <StyledDetailsList
                    data={filteredInvoices}
                    columns={sortedColumn}
                    emptymessage="No invoice found"
                />
            )}

            {invoiceId && filteredInvoices && (
                <AddAssetsModal
                    invoiceId={invoiceId}
                    invoiceData={filteredInvoices.find(
                        (d) => d.invoiceId === invoiceId
                    )}
                    setInvoiceId={setInvoiceId}
                    onUpdate={(message: string) => {
                        setOperationSuccess(message);
                        fetchData();
                    }}
                />
            )}
        </PageTemplate>
    );
};

export default StockReceiptPage;

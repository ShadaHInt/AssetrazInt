import { useCallback, useEffect, useMemo, useState } from "react";
import React from "react";

import {
    DefaultButton,
    DirectionalHint,
    IColumn,
    IDropdownOption,
    Link,
    Stack,
    TooltipHost,
} from "@fluentui/react";
import { PrimaryButton } from "@fluentui/react";
import { useBoolean } from "@fluentui/react-hooks";

import { IProcurements } from "../../../types/Procurement";

import { Tooltip } from "../../../components/common/Tooltip";
import PageTemplate from "../../../components/common/PageTemplate";
import StyledDetailsList, {
    sort,
} from "../../../components/common/StyledDetailsList";
import StyledSearchBar from "../../../components/common/StyledSearchBar";
import FilterComponents, {
    IFilterPropsDashboard,
} from "../../../components/common/FilterComponents";
import {
    hostStyles,
    infoButtonStyles,
} from "../../../components/common/TooltipStyles";

import {
    IProcurementContext,
    useProcurementFilterContext,
} from "../../../Contexts/ProcurementProviderContext";

import { getProcurementStatus } from "../../../constants/ProcurementStatus";
import ProcurementModal from "./ProcurementModal";
import { options } from "./ProcurementConstants";
import { detailsListStyles } from "./ProcurementPage.styles";
import {
    IProcurementRequestContextValues,
    ProcurementRequestProvider,
} from "../../../Contexts/ProcurementRequestContext";

interface ProcurementPageProps {
    isPageLoading: boolean;
    getData: () => void;
    navigatingData: string | null | undefined;
    onModalClose: () => void;
    userRequestNumber?: string | undefined;
}

const ProcurementPage: React.FC<ProcurementPageProps> = ({
    isPageLoading,
    getData,
    navigatingData,
    onModalClose,
    userRequestNumber,
}) => {
    const [isModalVisible, { toggle: setIsModalVisible }] = useBoolean(false);
    const [errorMessageBar, setErrorMessageBar] = useState<string>();
    const [columns, setColumns] = useState<IColumn[]>();
    const [success, setSuccess] = useState<string | undefined>();
    const FILTER_COLUMNS = useMemo(() => ["Vendor", "Request Number"], []);
    const [seletedProcurementRequest, setSelectedProcurementRequest] = useState<
        string | undefined
    >();

    const [hasUserRequest, setHasUserRequest] = useState<boolean | undefined>(
        false
    );

    useEffect(() => {
        if (navigatingData) {
            setSelectedProcurementRequest(navigatingData);
            setHasUserRequest(true);
            setIsModalVisible();
        } else {
            setHasUserRequest(false);
        }
    }, [navigatingData, setIsModalVisible]);

    const {
        procurementData,
        setData,
        networkCompanies,
        initialOption,
        setInitialOption,
        setFilterQuery,
        filterdData,
        setSelectedItem,
        setSelectedCompany,
        selectedItem,
    } = useProcurementFilterContext() as IProcurementContext;

    const procurementRequestContextValue: IProcurementRequestContextValues = {
        seletedProcurementRequest,
        hasUserRequest,
        userRequestNumber,
        setHasUserRequest,
    };
    const classes = detailsListStyles();

    const tooltipContent = useMemo(
        () => (
            <div>
                <strong>Search for a keyword in the columns:</strong>
                <div>
                    {FILTER_COLUMNS.map((value, index) => (
                        <span key={index}>
                            {value}
                            {index !== FILTER_COLUMNS.length - 1 && ", "}
                        </span>
                    ))}
                </div>
            </div>
        ),
        [FILTER_COLUMNS]
    );

    const selectedProcurement = procurementData?.find(
        (d) => d.procurementRequestId === seletedProcurementRequest
    );

    const closeRefresh = (message: string) => {
        setSuccess(message);
        getData();
        setIsModalVisibleHandler();
        onModalClose();
    };

    const setIsModalVisibleHandler = () => {
        if (seletedProcurementRequest !== null) {
            setSelectedProcurementRequest(undefined);
        }
        setIsModalVisible();
    };

    const onChange = useCallback(
        (
            event: React.FormEvent<HTMLDivElement>,
            item: IDropdownOption<any> | undefined
        ): void => {
            item && setSelectedItem(item?.text);
        },
        [setSelectedItem]
    );

    const onChangeNetworkCompany = useCallback(
        (
            event: React.FormEvent<HTMLDivElement>,
            item: IDropdownOption<any> | undefined
        ): void => {
            item && setSelectedCompany(item?.text);
            setInitialOption(item);
        },
        [setInitialOption, setSelectedCompany]
    );

    const _onColumnClick = useCallback(
        (event: React.MouseEvent<HTMLElement>, column: IColumn): void => {
            if (!procurementData) return;
            const { newItems, newColumns } = sort(
                procurementData,
                column,
                sortedColumn
            );
            setColumns(newColumns);
            setData(newItems);
        },
        [procurementData, setData]
    );

    const _columns: IColumn[] = useMemo(
        () => [
            {
                key: "requestNumber",
                name: "Request Number",
                fieldName: "requestNumber",
                minWidth: 125,
                isResizable: true,
                onRender: (item: IProcurements) => {
                    return (
                        <Link
                            onClick={() => {
                                setSelectedProcurementRequest(
                                    item?.procurementRequestId
                                );
                                setIsModalVisible();
                            }}
                        >
                            {item.requestNumber}
                        </Link>
                    );
                },
            },
            {
                key: "vendorNameList",
                name: "Vendor",
                fieldName: "vendorNameList",
                minWidth: 150,
                isResizable: true,
                onRender: (item: IProcurements) => {
                    if (item?.vendors?.length > 0) {
                        return (
                            <div className={classes.tooltip}>
                                <Tooltip
                                    content={
                                        <table className={classes.table}>
                                            <thead>
                                                <tr>
                                                    <th
                                                        className={
                                                            classes.tableData
                                                        }
                                                    >
                                                        Vendor
                                                    </th>
                                                    <th
                                                        className={
                                                            classes.tableData
                                                        }
                                                    >
                                                        Quote Received On
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {item?.vendors.map((i) => {
                                                    return (
                                                        <tr key={i.vendorName}>
                                                            <td
                                                                className={
                                                                    classes.tableData
                                                                }
                                                            >
                                                                {i.vendorName}
                                                            </td>
                                                            <td
                                                                className={
                                                                    classes.tableData
                                                                }
                                                            >
                                                                {i.quoteReceivedOn &&
                                                                    new Date(
                                                                        i.quoteReceivedOn
                                                                    ).toLocaleDateString(
                                                                        "en-GB",
                                                                        {
                                                                            day: "2-digit",
                                                                            month: "short",
                                                                            year: "numeric",
                                                                        }
                                                                    )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    }
                                >
                                    {item?.vendorNameList.join(",")}
                                </Tooltip>
                            </div>
                        );
                    } else {
                        return item?.vendorNameList;
                    }
                },
            },
            {
                key: "categoryList",
                name: "Category",
                fieldName: "categoryList",
                minWidth: 180,
                isResizable: true,
                onRender: (item: IProcurements) => {
                    if (item?.categoryList?.length > 0) {
                        return (
                            <Tooltip
                                content={
                                    <table className={classes.table}>
                                        <thead>
                                            <tr>
                                                <th
                                                    className={
                                                        classes.tableData
                                                    }
                                                >
                                                    Category
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {item?.categoryList.map(
                                                (category) => {
                                                    return (
                                                        <tr key={category}>
                                                            <td
                                                                className={
                                                                    classes.tableData
                                                                }
                                                            >
                                                                {category}
                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                            )}
                                        </tbody>
                                    </table>
                                }
                            >
                                {item?.categoryList.join(", ")}
                            </Tooltip>
                        );
                    } else {
                        return item?.categoryList;
                    }
                },
            },
            {
                key: "createdOn",
                name: "Created On",
                fieldName: "createdOn",
                minWidth: 125,
                isResizable: true,
                onRender: (item: IProcurements) =>
                    item.createdOn &&
                    new Date(item.createdOn).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    }),
                onColumnClick: _onColumnClick,
            },
            {
                key: "requestRaisedOn",
                name: "Request Raised On",
                fieldName: "requestRaisedOn",
                minWidth: 125,
                isResizable: true,
                onRender: (item: IProcurements) =>
                    item.requestRaisedOn &&
                    new Date(item.requestRaisedOn).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    }),
                isSorted: true,
                isSortedDescending: true,
                onColumnClick: _onColumnClick,
            },
            {
                key: "approvedOn",
                name: "Approval Received On",
                fieldName: "approvedOn",
                minWidth: 150,
                isResizable: true,
                onRender: (item: IProcurements) =>
                    item.approvedOn &&
                    new Date(item.approvedOn).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    }),
                onColumnClick: _onColumnClick,
            },
            {
                key: "approvedBy",
                name: "Approved By",
                fieldName: "approvedBy",
                minWidth: 150,
                isResizable: true,
                onColumnClick: _onColumnClick,
            },
            {
                key: "purchaseOrderNumberList",
                name: "Purchase Orders",
                fieldName: "purchaseOrderNumberList",
                minWidth: 150,
                isResizable: true,
                onRender: (item: IProcurements) => {
                    if (item?.purchaseOrders?.length > 0) {
                        return (
                            <div className={classes.tooltip}>
                                <Tooltip
                                    content={
                                        <table className={classes.table}>
                                            <thead>
                                                <tr>
                                                    <th
                                                        className={
                                                            classes.tableData
                                                        }
                                                    >
                                                        PO Number
                                                    </th>
                                                    <th
                                                        className={
                                                            classes.tableData
                                                        }
                                                    >
                                                        PO Generated On
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {item?.purchaseOrders.map(
                                                    (i) => {
                                                        return (
                                                            <tr
                                                                key={
                                                                    i.purchaseOrderNumber
                                                                }
                                                            >
                                                                <td
                                                                    className={
                                                                        classes.tableData
                                                                    }
                                                                >
                                                                    {
                                                                        i.purchaseOrderNumber
                                                                    }
                                                                </td>
                                                                <td
                                                                    className={
                                                                        classes.tableData
                                                                    }
                                                                >
                                                                    {i.poDate &&
                                                                        new Date(
                                                                            i.poDate
                                                                        ).toLocaleDateString(
                                                                            "en-GB",
                                                                            {
                                                                                day: "2-digit",
                                                                                month: "short",
                                                                                year: "numeric",
                                                                            }
                                                                        )}
                                                                </td>
                                                            </tr>
                                                        );
                                                    }
                                                )}
                                            </tbody>
                                        </table>
                                    }
                                >
                                    {item?.purchaseOrderNumberList.join(",")}
                                </Tooltip>
                            </div>
                        );
                    } else {
                        return item?.purchaseOrderNumberList;
                    }
                },
            },
            {
                key: "status",
                name: "Status",
                fieldName: "status",
                minWidth: 150,
                isResizable: true,
                onRender: (item: IProcurements) =>
                    getProcurementStatus(item.status),
            },
            {
                key: "notes",
                name: "Notes",
                fieldName: "notes",
                minWidth: 50,
                isResizable: true,
                onRender: (item: IProcurements) => {
                    return (
                        <Tooltip content={item?.notes}>{item?.notes}</Tooltip>
                    );
                },
            },
        ],
        [_onColumnClick, classes, setIsModalVisible]
    );

    const sortedColumn = columns ?? _columns;

    const NewProcurementButton = useCallback(
        () => (
            <PrimaryButton
                text="+ New Procurement"
                onClick={setIsModalVisible}
                styles={{
                    root: {
                        marginRight: 16,
                    },
                }}
            />
        ),
        [setIsModalVisible]
    );

    const filterProps: IFilterPropsDashboard[] = useMemo(
        () => [
            {
                type: "dropdown",
                label: "Network Company",
                placeholder: "Network Company",
                options: networkCompanies ?? [],
                onChange: onChangeNetworkCompany,
                defaultSelectedKey: initialOption?.key,
                selectedKey: initialOption?.key,
            },
            {
                type: "dropdown",
                label: "Status",
                placeholder: "Status",
                options: Object.keys(options).map((option) => ({
                    key: option,
                    text: option,
                })),
                onChange: onChange,
                selectedKey: Object.keys(options).find(
                    (option) => option === selectedItem
                ),
            },
        ],
        [
            networkCompanies,
            onChangeNetworkCompany,
            initialOption?.key,
            onChange,
            selectedItem,
        ]
    );

    return (
        <Stack>
            <PageTemplate
                heading="Procurement List"
                isLoading={isPageLoading || initialOption === undefined}
                errorOccured={procurementData === null}
                successMessageBar={success}
                setSuccessMessageBar={setSuccess}
                errorMessage={errorMessageBar}
                headerElementRight={<NewProcurementButton />}
                clearErrorMessage={() => setErrorMessageBar("")}
            >
                {procurementData?.length !== 0 && initialOption ? (
                    <FilterComponents filterProps={filterProps}>
                        <Stack
                            style={{
                                display: "flex",
                                flexDirection: "row",
                            }}
                        >
                            <StyledSearchBar onFilterChange={setFilterQuery} />
                            <TooltipHost
                                content={tooltipContent}
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
                    </FilterComponents>
                ) : null}
                {procurementData && initialOption ? (
                    <StyledDetailsList
                        data={filterdData ?? []}
                        columns={sortedColumn}
                        emptymessage="No requests found"
                    />
                ) : null}
                {isModalVisible && (
                    <ProcurementRequestProvider
                        value={procurementRequestContextValue}
                    >
                        <ProcurementModal
                            isModalVisible={isModalVisible}
                            selectedProcurement={selectedProcurement}
                            setIsModalVisible={setIsModalVisibleHandler}
                            closeRefresh={closeRefresh}
                            onModalClose={onModalClose}
                        />
                    </ProcurementRequestProvider>
                )}
            </PageTemplate>
        </Stack>
    );
};

export default ProcurementPage;

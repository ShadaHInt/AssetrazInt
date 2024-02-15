import React, { useCallback, useMemo, useState } from "react";
import {
    DefaultButton,
    DirectionalHint,
    IColumn,
    IDropdownOption,
    IGroup,
    Link,
    Stack,
    TooltipHost,
} from "@fluentui/react";
import { useBoolean } from "@fluentui/react-hooks";

import PageTemplate from "../../../components/common/PageTemplate";
import StyledDetailsList from "../../../components/common/StyledDetailsList";
import StyledSearchBar from "../../../components/common/StyledSearchBar";

import {
    convertDateToddMMMYYYFormat,
    convertUTCDateToLocalDate,
} from "../../../Other/DateFormat";

import { PurchaseDetails } from "../../../types/PurchaseOrder";
import PurchaseOrderModal from "./PurchaseOrderModal";
import FilterComponents, {
    IFilterPropsDashboard,
} from "../../../components/common/FilterComponents";

import {
    calloutProps,
    hostStyles,
    infoButtonStyles,
} from "../../../components/common/TooltipStyles";

import {
    IPOContext,
    usePOContext,
} from "../../../Contexts/PurchaseOrderContext";
import {
    FILTER_COLUMNS,
    HANDOVER_OPTIONS,
    PO_OPTIONS,
} from "./PurchaseOrderConstants";

const PurchaseOrderDashBoard = ({ isLoading, errorMessage }: any) => {
    const initialValues = {} as any;
    const [success, setSuccess] = useState<string | undefined>();
    const [loadOnClose, setLoadOnClose] = useState<boolean>(false);
    const [isPOModalOpen, { toggle: setIsPOModalOpen }] = useBoolean(false);
    const [selectedDetails, setSelectedDetails] =
        useState<PurchaseDetails>(initialValues);

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
        []
    );

    const {
        data,
        filteredData,
        networkCompanyOptions,
        initialOption,
        setInitialOption,
        selectedHandedOverState,
        setSelectedHandedOverState,
        setFilterQuery,
        getPurchaseOrderList,
        selectedPOState,
        setSelectedPOState,
    } = usePOContext() as IPOContext;

    const groups: IGroup[] = useMemo(() => {
        if (!filteredData) return [];
        const group: IGroup[] = [];
        let startIndex = 0;
        let i = 0;

        while (i < filteredData.length) {
            const key = filteredData[i].requestNumber;
            const currentGroup = {
                key,
                name: key,
                startIndex,
                count: 0,
            };

            while (
                i < filteredData.length &&
                key === filteredData[i].requestNumber
            ) {
                currentGroup.count++;
                i++;
            }

            group.push(currentGroup);
            startIndex += currentGroup.count;
        }
        return group;
    }, [filteredData]);

    const closeRefresh = (message?: string) => {
        setSuccess(message);
        getPurchaseOrderList();
        setLoadOnClose(false);
        setIsPOModalOpen();
    };

    const onChange = useCallback(
        (
            event: React.FormEvent<HTMLDivElement>,
            item: IDropdownOption<any> | undefined
        ): void => {
            item && setSelectedHandedOverState(item?.text);
        },
        [setSelectedHandedOverState]
    );

    const onChangeStatus = useCallback(
        (
            event: React.FormEvent<HTMLDivElement>,
            item: IDropdownOption<any> | undefined
        ): void => {
            item && setSelectedPOState(item?.text);
        },
        [setSelectedPOState]
    );

    const onChangeNetworkCompany = useCallback(
        (event: any, item: IDropdownOption<any> | undefined): void => {
            item && setInitialOption(item);
        },
        [setInitialOption]
    );

    const _columns: IColumn[] = useMemo(
        () => [
            {
                key: "",
                name: "",
                fieldName: "",
                minWidth: 25,
                maxWidth: 25,
                isResizable: true,
            },
            {
                key: "vendorName",
                name: "Vendor",
                fieldName: "vendorName",
                minWidth: 100,
                maxWidth: 150,
                isResizable: true,
            },
            {
                key: "requestRaisedOn",
                name: "Request Raised On",
                fieldName: "requestRaisedOn",
                minWidth: 100,
                maxWidth: 150,
                isResizable: true,
                onRender: (item: PurchaseDetails) =>
                    convertDateToddMMMYYYFormat(item.requestRaisedOn),
            },
            {
                key: "quoteReceivedOn",
                name: "Quote Received On",
                fieldName: "quoteReceivedOn",
                minWidth: 100,
                maxWidth: 150,
                isResizable: true,
                onRender: (item: PurchaseDetails) =>
                    convertDateToddMMMYYYFormat(item.quoteReceivedOn),
            },
            {
                key: "approvedOn",
                name: "Approval Received On",
                fieldName: "approvedOn",
                minWidth: 100,
                maxWidth: 150,
                isResizable: true,
                onRender: (item: PurchaseDetails) =>
                    convertDateToddMMMYYYFormat(item.approvedOn),
            },
            {
                key: "approvedBy",
                name: "Approved By",
                fieldName: "approvedBy",
                minWidth: 100,
                maxWidth: 150,
                isResizable: true,
            },
            {
                key: "purchaseOderNumber",
                name: "PO Number",
                fieldName: "purchaseOderNumber",
                minWidth: 100,
                maxWidth: 150,
                isResizable: true,
                onRender: (item: PurchaseDetails) => {
                    return (
                        <Link
                            onClick={(e) => {
                                e.preventDefault();
                                setSelectedDetails(item);
                                setIsPOModalOpen();
                            }}
                        >
                            {item?.purchaseOrderNumber != null
                                ? item?.purchaseOrderNumber
                                : "Create PO"}
                        </Link>
                    );
                },
            },
            {
                key: "poDate",
                name: "PO Date",
                fieldName: "poDate",
                minWidth: 100,
                maxWidth: 120,
                isResizable: true,
                onRender: (item: PurchaseDetails) =>
                    convertDateToddMMMYYYFormat(item.poDate),
            },
            {
                key: "invoiceNumber",
                name: "Invoice Number",
                fieldName: "invoiceNumber",
                minWidth: 100,
                maxWidth: 150,
                isResizable: true,
            },
            {
                key: "invoiceDate",
                name: "Invoice Date",
                fieldName: "invoiceDate",
                minWidth: 100,
                maxWidth: 150,
                isResizable: true,
                onRender: (item: PurchaseDetails) => {
                    return item.invoiceDate
                        ? convertDateToddMMMYYYFormat(
                              convertUTCDateToLocalDate(item.invoiceDate)
                          )
                        : "";
                },
            },
        ],
        [setIsPOModalOpen]
    );

    const filterProps: IFilterPropsDashboard[] = useMemo(
        () => [
            {
                type: "dropdown",
                label: "Network Company",
                placeholder: "Network Company",
                options: networkCompanyOptions ?? [],
                onChange: onChangeNetworkCompany,
                defaultSelectedKey: initialOption?.key,
                selectedKey: initialOption?.key,
            },
            {
                type: "dropdown",
                label: "Handover to IT",
                placeholder: "Handover to IT",
                options:
                    Object.keys(HANDOVER_OPTIONS).map((option) => ({
                        key: option,
                        text: option,
                    })) ?? [],
                onChange: onChange,
                selectedKey: Object.keys(HANDOVER_OPTIONS).find(
                    (option) =>
                        option.toLowerCase() ===
                        selectedHandedOverState?.toLowerCase()
                ),
            },
            {
                type: "dropdown",
                label: "Status",
                placeholder: "Status",
                options: Object.entries(PO_OPTIONS).map((a) => ({
                    key: a[0],
                    text: a[1],
                })),
                onChange: onChangeStatus,
                selectedKey: Object.keys(PO_OPTIONS).find(
                    (key) =>
                        PO_OPTIONS[key as keyof typeof PO_OPTIONS] ===
                        selectedPOState
                ),
            },
        ],
        [
            initialOption?.key,
            networkCompanyOptions,
            onChange,
            onChangeNetworkCompany,
            onChangeStatus,
            selectedHandedOverState,
            selectedPOState,
        ]
    );

    return (
        <>
            <PageTemplate
                heading="Purchase Orders"
                successMessageBar={success}
                setSuccessMessageBar={setSuccess}
                errorMessage={errorMessage}
                isLoading={isLoading}
            >
                {data.length > 0 ? (
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
                    </FilterComponents>
                ) : null}
                {data && (
                    <StyledDetailsList
                        data={filteredData}
                        groups={groups}
                        columns={_columns}
                        emptymessage="No requests found"
                    />
                )}
            </PageTemplate>

            {isPOModalOpen && (
                <PurchaseOrderModal
                    isOpen={isPOModalOpen}
                    onDismiss={loadOnClose ? closeRefresh : setIsPOModalOpen}
                    purchaseDetails={selectedDetails}
                    setPurchaseDetails={setSelectedDetails}
                    setLoadOnClose={setLoadOnClose}
                    closeRefresh={closeRefresh}
                />
            )}
        </>
    );
};

export default PurchaseOrderDashBoard;

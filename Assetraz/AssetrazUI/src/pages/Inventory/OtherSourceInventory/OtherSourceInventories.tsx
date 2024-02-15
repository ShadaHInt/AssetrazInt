import React, { useCallback, useMemo, useState } from "react";
import { useBoolean } from "@fluentui/react-hooks";
import {
    DefaultButton,
    DirectionalHint,
    IColumn,
    IDropdownOption,
    Link,
    PrimaryButton,
    Stack,
    TooltipHost,
} from "@fluentui/react";

import { Tooltip } from "../../../components/common/Tooltip";
import PageTemplate from "../../../components/common/PageTemplate";
import FilterComponents, {
    IFilterPropsDashboard,
} from "../../../components/common/FilterComponents";
import StyledSearchBar from "../../../components/common/StyledSearchBar";
import StyledDetailsList, {
    sort,
} from "../../../components/common/StyledDetailsList";

import {
    convertDateToddMMMYYYFormat,
    convertUTCDateToLocalDate,
} from "../../../Other/DateFormat";

import {
    IFilterContext,
    useFilterContext,
} from "../../../Contexts/OtherSourceFilterContext";
import { dropdownOptions } from "./OtherSourceConstants";

import { IOtherSourceInventory } from "../../../types/OtherSourceInventory";

import {
    calloutProps,
    hostStyles,
    infoButtonStyles,
} from "../../../components/common/TooltipStyles";
import { toolTipStyle } from "./OtherSourceDashboardStyles";
import { OtherSourceModalProvider } from "./OtherSourceModalProvider";
import { OtherSourceInventoryRefactored } from "./OtherSourceInventoryModalRefactored";

interface OtherSourceInventoriesProps {
    getData: () => void;
    isLoading: boolean;
    refetchWithoutLoading: () => void;
}

const OtherSourceInventories: React.FC<OtherSourceInventoriesProps> = ({
    getData,
    isLoading,
    refetchWithoutLoading,
}) => {
    const [seletedInventoryRequest, setSelectedInventoryRequest] = useState<
        string | undefined
    >("");

    const [success, setSuccess] = useState<string | undefined>();
    const [isModalVisible, { toggle: setIsModalVisible }] = useBoolean(false);
    const [isReadOnly, setIsReadOnly] = useState<boolean>(false);
    const [columns, setColumns] = useState<IColumn[]>();
    const FILTER_COLUMNS = useMemo(
        () => ["Source", "Document Number", "Category"],
        []
    );

    const {
        otherSourceData,
        setFilteredData,
        initialOption,
        setInitialOption,
        statusOption,
        setStatusOption,
        filterdData,
        setFilterQuery,
        networkCompanyOption,
    } = useFilterContext() as IFilterContext;

    const toolTipStyles = toolTipStyle();

    const selectedOtherSource = useMemo(
        () =>
            otherSourceData?.find(
                (d) => d.inventoryOtherSourceId === seletedInventoryRequest
            ),
        [otherSourceData, seletedInventoryRequest]
    );

    const AddAssetsButton = useCallback(
        () => (
            <PrimaryButton
                text="+ Add Assets"
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

    const closeRefresh = (message: string) => {
        setSuccess(message);
        getData();
        setIsModalVisibleHandler();
    };

    const setIsModalVisibleHandler = useCallback(() => {
        if (seletedInventoryRequest !== null) {
            setSelectedInventoryRequest(undefined);
            if (isReadOnly) setIsReadOnly(false);
        }

        setIsModalVisible();
    }, [seletedInventoryRequest, setIsModalVisible, isReadOnly]);

    const onChangeNetworkCompany = useCallback(
        (event: any, item: IDropdownOption<any> | undefined): void => {
            item && setInitialOption(item);
        },
        [setInitialOption]
    );

    const onChangeAssetStatus = useCallback(
        (event: any, item: IDropdownOption<any> | undefined): void => {
            item && setStatusOption(item);
        },
        [setStatusOption]
    );

    const _onColumnClick = useCallback(
        (event: React.MouseEvent<HTMLElement>, column: IColumn) => {
            setFilteredData((prevInvoices: IOtherSourceInventory[]) => {
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
        [setFilteredData]
    );

    const _columns: IColumn[] = [
        {
            key: "documentID",
            name: "Document ID",
            fieldName: "documentID",
            minWidth: 100,
            maxWidth: 130,
            isResizable: true,
            onColumnClick: _onColumnClick,
            onRender: (item: IOtherSourceInventory) => {
                return (
                    <Link
                        onClick={() => {
                            setSelectedInventoryRequest(
                                item?.inventoryOtherSourceId
                            );
                            if (item.assetStatus) {
                                setIsReadOnly(true);
                            }
                            setIsModalVisible();
                        }}
                    >
                        {item?.documentID}
                    </Link>
                );
            },
        },
        {
            key: "networkCompanyName",
            name: "Network Company",
            fieldName: "networkCompanyName",
            minWidth: 100,
            maxWidth: 130,
            isResizable: true,
        },
        {
            key: "sourceName",
            name: "Source",
            fieldName: "sourceName",
            minWidth: 100,
            maxWidth: 130,
            isResizable: true,
        },
        {
            key: "receivedDate",
            name: "Received On",
            fieldName: "receivedDate",
            minWidth: 100,
            maxWidth: 130,
            isResizable: true,
            onColumnClick: _onColumnClick,
            onRender: (item: IOtherSourceInventory) =>
                convertDateToddMMMYYYFormat(
                    convertUTCDateToLocalDate(item.receivedDate)
                ),
            isSorted: true,
            isSortedDescending: false,
        },
        {
            key: "categoryList",
            name: "Category",
            fieldName: "categoryList",
            minWidth: 100,
            maxWidth: 130,
            isResizable: true,
            onRender: (item: IOtherSourceInventory) => {
                if (item?.categoryList?.length > 0) {
                    return (
                        <Tooltip
                            content={
                                <table className={toolTipStyles.table}>
                                    <thead>
                                        <tr>
                                            <th
                                                className={
                                                    toolTipStyles.tableData
                                                }
                                            >
                                                Category
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {item?.categoryList.map((category) => {
                                            return (
                                                <tr key={category}>
                                                    <td
                                                        className={
                                                            toolTipStyles.tableData
                                                        }
                                                    >
                                                        {category}
                                                    </td>
                                                </tr>
                                            );
                                        })}
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
            key: "notes",
            name: "Notes",
            fieldName: "notes",
            minWidth: 50,
            isResizable: true,
            onRender: (item: IOtherSourceInventory) => {
                return (
                    <TooltipHost content={item?.notes}>
                        {item?.notes}
                    </TooltipHost>
                );
            },
        },
        {
            key: "documentNumber",
            name: "Document Number",
            fieldName: "documentNumber",
            minWidth: 100,
            maxWidth: 130,
            isResizable: true,
        },
        {
            key: "cutOverStock",
            name: "Old Stock",
            fieldName: "cutOverStock",
            minWidth: 100,
            maxWidth: 130,
            isResizable: true,
            onRender: (item: IOtherSourceInventory) => {
                return item.cutOverStock ? "Yes" : "No";
            },
        },
        {
            key: "assetStatus",
            name: "Status",
            fieldName: "assetStatus",
            minWidth: 100,
            maxWidth: 130,
            isResizable: true,
            onRender: (item: IOtherSourceInventory) => {
                return item.assetStatus ? "Taken to Stock" : "";
            },
        },
    ];

    const sortedColumn = columns ?? _columns;

    const filterProps: IFilterPropsDashboard[] = useMemo(
        () => [
            {
                type: "dropdown",
                label: "Network Company",
                placeholder: "Network Company",
                options: networkCompanyOption ?? [],
                onChange: onChangeNetworkCompany,
                defaultSelectedKey: initialOption?.key,
                selectedKey: initialOption?.key,
            },
            {
                type: "dropdown",
                label: "Status",
                placeholder: "Status",
                options: dropdownOptions,
                onChange: onChangeAssetStatus,
                defaultSelectedKey: "false",
                selectedKey: statusOption?.key,
            },
        ],
        [
            initialOption?.key,
            networkCompanyOption,
            onChangeAssetStatus,
            onChangeNetworkCompany,
            statusOption?.key,
        ]
    );

    return (
        <Stack>
            <PageTemplate
                heading="Other Source Inventory"
                isLoading={isLoading}
                successMessageBar={success}
                setSuccessMessageBar={setSuccess}
                errorOccured={otherSourceData === null}
                headerElementRight={<AddAssetsButton />}
            >
                {otherSourceData?.length !== 0 && filterdData ? (
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

                {otherSourceData && !isLoading ? (
                    <StyledDetailsList
                        data={filterdData ?? []}
                        columns={sortedColumn}
                        emptymessage="No assets found"
                    />
                ) : null}

                <OtherSourceModalProvider>
                    <OtherSourceInventoryRefactored
                        isModalVisible={isModalVisible}
                        selectedOtherSource={selectedOtherSource}
                        setIsModalVisible={setIsModalVisibleHandler}
                        isReadOnly={isReadOnly}
                        closeRefresh={closeRefresh}
                        refetchWithoutLoading={refetchWithoutLoading}
                    />
                </OtherSourceModalProvider>
            </PageTemplate>
        </Stack>
    );
};

export default OtherSourceInventories;

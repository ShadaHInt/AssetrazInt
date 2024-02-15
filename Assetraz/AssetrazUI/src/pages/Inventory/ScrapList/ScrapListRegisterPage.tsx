import React, { useCallback, useMemo, useState } from "react";
import {
    IColumn,
    IDropdownOption,
    Stack,
    Link,
    TooltipHost,
    DirectionalHint,
    DefaultButton,
} from "@fluentui/react";
import { useBoolean } from "@fluentui/react-hooks";
import { RangeKeyDict } from "react-date-range";
import { useId } from "@fluentui/react-hooks";

import PageTemplate from "../../../components/common/PageTemplate";
import StyledDetailsList, {
    sort,
} from "../../../components/common/StyledDetailsList";
import { ScrapList } from "../../../types/ScrapList";
import {
    convertDateToGBFormat,
    convertDateToddMMMYYYFormat,
    convertUTCDateToLocalDate,
} from "../../../Other/DateFormat";
import { Tooltip } from "../../../components/common/Tooltip";
import { detailsListStyles } from "../../Admin/ProcurementPage/ProcurementPage.styles";
import StyledSearchBar from "../../../components/common/StyledSearchBar";
import SytledDialog from "../../../components/common/StyledDialog";
import { DeleteScrap } from "../../../services/assetService";
import FilterComponents, {
    IFilterPropsDashboard,
} from "../../../components/common/FilterComponents";
import {
    calloutProps,
    hostStyles,
    infoButtonStyles,
} from "../../../components/common/TooltipStyles";

import {
    ScrapContextState,
    useScrapListContext,
} from "../../../Contexts/ScrapListContext";
import { DownLoadFileComponent } from "../../../components/common/DownloadFileComponent";
import { clearStackStyles } from "../../Admin/UserReport/UserReportStyles";

const FILTER_COLUMNS = [
    "Category Name",
    "Manufacturer Name",
    "Marked By",
    "Asset Tag Number",
];

const ScrapListRegisterPage = () => {
    const {
        scrapAssets,
        setScrapAssets,
        networkCompanies,
        selectedDateRange,
        setSelectedCompany,
        setInitialOption,
        setDateRange,
        initialOption,
        setFilterQuery,
        filteredData,
        setIsLoading,
        isLoading,
        refresh,
        errorOccured,
    } = useScrapListContext() as ScrapContextState;

    const [columns, setColumns] = useState<IColumn[]>();
    const classes = detailsListStyles();
    const [showConfirmDialog, { toggle: toggleConfirmDialog }] =
        useBoolean(false);
    const [selectedAsset, setSelectedAsset] = useState<ScrapList>();
    const [successMessage, setSuccessMessage] = useState<string>();

    const id = "scrappedDate";
    const dateRangeAnchorId = useId(`date-range-anchor-${id}`);

    let text = "Select date range";
    if (selectedDateRange?.startDate || selectedDateRange?.endDate) {
        text = `${convertDateToGBFormat(
            selectedDateRange?.startDate
        )} - ${convertDateToGBFormat(selectedDateRange?.endDate)}`;
    }

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
            if (!scrapAssets) return;
            const { newItems, newColumns } = sort(
                scrapAssets,
                column,
                sortedColumn
            );
            setColumns(newColumns);
            setScrapAssets(newItems);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [scrapAssets, setScrapAssets]
    );

    const deleteItemFromScrapList = useCallback(async () => {
        toggleConfirmDialog();
        setIsLoading(true);
        if (selectedAsset?.refurbishedAssetId !== undefined) {
            try {
                await DeleteScrap(selectedAsset?.refurbishedAssetId);
                setIsLoading(false);
                setSuccessMessage(
                    "Successfully removed asset from the scrap list."
                );
                refresh();
            } catch (err: any) {
                setIsLoading(false);
            }
        }
    }, [
        refresh,
        selectedAsset?.refurbishedAssetId,
        setIsLoading,
        toggleConfirmDialog,
    ]);

    const DeleteScrapItemDialog = useCallback(() => {
        return (
            <SytledDialog
                showDialog={showConfirmDialog}
                toggleDialog={toggleConfirmDialog}
                title="Confirmation"
                subText="Would you like to remove the asset from the Scrap list?"
                action={deleteItemFromScrapList}
            />
        );
    }, [deleteItemFromScrapList, showConfirmDialog, toggleConfirmDialog]);

    const handleSelect = useCallback(
        (ranges: RangeKeyDict) => {
            setDateRange(ranges.selection);
        },
        [setDateRange]
    );

    const _columns: IColumn[] = [
        {
            key: "categoryName",
            name: "Category",
            fieldName: "categoryName",
            minWidth: 100,
            maxWidth: 110,
            isResizable: true,
            onColumnClick: _onColumnClick,
        },
        {
            key: "manufacturerName",
            name: "Manufacturer",
            fieldName: "manufacturerName",
            minWidth: 100,
            maxWidth: 110,
            isResizable: true,
            onColumnClick: _onColumnClick,
        },
        {
            key: "modelNumber",
            name: "Model Number",
            fieldName: "modelNumber",
            minWidth: 100,
            maxWidth: 130,
            isResizable: true,
        },
        {
            key: "warrentyDate",
            name: "Warranty Date",
            fieldName: "warrentyDate",
            minWidth: 100,
            maxWidth: 110,
            isResizable: true,
            onRender: (item: ScrapList) =>
                convertDateToddMMMYYYFormat(item.warrentyDate),
            onColumnClick: _onColumnClick,
        },
        {
            key: "serialNumber",
            name: "Serial Number",
            fieldName: "serialNumber",
            minWidth: 100,
            maxWidth: 130,
            isResizable: true,
        },
        {
            key: "assetTagNumber",
            name: "Asset Tag Number",
            fieldName: "assetTagNumber",
            minWidth: 100,
            maxWidth: 130,
            isResizable: true,
            onRender: (item: ScrapList) => {
                return (
                    <Link
                        onClick={() => {
                            setSelectedAsset(item);
                            toggleConfirmDialog();
                        }}
                    >
                        {item.assetTagNumber
                            ? item.assetTagNumber
                            : item.inventoryId.slice(0, 15)}
                    </Link>
                );
            },
        },
        {
            key: "scrappedDate",
            name: "Scrapped Date",
            fieldName: "scrappedDate",
            minWidth: 100,
            maxWidth: 110,
            isResizable: true,
            onRender: (item: ScrapList) =>
                convertDateToddMMMYYYFormat(
                    convertUTCDateToLocalDate(item.scrappedDate)
                ),
            isSorted: true,
            isSortedDescending: false,
            onColumnClick: _onColumnClick,
        },
        {
            key: "markedBy",
            name: "Marked By",
            fieldName: "markedBy",
            minWidth: 100,
            maxWidth: 130,
            isResizable: true,
        },
        {
            key: "status",
            name: "Status",
            fieldName: "status",
            minWidth: 80,
            maxWidth: 90,
            isResizable: true,
        },
        {
            key: "remarks",
            name: "Remarks",
            fieldName: "remarks",
            minWidth: 100,
            maxWidth: 130,
            isResizable: true,
            onRender: (item: ScrapList) => {
                if (item?.remarks.length > 50) {
                    return (
                        <div className={classes.tooltip}>
                            <Tooltip content={item?.remarks}>
                                {item?.remarks}
                            </Tooltip>
                        </div>
                    );
                } else {
                    return item?.remarks;
                }
            },
        },
        {
            key: "networkCompanyName",
            name: "Network Company",
            fieldName: "networkCompanyName",
            minWidth: 100,
            maxWidth: 120,
            isResizable: true,
        },
    ];

    const sortedColumn = columns ?? _columns;

    const filterProps: IFilterPropsDashboard[] = useMemo(
        () => [
            {
                type: "dropdown",
                label: "Network Company",
                placeholder: "Network Company",
                options: networkCompanies ?? [],
                onChange: onChangeNetworkCompany,
                selectedKey: initialOption?.key,
            },
            {
                type: "date",
                label: "Scrapped Date",
                placeholder: "Select Date",
                onChange: handleSelect,
                selectedRange: selectedDateRange,
                dateRangeAnchorId: dateRangeAnchorId,
                text: text,
            },
        ],
        [
            dateRangeAnchorId,
            handleSelect,
            initialOption?.key,
            networkCompanies,
            onChangeNetworkCompany,
            selectedDateRange,
            text,
        ]
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
        []
    );

    return (
        <>
            <Stack>
                <PageTemplate
                    heading="Scrap List Register"
                    isLoading={isLoading}
                    errorOccured={errorOccured}
                    setSuccessMessageBar={setSuccessMessage}
                    successMessageBar={successMessage}
                >
                    {scrapAssets?.length !== 0 && (
                        <>
                            <FilterComponents filterProps={filterProps}>
                                <Stack
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                    }}
                                >
                                    <StyledSearchBar
                                        onFilterChange={setFilterQuery}
                                    />
                                    <TooltipHost
                                        content={tooltipContent}
                                        calloutProps={calloutProps}
                                        styles={hostStyles}
                                        directionalHint={
                                            DirectionalHint.rightCenter
                                        }
                                    >
                                        <DefaultButton
                                            aria-label={"more info"}
                                            styles={infoButtonStyles}
                                            iconProps={{ iconName: "Info" }}
                                        />
                                    </TooltipHost>
                                </Stack>
                            </FilterComponents>
                            <Stack
                                horizontal
                                horizontalAlign="end"
                                style={clearStackStyles}
                            >
                                <DownLoadFileComponent
                                    data={filteredData ?? []}
                                    columns={sortedColumn}
                                />
                            </Stack>
                        </>
                    )}

                    {filteredData && (
                        <StyledDetailsList
                            data={filteredData ?? []}
                            columns={sortedColumn}
                            emptymessage="No assets found"
                        />
                    )}
                </PageTemplate>
            </Stack>
            <DeleteScrapItemDialog />
        </>
    );
};

export default ScrapListRegisterPage;

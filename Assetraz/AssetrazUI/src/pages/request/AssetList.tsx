import * as React from "react";
import { IColumn } from "@fluentui/react/lib/DetailsList";
import {
    ChoiceGroup,
    IChoiceGroupOption,
} from "@fluentui/react/lib/ChoiceGroup";
import {
    ActionButton,
    DefaultButton,
    DirectionalHint,
    IDropdownOption,
    IIconProps,
    Link,
    Stack,
    StackItem,
    TooltipHost,
} from "@fluentui/react";
import { useId } from "@fluentui/react-hooks";

import IAsset from "../../types/Asset";
import { Tooltip } from "../../components/common/Tooltip";
import StyledDetailsList from "../../components/common/StyledDetailsList";
import { convertDateToGBFormat } from "../../Other/DateFormat";
import FilterComponents, {
    IFilterPropsDashboard,
} from "../../components/common/FilterComponents";
import StyledSearchBar from "../../components/common/StyledSearchBar";
import {
    calloutProps,
    hostStyles,
    infoButtonStyles,
} from "../../components/common/TooltipStyles";
import { RangeKeyDict } from "react-date-range";

import {
    IIssuableAssetContext,
    useIssuableAssetContext,
} from "../../Contexts/IssuableAssetContext";

const clearIcon: IIconProps = { iconName: "ClearFilter" };

const options: IChoiceGroupOption[] = [
    { key: "1", text: "Available" },
    { key: "2", text: "Issued" },
    { key: "3", text: "All" },
];

export const ChoiceGroupControlledExample: React.FunctionComponent = () => {
    const [selectedKey, setSelectedKey] = React.useState<string | undefined>(
        "3"
    );

    const onChange = React.useCallback(
        (ev: any, options?: IChoiceGroupOption) => {
            setSelectedKey(options?.key);
        },
        []
    );

    const choicegroupstyle = {
        flexContainer: {
            display: "flex",
        },
    };
    return (
        <ChoiceGroup
            selectedKey={selectedKey}
            styles={choicegroupstyle}
            options={options}
            onChange={onChange}
            label="Asset status"
        />
    );
};
export interface IDocument {
    key: string;
    name: string;
    categoryName: string;
    manufacturerName: string;
    modelNumber: string;
    serialNumber: string;
    assetTagNumber: string;
    warrentyDate: string;
    assetStatus: string;
    emailId: string;
    issuedDate: string;
    inventoryId: string;
    networkCompanyName?: string;
}

export interface IDetailsListBasicExampleState {
    items: IDocument[];
    selectionDetails: string;
}

interface Props {
    assets: IAsset[];
    filteredCategory: string;
    setInventoryId: (inventoryId: string) => void;
}

export const AssetList: React.FunctionComponent<Props> = (props) => {
    const options = React.useMemo(
        () => ({ Available: "Available", Issued: "Issued", All: "All" }),
        []
    );

    const FILTER_COLUMNS = React.useMemo(
        () => [
            "Category Name",
            "Manufacturer Name",
            "Model Number",
            "Asset Status",
            "Serial Number",
            "Asset Tag Number",
            "Issued to",
        ],
        []
    );

    const {
        setSelectedInventoryId,
        allItems,
        setFilterValue,
        filtered,
        setSelectedItem,
        selectedItem,
        selectedDateRange,
        selectedIssuedDateRange,
        initialOption,
        networkCompanyOption,
        setInitialOption,
        setDateRange,
        setSelectedIssuedDate,
    } = useIssuableAssetContext() as IIssuableAssetContext;

    const id = "warrantyDate";
    const dateRangeAnchorId = useId(`date-range-anchor-${id}`);

    const issuedId = "issuedDate";
    const issuedDateRangeAnchorId = useId(`date-range-anchor-${issuedId}`);

    let text = "Select date range";
    if (selectedDateRange?.startDate || selectedDateRange?.endDate) {
        text = `${convertDateToGBFormat(
            selectedDateRange?.startDate
        )} - ${convertDateToGBFormat(selectedDateRange?.endDate)}`;
    }

    let issuedText = "Select date range";
    if (
        selectedIssuedDateRange?.startDate ||
        selectedIssuedDateRange?.endDate
    ) {
        issuedText = `${convertDateToGBFormat(
            selectedIssuedDateRange?.startDate
        )} - ${convertDateToGBFormat(selectedIssuedDateRange?.endDate)}`;
    }

    const tooltipContent = React.useMemo(
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

    const _onFilter = (text: string): void => {
        setFilterValue(text);
    };

    const onChange = React.useCallback(
        (
            event: React.FormEvent<HTMLDivElement>,
            item: IDropdownOption<any> | undefined
        ): void => {
            item && setSelectedItem(item.key as string);
        },
        [setSelectedItem]
    );

    const onChangeNetworkCompany = React.useCallback(
        (event: any, item: IDropdownOption<any> | undefined): void => {
            item && setInitialOption(item);
        },
        [setInitialOption]
    );

    const handleSelect = React.useCallback(
        (ranges: RangeKeyDict) => {
            setDateRange(ranges.selection);
        },
        [setDateRange]
    );

    const handleIssued = React.useCallback(
        (ranges: RangeKeyDict) => {
            setSelectedIssuedDate(ranges.selection);
        },
        [setSelectedIssuedDate]
    );

    const _columns: IColumn[] = [
        {
            key: "categoryName",
            name: "Category",
            fieldName: "categoryName",
            minWidth: 100,
            isResizable: true,
        },
        {
            key: "manufacturerName",
            name: "Manufacturer",
            fieldName: "manufacturerName",
            minWidth: 100,
            isResizable: true,
        },
        {
            key: "modelNumber",
            name: "Model Number",
            fieldName: "modelNumber",
            minWidth: 100,
            isResizable: true,
        },
        {
            key: "warrentyDate",
            name: "Warranty Date",
            fieldName: "warrentyDate",
            minWidth: 100,
            isResizable: true,
        },
        {
            key: "serialNumber",
            name: "Serial Number",
            fieldName: "serialNumber",
            minWidth: 150,
            isResizable: true,
        },
        {
            key: "assetTagNumber",
            name: "Asset Tag #",
            fieldName: "assetTagNumber",
            minWidth: 100,
            isResizable: true,
            onRender: (item: IDocument) => {
                return (
                    <Link
                        onClick={(e) => {
                            e.preventDefault();
                            setSelectedInventoryId(item?.key);
                        }}
                    >
                        {item?.assetTagNumber}
                    </Link>
                );
            },
        },
        {
            key: "emailId",
            name: "Issued To",
            fieldName: "emailId",
            minWidth: 120,
            isResizable: true,
            onRender: (item: IDocument) => {
                if (item?.emailId?.length > 20) {
                    return (
                        <Tooltip content={item?.emailId}>
                            {item?.emailId}
                        </Tooltip>
                    );
                } else {
                    return item?.emailId;
                }
            },
        },
        {
            key: "issuedDate",
            name: "Issued Date",
            fieldName: "issuedDate",
            minWidth: 100,
            isResizable: true,
        },
        {
            key: "assetStatus",
            name: "Asset Status",
            fieldName: "assetStatus",
            minWidth: 100,
            isResizable: true,
        },
        {
            key: "issuedBy",
            name: "Issued By",
            fieldName: "issuedBy",
            minWidth: 120,
            isResizable: true,
            flexGrow: 1,
        },
    ];

    const filterProps: IFilterPropsDashboard[] = React.useMemo(
        () => [
            {
                type: "date",
                label: "Warranty Date",
                placeholder: "Select Date",
                onChange: handleSelect,
                selectedRange: selectedDateRange,
                dateRangeAnchorId: dateRangeAnchorId,
                text: text,
            },
            {
                type: "date",
                label: "Issued Date",
                placeholder: "Select Date",
                onChange: handleIssued,
                selectedRange: selectedIssuedDateRange,
                dateRangeAnchorId: issuedDateRangeAnchorId,
                text: issuedText,
            },
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
                options: Object.keys(options).map((option) => ({
                    key: option,
                    text: option,
                })),
                onChange: onChange,
                selectedKey: selectedItem,
            },
        ],
        [
            dateRangeAnchorId,
            handleIssued,
            handleSelect,
            initialOption?.key,
            issuedDateRangeAnchorId,
            issuedText,
            networkCompanyOption,
            onChange,
            onChangeNetworkCompany,
            options,
            selectedDateRange,
            selectedIssuedDateRange,
            selectedItem,
            text,
        ]
    );

    return (
        <>
            {allItems?.length !== 0 && (
                <>
                    <FilterComponents filterProps={filterProps}>
                        <Stack
                            style={{
                                display: "flex",
                                flexDirection: "row",
                            }}
                        >
                            <StyledSearchBar onFilterChange={_onFilter} />
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
                    <Stack
                        style={{
                            width: "100%",
                            alignItems: "center",
                            marginBottom: 16,
                        }}
                        horizontal
                        horizontalAlign="space-between"
                    >
                        <StackItem
                            style={{
                                marginLeft: "auto",
                                marginRight: "50px",
                                display: "flex",
                            }}
                        >
                            <ActionButton
                                iconProps={clearIcon}
                                text="Clear Date filter"
                                onClick={() => {
                                    setDateRange({
                                        startDate: undefined,
                                        endDate: undefined,
                                        key: "selection",
                                    });
                                    setSelectedIssuedDate({
                                        startDate: undefined,
                                        endDate: undefined,
                                        key: "selection",
                                    });
                                }}
                            />
                        </StackItem>
                    </Stack>
                </>
            )}

            {filtered && (
                <StyledDetailsList
                    data={filtered}
                    columns={_columns}
                    emptymessage="No assets found"
                />
            )}
        </>
    );
};

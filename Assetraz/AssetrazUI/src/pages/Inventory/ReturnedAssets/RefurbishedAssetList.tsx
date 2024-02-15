import * as React from "react";
import { useEffect, useState } from "react";
import { IColumn } from "@fluentui/react/lib/DetailsList";
import {
    DefaultButton,
    DirectionalHint,
    Link,
    SearchBox,
    Stack,
    TooltipHost,
} from "@fluentui/react";
import { IDropdownOption } from "@fluentui/react";
import { RefurbishedAsset } from "../../../types/RefurbishedAsset";

import StyledDetailsList from "../../../components/common/StyledDetailsList";
import { Tooltip } from "../../../components/common/Tooltip";
import FilterComponents, {
    IFilterPropsDashboard,
} from "../../../components/common/FilterComponents";

import {
    calloutProps,
    hostStyles,
    infoButtonStyles,
} from "../../../components/common/TooltipStyles";
import {
    IReturnedContext,
    useReturnAssetContext,
} from "../../../Contexts/ReturnedAssetContext";

import { options, propertiesToCheck } from "./ReturnedPageConstants";
import { detailsListStyles } from "./ReturnedPagesStyles";
import { convertUTCDateToLocalDate } from "../../../Other/DateFormat";

export interface IDetailsListBasicExampleState {
    items: RefurbishedAsset[];
    selectionDetails: string;
}

interface Props {
    assets: RefurbishedAsset[];
    setRefurbishedAssetId: (inventoryId: string) => void;
    setAssetId: (inventoryId: string) => void;
}

export const RefurbishedAssetList: React.FunctionComponent<Props> = (props) => {
    const {
        allItems,
        filtered,
        networkCompanyOptions,
        setFiltered,
        initialOption,
        setInitialOption,
        selectedItem,
        setSelectedItem,
    } = useReturnAssetContext() as IReturnedContext;
    const { setRefurbishedAssetId, setAssetId } = props;
    const classes = detailsListStyles();

    const [filterQuery, setFilterQuery] = useState<string>("");

    const tooltipContent = React.useMemo(
        () => (
            <div>
                <strong>Search for a keyword in the columns:</strong>
                <div>
                    {propertiesToCheck.map((value, index) => (
                        <span key={index}>
                            {value}
                            {index !== propertiesToCheck.length - 1 && ", "}
                        </span>
                    ))}
                </div>
            </div>
        ),
        []
    );

    useEffect(() => {
        if (allItems?.length) {
            let filteredItems = allItems;

            if (initialOption?.key === "All Companies") {
                filteredItems = filteredItems?.filter(
                    (i) =>
                        i.status?.toLowerCase() === selectedItem?.toLowerCase()
                );
            } else {
                filteredItems = filteredItems?.filter(
                    (i) =>
                        i.status?.toLowerCase() ===
                            selectedItem?.toLowerCase() &&
                        i.networkCompanyName?.toLowerCase() ===
                            initialOption?.text.toLowerCase()
                );
            }

            filteredItems = filteredItems?.filter((i) => {
                const propertiesToCheck = [
                    i.categoryName,
                    i.manufacturerName,
                    i.modelNumber,
                    i.serialNumber,
                    i.returnedBy,
                    i.assetTagNumber,
                ];

                return propertiesToCheck.some(
                    (property) =>
                        property &&
                        property
                            ?.toLowerCase()
                            .includes(filterQuery.toLowerCase())
                );
            });
            setFiltered(filteredItems);
        }
    }, [
        selectedItem,
        allItems,
        initialOption?.key,
        initialOption?.text,
        filterQuery,
        setFiltered,
    ]);

    const _columns: IColumn[] = [
        {
            key: "categoryName",
            name: "Category",
            fieldName: "categoryName",
            minWidth: 120,
            isResizable: true,
            onRender: (item: RefurbishedAsset) => {
                if (item?.categoryName?.length > 20) {
                    return (
                        <div className={classes.tooltip}>
                            <Tooltip content={item.categoryName}>
                                {item?.categoryName}
                            </Tooltip>
                        </div>
                    );
                } else {
                    return item?.categoryName;
                }
            },
        },
        {
            key: "manufacturerName",
            name: "Manufacturer",
            fieldName: "manufacturerName",
            minWidth: 130,
            isResizable: true,
        },
        {
            key: "modelNumber",
            name: "Model Number",
            fieldName: "modelNumber",
            minWidth: 130,
            isResizable: true,
            onRender: (item: RefurbishedAsset) => {
                if (item?.modelNumber && item?.modelNumber?.length > 20) {
                    return (
                        <div className={classes.tooltip}>
                            <Tooltip content={item.modelNumber}>
                                {item?.modelNumber}
                            </Tooltip>
                        </div>
                    );
                } else {
                    return item?.modelNumber;
                }
            },
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
            minWidth: 110,
            isResizable: true,
        },
        {
            key: "assetTagNumber",
            name: "Asset Tag #",
            fieldName: "assetTagNumber",
            minWidth: 90,
            isResizable: true,
            onRender: (item: RefurbishedAsset) => {
                return (
                    <Link
                        onClick={(e) => {
                            e.preventDefault();
                            setRefurbishedAssetId(
                                item?.refurbishAssetId as string
                            );
                            setAssetId(item.inventoryId as string);
                        }}
                    >
                        {item?.assetTagNumber}
                    </Link>
                );
            },
        },
        {
            key: "returnDate",
            name: "Return Date",
            fieldName: "returnDate",
            minWidth: 90,
            isResizable: true,
        },
        {
            key: "returnedBy",
            name: "Returned By",
            fieldName: "returnedBy",
            minWidth: 130,
            isResizable: true,
            onRender: (item: RefurbishedAsset) => {
                if (item?.returnedBy?.length > 20) {
                    return (
                        <div className={classes.tooltip}>
                            <Tooltip content={item.returnedBy}>
                                {item?.returnedBy}
                            </Tooltip>
                        </div>
                    );
                } else {
                    return item?.returnedBy;
                }
            },
        },
        {
            key: "issuedBy",
            name: "Issued By",
            fieldName: "issuedBy",
            minWidth: 130,
            isResizable: true,
            onRender: (item: RefurbishedAsset) => {
                if (item?.issuedBy?.length > 20) {
                    return (
                        <div className={classes.tooltip}>
                            <Tooltip content={item.issuedBy}>
                                {item?.issuedBy}
                            </Tooltip>
                        </div>
                    );
                } else {
                    return item?.issuedBy;
                }
            },
        },
        {
            key: "reason",
            name: "Reason",
            fieldName: "reason",
            minWidth: 100,
            isResizable: true,
            onRender: (item: RefurbishedAsset) => {
                if (item?.reason && item?.reason?.length > 20) {
                    return (
                        <div className={classes.tooltip}>
                            <Tooltip content={item.reason}>
                                {item?.reason}
                            </Tooltip>
                        </div>
                    );
                } else {
                    return item?.reason;
                }
            },
        },
        {
            key: "status",
            name: "Refurbishment Status",
            fieldName: "status",
            minWidth: 160,
            isResizable: true,
        },
    ];

    const onChangeNetworkCompany = React.useCallback(
        (event: any, item: IDropdownOption<any> | undefined): void => {
            setInitialOption(item);
        },
        [setInitialOption]
    );

    const _onFilter = (
        ev: React.ChangeEvent<HTMLInputElement> | undefined,
        text: string
    ): void => {
        setFilterQuery(text);
        setFiltered(
            text
                ? filtered.filter(
                      (i) =>
                          i.categoryName
                              .toLowerCase()
                              .indexOf(text.toLowerCase()) > -1 ||
                          i.manufacturerName
                              .toLowerCase()
                              .indexOf(text.toLowerCase()) > -1 ||
                          (i.modelNumber &&
                              i.modelNumber
                                  .toLowerCase()
                                  .indexOf(text.toLowerCase()) > -1) ||
                          (i.warrentyDate &&
                              convertUTCDateToLocalDate(
                                  new Date(i.warrentyDate)
                              )
                                  .toLocaleDateString("en-GB", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                  })
                                  .indexOf(text.toLowerCase()) > -1) ||
                          (i.serialNumber &&
                              i.serialNumber
                                  .toLowerCase()
                                  .indexOf(text.toLowerCase()) > -1) ||
                          (i.returnedBy &&
                              i.returnedBy
                                  .toLowerCase()
                                  .indexOf(text.toLowerCase()) > -1) ||
                          (i.assetTagNumber &&
                              i.assetTagNumber
                                  .toLowerCase()
                                  .indexOf(text.toLowerCase()) > -1)
                  )
                : filtered
        );
    };

    const onChange = React.useCallback(
        (
            event: React.FormEvent<
                HTMLInputElement | HTMLTextAreaElement | undefined
            >,
            item: IDropdownOption<any> | undefined
        ): void => {
            item && setSelectedItem(item?.text);
        },
        [setSelectedItem]
    );

    const filterProps: IFilterPropsDashboard[] = React.useMemo(
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
                label: "Refurbishment Status",
                placeholder: "Refurbishment Status",
                options: Object.keys(options).map((option) => ({
                    key: option,
                    text: option,
                })),
                onChange: onChange,
                defaultSelectedKey: "Not Started",
                selectedKey: Object.keys(options).find(
                    (option) => option === selectedItem
                ),
            },
        ],
        [
            initialOption?.key,
            networkCompanyOptions,
            onChange,
            onChangeNetworkCompany,
            selectedItem,
        ]
    );

    return (
        <>
            {allItems.length !== 0 && (
                <Stack
                    className={classes.root}
                    horizontal
                    horizontalAlign="space-between"
                >
                    <FilterComponents filterProps={filterProps}>
                        <Stack
                            style={{
                                display: "flex",
                                flexDirection: "row",
                            }}
                        >
                            <SearchBox
                                placeholder="Search"
                                underlined={true}
                                onChange={(e, t) => _onFilter(e, t ?? "")}
                            />

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
                </Stack>
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

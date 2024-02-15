import React, { FC, useEffect, useState } from "react";
import IAsset from "../../types/Asset";
import {
    Dropdown,
    IColumn,
    IDropdownOption,
    IDropdownStyles,
    Stack,
    StackItem,
    Text,
} from "@fluentui/react";
import StyledSearchBar from "../../components/common/StyledSearchBar";
import StyledDetailsList from "../../components/common/StyledDetailsList";
import { convertDateToddMMMYYYFormat } from "../../Other/DateFormat";
import { sort } from "../../components/common/StyledDetailsList";
import { AssetStatus } from "../../constants/AssetStatus";
import { makeStyles } from "@fluentui/react-theme-provider";
import { getAssetbyUser } from "../../services/assetService";
import { IDocument } from "./DashboardTypes";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: { width: 200, border: "none" },
};

const DROPDOWN_OPTIONS = {
    Issued: "Issued",
    Returned: "Returned",
    All: "All",
};

interface MyAssetsComponentProps {
    getUserRequestData: () => Promise<void>;
    email: string;
}

const detailsListStyles = makeStyles(() => ({
    root: {
        width: "100%",
        marginBottom: "20px",
        backgroundColor: "#fff",
        padding: 16,
    },
    details: {},
    textField: {
        maxWidth: "300px",
    },
    table: {},
}));

const MyAssetsComponent: FC<MyAssetsComponentProps> = ({
    getUserRequestData,
    email,
}) => {
    const classes = detailsListStyles();
    const [columns, setColumns] = useState<IColumn[]>();
    const [assets, setAssets] = useState<IAsset[]>([]);
    const [isError, setIsError] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [filterQuery, setFilterQuery] = useState<string>("");
    const [selectedItem, setSelectedItem] = useState<string>(
        DROPDOWN_OPTIONS.Issued
    );
    const [selectedKey, setSelectedKey] = useState<
        IDropdownOption<any>[] | any
    >([DROPDOWN_OPTIONS.Issued]);

    useEffect(() => {
        setIsLoading(true);
        getAssetbyUser()
            .then((response: IAsset[]) => {
                setIsLoading(false);
                if (response.length > 0) {
                    let filteredAssetList: any = response.map(
                        (asset) =>
                            ({
                                inventoryId: asset.inventoryId,
                                categoryName: asset.categoryName,
                                assetStatus: asset.assetStatus,
                                key: asset.trackId,
                                name: asset.modelNumber,
                                modelNumber: asset.modelNumber,
                                serialNumber: asset.serialNumber,
                                assetTagNumber: asset.assetTagNumber,
                                reason: asset.reason,
                                issuedDate: asset.issuedDate,
                                returnDate: asset.returnDate,
                            } as unknown as IDocument)
                    );

                    setAssets(filteredAssetList);
                } else setAssets([]);
            })
            .catch((err) => {
                setIsLoading(false);
                setAssets([]);
                setIsError(true);
            });
        getUserRequestData();
    }, [email]);

    let filteredData = assets.filter(
        (i) =>
            i.categoryName.toLowerCase().indexOf(filterQuery.toLowerCase()) >
                -1 ||
            i.assetTagNumber?.toLowerCase().indexOf(filterQuery.toLowerCase()) >
                -1 ||
            i.serialNumber?.toLowerCase().indexOf(filterQuery.toLowerCase()) >
                -1 ||
            i.modelNumber?.toLowerCase().indexOf(filterQuery.toLowerCase()) > -1
    );

    filteredData =
        selectedItem !== DROPDOWN_OPTIONS.All
            ? selectedItem === DROPDOWN_OPTIONS.Issued
                ? filteredData.filter(
                      (i) => i.issuedDate !== null && i.returnDate == null
                  )
                : filteredData.filter((i) => i.returnDate !== null)
            : filteredData;

    const onChange = (
        event: React.FormEvent<HTMLDivElement>,
        item: IDropdownOption<any> | undefined
    ): void => {
        item && setSelectedItem(item.text);
        item && setSelectedKey(item.key);
    };

    const _onColumnClick = (
        event: React.MouseEvent<HTMLElement>,
        column: IColumn
    ): void => {
        const { newItems, newColumns } = sort(assets, column, sortedColumn);

        let sortedItems = newItems;
        if (column.key === "returnDate") {
            sortedItems = newItems.sort((a: IAsset, b: IAsset) => {
                if (a.returnDate && b.returnDate) {
                    return (
                        new Date(a.returnDate).getTime() -
                        new Date(b.returnDate).getTime()
                    );
                } else if (a.returnDate && !b.returnDate) {
                    return -1;
                } else if (!a.returnDate && b.returnDate) {
                    return 1;
                } else {
                    return 0;
                }
            });

            if (column.isSortedDescending) {
                sortedItems.reverse();
            }
        }
        setColumns([...newColumns]);
        setAssets([...sortedItems]);
    };

    const _myAssetColumns: IColumn[] = [
        {
            key: "categoryName",
            name: "Category",
            fieldName: "categoryName",
            minWidth: 150,
            isResizable: true,
        },
        {
            key: "assetTagNumber",
            name: "Asset Tag",
            fieldName: "assetTagNumber",
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
            key: "modelNumber",
            name: "Model Number",
            fieldName: "modelNumber",
            minWidth: 150,
            isResizable: true,
        },
        {
            key: "assetStatus",
            name: "Status",
            fieldName: "assetStatus",
            minWidth: 150,
            isResizable: true,
            onRender(item) {
                return item.assetStatus === AssetStatus.Issued &&
                    item.returnDate == null
                    ? item.assetStatus
                    : `Returned  (${item.reason
                          ?.match(/[A-Z][a-z]+|[0-9]+/g)
                          .join(" ")})`;
            },
        },
        {
            key: "issuedDate",
            name: "Issued Date",
            fieldName: "issuedDate",
            minWidth: 125,
            onColumnClick: _onColumnClick,
            onRender: (item: IAsset) =>
                convertDateToddMMMYYYFormat(item.issuedDate),
            isResizable: true,
            isSorted: true,
            isSortedDescending: true,
        },
        {
            key: "returnDate",
            name: "Returned Date",
            fieldName: "returnDate",
            minWidth: 125,
            onColumnClick: _onColumnClick,
            onRender: (item: IAsset) =>
                convertDateToddMMMYYYFormat(item.returnDate),
            isResizable: true,
            isSorted: false,
            isSortedDescending: true,
        },
    ];

    const sortedColumn = columns ?? _myAssetColumns;
    return (
        <>
            {assets && !isError && !isLoading ? (
                <>
                    {assets.length > 0 ? (
                        <>
                            <Stack
                                className={classes.root}
                                horizontal
                                horizontalAlign="space-between"
                            >
                                <StackItem>
                                    <StyledSearchBar
                                        onFilterChange={setFilterQuery}
                                    />
                                </StackItem>
                                <StackItem>
                                    <Dropdown
                                        placeholder="Status"
                                        selectedKey={selectedKey}
                                        options={Object.keys(
                                            DROPDOWN_OPTIONS
                                        ).map((option) => ({
                                            key: option,
                                            text: option,
                                        }))}
                                        onChange={onChange}
                                        styles={dropdownStyles}
                                    />
                                </StackItem>
                            </Stack>
                        </>
                    ) : null}
                    <div
                        style={{
                            display: "flex",
                            flexFlow: "column nowrap",
                            alignItems: "center",
                        }}
                    >
                        <StyledDetailsList
                            data={filteredData}
                            columns={sortedColumn.filter((column) => {
                                return !(
                                    column.key === "returnDate" &&
                                    selectedItem === DROPDOWN_OPTIONS.Issued
                                );
                            })}
                            emptymessage="No assets found"
                        />
                    </div>
                </>
            ) : isError ? (
                <Text style={{ margin: "8px" }} variant={"large"} block>
                    Something went wrong
                </Text>
            ) : (
                <LoadingSpinner />
            )}
        </>
    );
};

export default MyAssetsComponent;

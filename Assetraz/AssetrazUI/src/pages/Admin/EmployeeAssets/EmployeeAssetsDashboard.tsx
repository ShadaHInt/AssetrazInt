import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    IColumn,
    IDropdownOption,
    Separator,
    Spinner,
    Stack,
    TextField,
} from "@fluentui/react";

import { Text } from "@fluentui/react/lib/Text";
import PageTemplate from "../../../components/common/PageTemplate";
import { getAllEmployees } from "../../../services/user/userServices";
import { User } from "../../../types/User";
import StyledDetailsList, {
    sort,
} from "../../../components/common/StyledDetailsList";
import { SearchableDropdown } from "../../../components/common/SearchableDropdown";
import { getAssetbyUser } from "../../../services/assetService";
import IAsset from "../../../types/Asset";
import { IDocument } from "../../Home/DashboardTypes";
import { AssetStatus } from "../../../constants/AssetStatus";
import { convertDateToddMMMYYYFormat } from "../../../Other/DateFormat";
import {
    dropdownStyles,
    inlineInputStyle,
    input50,
    stackItemStyles,
} from "./EmployeeAssetsStyles";
import FilterComponents, {
    IFilterPropsDashboard,
} from "../../../components/common/FilterComponents";

const STATUS_OPTIONS = { Issued: "Issued", Returned: "Returned", All: "All" };

export const EmployeeAssetsDashboard = () => {
    const [employeesListOptions, setEmployeesListOptions] =
        useState<any>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [assets, setAssets] = useState<IAsset[] | undefined>([]);
    const [columns, setColumns] = useState<IColumn[]>();
    const [employeeName, setEmployeeName] = useState<string>();
    const [selectedStatus, setSelectedStatus] = useState<string>(
        STATUS_OPTIONS.Issued
    );
    const [filteredAssets, setFilteredAssets] = useState<IAsset[] | undefined>(
        []
    );

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getAllEmployees();
                transformEmployeesForListing(res);
            } catch (err) {
                setEmployeesListOptions(null);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        let filteredData =
            selectedStatus !== STATUS_OPTIONS.All
                ? selectedStatus === STATUS_OPTIONS.Returned
                    ? assets?.filter((i) => i.returnDate != null)
                    : assets?.filter(
                          (i) => i.issuedDate != null && i.returnDate == null
                      )
                : assets;
        setFilteredAssets(filteredData);
    }, [assets, selectedStatus]);

    useEffect(() => {
        if (employeeName) {
            try {
                const fetchUserAssets = async () => {
                    setIsLoading(true);
                    var userAssets = await getAssetbyUser(employeeName);
                    if (userAssets?.length > 0) {
                        let filteredAssetList: any = userAssets?.map(
                            (asset: any) =>
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
                        setIsLoading(false);
                    } else {
                        setAssets([]);
                        setIsLoading(false);
                    }
                };
                if (employeeName?.length > 0) fetchUserAssets();
            } catch (err) {
                setAssets(undefined);
            }
        }
    }, [employeeName]);

    const transformEmployeesForListing = (employeesList: User[]): void => {
        const empList: IDropdownOption[] = employeesList.map((r: User) => ({
            key: r.mail,
            text: r.displayName + " (" + r.jobTitle + ")",
        }));
        setEmployeesListOptions(empList);
    };

    const changeHandler = (e: any, option: any) => {
        setEmployeeName(option.key);
    };

    const _onColumnClick = useCallback(
        (event: React.MouseEvent<HTMLElement>, column: IColumn): void => {
            const { newItems, newColumns } = sort(
                filteredAssets!,
                column,
                sortedColumn
            );
            let sortedItems = newItems;
            setColumns([...newColumns]);
            setFilteredAssets([...sortedItems]);
        },
        [filteredAssets]
    );

    const filterProps: IFilterPropsDashboard[] = useMemo(
        () => [
            {
                type: "dropdown",
                label: "Status",
                placeholder: "Status",
                options:
                    Object.keys(STATUS_OPTIONS).map((option) => ({
                        key: option,
                        text: option,
                    })) ?? [],
                onChange: (e: any, item: IDropdownOption<any> | undefined) => {
                    item && setSelectedStatus(item?.text);
                },
                selectedKey: Object.keys(STATUS_OPTIONS).find(
                    (option) =>
                        option.toLowerCase() === selectedStatus?.toLowerCase()
                ),
            },
        ],
        [selectedStatus]
    );

    const _columns: IColumn[] = [
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
            onRender: (item: IAsset) =>
                convertDateToddMMMYYYFormat(item.returnDate),
            isResizable: true,
            isSorted: false,
            isSortedDescending: true,
        },
    ];

    const sortedColumn = columns ?? _columns;

    return (
        <PageTemplate heading="Assets Issued to Employee">
            <Stack horizontal styles={stackItemStyles}>
                <SearchableDropdown
                    options={employeesListOptions}
                    onChange={changeHandler}
                    placeholder="Select an employee"
                    label={"Employee"}
                    styles={dropdownStyles}
                    selectedKey={employeeName}
                />
                <Stack.Item styles={input50}>
                    <TextField
                        readOnly
                        styles={inlineInputStyle}
                        borderless
                        name="mail"
                        value={employeeName}
                    />
                </Stack.Item>
                <FilterComponents filterProps={filterProps}>
                    <Stack
                        style={{
                            display: "flex",
                            flexDirection: "row",
                        }}
                    ></Stack>
                </FilterComponents>
            </Stack>
            <Separator />
            {isLoading ? (
                <Spinner />
            ) : employeeName && employeeName?.length > 0 ? (
                <StyledDetailsList
                    data={filteredAssets ?? []}
                    columns={_columns}
                    emptymessage="No assets found"
                />
            ) : (
                <Text variant="small">Please select a user</Text>
            )}
        </PageTemplate>
    );
};

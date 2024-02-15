import * as React from "react";
import {
    ActionButton,
    DefaultButton,
    DirectionalHint,
    IColumn,
    IDropdownOption,
    Stack,
    TooltipHost,
} from "@fluentui/react";
import {
    IUpdateAssetsContext,
    useUpdateAssetContext,
} from "../../../Contexts/UpdateAssetsContext";
import { convertUTCDateToLocalDate } from "../../../Other/DateFormat";
import { AssetDetails } from "../../../types/Asset";
import StyledDetailsList, {
    sort,
} from "../../../components/common/StyledDetailsList";
import PageTemplate from "../../../components/common/PageTemplate";
import FilterComponents, {
    IFilterPropsDashboard,
} from "../../../components/common/FilterComponents";
import StyledSearchBar from "../../../components/common/StyledSearchBar";
import {
    calloutProps,
    hostStyles,
    infoButtonStyles,
} from "../../../components/common/TooltipStyles";
import { useCallback, useMemo, useState } from "react";
import { UPDATE_ASSETS_FILTER_COLUMNS } from "./UpdateAssetConstants";
import { UpdateAssetModal } from "./UpdateAssetModal";

export const UpdateAssetsDashboard = () => {
    const {
        assets,
        errorMessage,
        setErrorMessage,
        isLoading,
        filteredAssets,
        networkCompanyOptions,
        selectedNetworkCompany,
        setSelectedNetworkCompany,
        setFilterQuery,
        setAssets,
    } = useUpdateAssetContext() as IUpdateAssetsContext;

    const [columns, setColumns] = useState<IColumn[]>();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedAsset, setSelectedAsset] = useState<AssetDetails>();
    const [successMessage, setSuccessMessage] = useState<string>("");

    const _onColumnClick = (
        event: React.MouseEvent<HTMLElement>,
        column: IColumn
    ): void => {
        const { newItems, newColumns } = sort(assets, column, sortedColumn);
        setColumns(newColumns);

        setAssets(newItems);
    };

    const tooltipContent = useMemo(
        () => (
            <div>
                <strong>Search for a keyword in the columns:</strong>
                <div>
                    {UPDATE_ASSETS_FILTER_COLUMNS.map((value, index) => (
                        <span key={index}>
                            {value}
                            {index !==
                                UPDATE_ASSETS_FILTER_COLUMNS.length - 1 && ", "}
                        </span>
                    ))}
                </div>
            </div>
        ),
        []
    );

    const onChangeNetworkCompany = useCallback(
        (event: any, item: IDropdownOption<any> | undefined): void => {
            item && setSelectedNetworkCompany(item);
        },
        [setSelectedNetworkCompany]
    );

    const closeModal = (isSuccess?: boolean) => {
        if (isSuccess) {
            setSuccessMessage("Successfully saved");
        }
        setIsModalOpen(false);
    };

    const filterProps: IFilterPropsDashboard[] = useMemo(
        () => [
            {
                type: "dropdown",
                label: "Network Company",
                placeholder: "Network Company",
                options: networkCompanyOptions ?? [],
                onChange: onChangeNetworkCompany,
                defaultSelectedKey: selectedNetworkCompany?.key,
                selectedKey: selectedNetworkCompany?.key,
            },
        ],
        [
            networkCompanyOptions,
            onChangeNetworkCompany,
            selectedNetworkCompany?.key,
        ]
    );

    const _columns: IColumn[] = [
        {
            key: "categoryName",
            name: "Category",
            fieldName: "categoryName",
            minWidth: 120,
            maxWidth: 130,
            isResizable: true,
        },
        {
            key: "manufacturer",
            name: "Manufacturer",
            fieldName: "manufacturerName",
            minWidth: 100,
            maxWidth: 120,
            isResizable: true,
        },
        {
            key: "networkCompanyName",
            name: "Network Company",
            fieldName: "networkCompanyName",
            minWidth: 120,
            maxWidth: 150,
            isResizable: true,
        },
        {
            key: "serialNumber",
            name: "Serial Number",
            fieldName: "serialNumber",
            minWidth: 100,
            maxWidth: 120,
            isResizable: true,
        },
        {
            key: "modelNumber",
            name: "Model Number",
            fieldName: "modelNumber",
            minWidth: 100,
            maxWidth: 120,
            isResizable: true,
        },
        {
            key: "warrantyDate",
            name: "Warranty Date",
            fieldName: "warrantyDate",
            minWidth: 100,
            maxWidth: 120,
            isResizable: true,
            onRender: (item: AssetDetails) =>
                item.warrantyDate &&
                convertUTCDateToLocalDate(
                    new Date(item.warrantyDate)
                ).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                }),
            isSorted: true,
            isSortedDescending: true,
            onColumnClick: _onColumnClick,
        },
        {
            key: "assetTagNumber",
            name: "Asset Tag Number",
            fieldName: "assetTagNumber",
            minWidth: 120,
            maxWidth: 150,
            isResizable: true,
        },
        {
            key: "edit",
            name: "Action",
            minWidth: 50,
            isResizable: true,
            onRender: (item: AssetDetails) => {
                return (
                    <ActionButton
                        iconProps={{
                            iconName: "EditNote",
                            style: { fontSize: 14 },
                        }}
                        onClick={() => {
                            setIsModalOpen(true);
                            setSelectedAsset(item);
                        }}
                    ></ActionButton>
                );
            },
        },
    ];

    const sortedColumn = columns ?? _columns;

    return (
        <PageTemplate
            heading="Update Asset Details"
            isLoading={isLoading}
            errorMessage={errorMessage}
            clearErrorMessage={() => setErrorMessage("")}
            successMessageBar={successMessage}
            setSuccessMessageBar={() => setSuccessMessage("")}
        >
            {assets.length > 0 ? (
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
            {assets && (
                <StyledDetailsList
                    data={filteredAssets}
                    columns={sortedColumn}
                    emptymessage="No requests found"
                />
            )}
            {isModalOpen && (
                <UpdateAssetModal
                    isModalOpen={isModalOpen}
                    selectedAsset={selectedAsset}
                    closeModal={closeModal}
                />
            )}
        </PageTemplate>
    );
};

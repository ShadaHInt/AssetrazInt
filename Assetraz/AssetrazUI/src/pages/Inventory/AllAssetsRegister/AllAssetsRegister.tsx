import {
    DefaultButton,
    DirectionalHint,
    IDropdownOption,
    IconButton,
    IIconProps,
    Spinner,
    SpinnerSize,
    Stack,
    StackItem,
    TooltipHost,
    Link,
} from "@fluentui/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useId } from "@fluentui/react-hooks";

import {
    convertDateToddMMMYYYFormat,
    convertUTCDateToLocalDate,
} from "../../../Other/DateFormat";
import PageTemplate from "../../../components/common/PageTemplate";
import StyledDetailsList from "../../../components/common/StyledDetailsList";

import FilterComponents, {
    IFilterPropsDashboard,
} from "../../../components/common/FilterComponents";
import StyledSearchBar from "../../../components/common/StyledSearchBar";
import {
    calloutProps,
    hostStyles,
} from "../InvoiceRegister/StockReceipt.styles";
import { infoButtonStyles } from "../../../components/common/TooltipStyles";

import { NetworkCompany } from "../../../types/NetworkCompany";
import { IAllAsset } from "../../../types/AllAsset";
import { useAsync } from "../../../services/hooks/UseAsync";

import {
    DROPDOWN_INITIALOPTION,
    FILTER_COLUMNS,
} from "./AllAssetsInvoiceRegisterConstants";

import { GetAllNetworkCompanies } from "../../../services/networkCompanyService";
import { GetAllAssetsList } from "../../../services/AllAssetsRegisterService";
import { DownloadInvoice } from "../../../services/invoiceService";
import { DownloadSupportDocument } from "../../../services/assetService";

import { detailsListStyles } from "../../../pages/Admin/ProcurementPage/ProcurementPage.styles";

const AllAssetsRegister: React.FC<{
    isAccountsAdmin: boolean;
}> = ({ isAccountsAdmin }) => {
    const classes = detailsListStyles();
    const infoIcon: IIconProps = { iconName: "Info" };
    const buttonId = useId("callout-button");

    const [operationSuccess, setOperationSuccess] = useState<string>();
    const [errorMessage, setErrorMessage] = useState<string>();
    const {
        status: reqStatus,
        data: allAssets,
        error: isError,
    } = useAsync(GetAllAssetsList, true);

    const [invoiceDownloading, setIsInvoiceDownloading] = useState<
        boolean | undefined
    >(undefined);

    const [downloadingItemId, setDownloadingItemId] = useState<string | null>(
        null
    );

    const [otherSourceDownloading, setIsOtherSourceDownloading] = useState<
        boolean | undefined
    >(undefined);

    const [downloadingOtherSourceItemId, setDownloadingOtherSourceItemId] =
        useState<string | null>(null);

    const [filterQuery, setFilterQuery] = useState<string>("");
    const [filteredDate, setFilteredData] = useState<IAllAsset[]>([]);
    const [networkCompanyOptions, setNetworkCompanyOptions] = useState<
        IDropdownOption<NetworkCompany>[]
    >([]);
    const [selectedNetworkCompany, setSelectedNetworkCompany] =
        useState<IDropdownOption<NetworkCompany>>();

    useEffect(() => {
        const allNetworkCompanies = async () => {
            try {
                const networkCompanies = await GetAllNetworkCompanies();
                networkCompanies.unshift(DROPDOWN_INITIALOPTION);
                setNetworkCompanyOptions(networkCompanies);
                const initialOption = networkCompanies.find(
                    (i: NetworkCompany) => i.isPrimary === true
                );
                setSelectedNetworkCompany(
                    initialOption ?? DROPDOWN_INITIALOPTION
                );
            } catch (err: any) {
                setErrorMessage(err);
            }
        };
        allNetworkCompanies();
    }, []);

    useEffect(() => {
        if (allAssets) {
            let filteredData = allAssets?.filter(
                (i: IAllAsset) =>
                    i.categoryName
                        ?.toLowerCase()
                        .indexOf(filterQuery?.toLowerCase()) > -1 ||
                    i.manufacturerName
                        ?.toLowerCase()
                        .indexOf(filterQuery?.toLowerCase()) > -1 ||
                    (i.modelNumber &&
                        i.modelNumber
                            ?.toLowerCase()
                            .indexOf(filterQuery?.toLowerCase()) > -1) ||
                    (i.serialNumber &&
                        i.serialNumber
                            ?.toLowerCase()
                            .indexOf(filterQuery?.toLowerCase()) > -1) ||
                    (i.assetTagNumber &&
                        i.assetTagNumber
                            ?.toLowerCase()
                            .indexOf(filterQuery?.toLowerCase()) > -1)
            );

            filteredData =
                selectedNetworkCompany?.key !== DROPDOWN_INITIALOPTION.key
                    ? filteredData.filter(
                          (i: IAllAsset) =>
                              i.networkCompanyId === selectedNetworkCompany?.key
                      )
                    : filteredData;
            setFilteredData(filteredData);
        }
    }, [filterQuery, allAssets, selectedNetworkCompany?.key]);

    const onChangeNetworkCompany = useCallback(
        (
            event: any,
            item: IDropdownOption<NetworkCompany> | undefined
        ): void => {
            item && setSelectedNetworkCompany(item);
        },
        [setSelectedNetworkCompany]
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

    const invoiceDownloadHandler = async (item: IAllAsset) => {
        setDownloadingItemId(item?.inventoryId as string);
        setIsInvoiceDownloading(true);
        try {
            const response = await DownloadInvoice(
                item.invoiceId as string,
                item.invoiceFileName as string
            );
            setIsInvoiceDownloading(false);
            if (response === true) {
                setOperationSuccess("Invoice file downloaded successfully");
            } else {
                setErrorMessage("Invoice file downloaded failed");
            }
        } catch (err: any) {
            setIsInvoiceDownloading(false);
            setErrorMessage(err);
        }
    };

    const otherSourceDocumentdownloadHandler = async (item: IAllAsset) => {
        setDownloadingOtherSourceItemId(item?.inventoryOtherSourceId as string);
        setIsOtherSourceDownloading(true);
        try {
            const response = await DownloadSupportDocument(
                item.inventoryOtherSourceId as string,
                item.supportingFileName as string
            );
            setIsOtherSourceDownloading(false);
            if (response === true) {
                setOperationSuccess("Invoice file downloaded successfully");
            } else {
                setErrorMessage("Invoice file downloaded failed");
            }
        } catch (err: any) {
            setIsOtherSourceDownloading(false);
            setErrorMessage(err);
        }
    };

    const filterProps: IFilterPropsDashboard[] = React.useMemo(
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

    const _columns = [
        {
            key: "networkCompanyName",
            name: "Network Company",
            fieldName: "networkCompanyName",
            minWidth: 100,
            maxWidth: 130,
            isResizable: true,
        },
        {
            key: "categoryName",
            name: "Category",
            fieldName: "categoryName",
            minWidth: 90,
            maxWidth: 100,
            isResizable: true,
        },
        {
            key: "manufacturerName",
            name: "Manufacturer",
            fieldName: "manufacturerName",
            minWidth: 90,
            maxWidth: 100,
            isResizable: true,
        },
        {
            key: "modelNumber",
            name: "Model Number",
            fieldName: "modelNumber",
            minWidth: 80,
            maxWidth: 100,
            isResizable: true,
        },
        {
            key: "serialNumber",
            name: "Serial Number",
            fieldName: "serialNumber",
            minWidth: 90,
            maxWidth: 120,
            isResizable: true,
        },
        {
            key: "assetTagNumber",
            name: "Asset Tag #",
            fieldName: "assetTagNumber",
            minWidth: 80,
            maxWidth: 100,
            isResizable: true,
        },
        {
            key: "invoice",
            name: "Invoice",
            fieldName: "invoice",
            minWidth: 50,
            maxWidth: 50,
            isResizable: true,
            onRender: (item: IAllAsset) => {
                return item.invoiceNumber ? (
                    invoiceDownloading &&
                    downloadingItemId === item.inventoryId ? (
                        <Spinner size={SpinnerSize.small} />
                    ) : (
                        <Stack
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <IconButton
                                iconProps={{
                                    iconName: "Download",
                                    style: {
                                        color: "black",
                                    },
                                }}
                                onClick={() => invoiceDownloadHandler(item)}
                                styles={{
                                    root: {
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    },
                                }}
                            />
                        </Stack>
                    )
                ) : null;
            },
        },
        {
            key: "supportingDocument",
            name: "Supporting Doc",
            fieldName: "supportingDocument",
            minWidth: 100,
            maxWidth: 130,
            isResizable: true,
            onRender: (item: IAllAsset) => {
                return item.documentNumber ? (
                    otherSourceDownloading &&
                    downloadingOtherSourceItemId ===
                        item.inventoryOtherSourceId ? (
                        <Spinner size={SpinnerSize.small} />
                    ) : (
                        <Stack
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <IconButton
                                iconProps={{
                                    iconName: "Download",
                                    style: {
                                        color: "black",
                                    },
                                }}
                                onClick={() =>
                                    otherSourceDocumentdownloadHandler(item)
                                }
                                styles={{
                                    root: {
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    },
                                }}
                            />
                        </Stack>
                    )
                ) : null;
            },
        },
        {
            key: "moreInfo",
            name: "More Info",
            fieldName: "moreInfo",
            minWidth: 80,
            maxWidth: 130,
            isResizable: true,
            onRender: (item: IAllAsset) => {
                return (
                    <Link>
                        <TooltipHost
                            content={
                                <table className={classes.table}>
                                    <thead>
                                        <tr>
                                            <th
                                                className={classes.tableData}
                                                colSpan={2}
                                            >
                                                Details
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr key={Math.random()}>
                                            <td className={classes.tableData}>
                                                Invoice Number
                                            </td>
                                            <td className={classes.tableData}>
                                                {item.invoiceNumber}
                                            </td>
                                        </tr>
                                        <tr key={Math.random()}>
                                            <td className={classes.tableData}>
                                                Invoice Date
                                            </td>
                                            <td className={classes.tableData}>
                                                {item && item.invoiceDate
                                                    ? convertUTCDateToLocalDate(
                                                          item?.invoiceDate
                                                      ).toLocaleDateString(
                                                          "en-GB",
                                                          {
                                                              day: "2-digit",
                                                              month: "short",
                                                              year: "numeric",
                                                          }
                                                      )
                                                    : null}
                                            </td>
                                        </tr>
                                        <tr key={Math.random()}>
                                            <td className={classes.tableData}>
                                                PO #
                                            </td>
                                            <td className={classes.tableData}>
                                                {item.purchaseOrderNumber}
                                            </td>
                                        </tr>
                                        <tr key={Math.random()}>
                                            <td className={classes.tableData}>
                                                PO Date
                                            </td>
                                            <td className={classes.tableData}>
                                                {item && item.poGeneratedOn
                                                    ? convertDateToddMMMYYYFormat(
                                                          item?.poGeneratedOn
                                                      )
                                                    : null}
                                            </td>
                                        </tr>
                                        <tr key={Math.random()}>
                                            <td className={classes.tableData}>
                                                Other Source Document ID
                                            </td>
                                            <td className={classes.tableData}>
                                                {item.documentID}
                                            </td>
                                        </tr>
                                        <tr key={Math.random()}>
                                            <td className={classes.tableData}>
                                                Other Source Supporting Doc#
                                            </td>
                                            <td className={classes.tableData}>
                                                {item.documentNumber}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            }
                        >
                            <IconButton iconProps={infoIcon} id={buttonId} />
                        </TooltipHost>
                    </Link>
                );
            },
        },
    ];

    return (
        <Stack>
            <PageTemplate
                heading="Assets Register"
                isLoading={reqStatus === "pending"}
                errorOccured={isError || errorMessage !== undefined}
                successMessageBar={operationSuccess}
                setSuccessMessageBar={setOperationSuccess}
                errorMessage={errorMessage}
                clearErrorMessage={() => setErrorMessage(undefined)}
            >
                {allAssets && allAssets?.length > 0 ? (
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
                            <StackItem
                                style={{
                                    marginLeft: "auto",
                                    marginRight: "50px",
                                    display: "flex",
                                }}
                            >
                                Total Asset Count : {allAssets?.length}
                            </StackItem>

                            <StackItem
                                style={{
                                    marginLeft: "auto",
                                    marginRight: "50px",
                                    display: "flex",
                                }}
                            >
                                Filtered Asset Count : {filteredDate?.length}
                            </StackItem>
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
                            ></StackItem>
                        </Stack>
                    </>
                ) : null}
                {reqStatus === "success" && allAssets ? (
                    <StyledDetailsList
                        data={filteredDate as IAllAsset[]}
                        columns={_columns}
                        emptymessage="No assets found"
                    />
                ) : null}
            </PageTemplate>
        </Stack>
    );
};

export default AllAssetsRegister;

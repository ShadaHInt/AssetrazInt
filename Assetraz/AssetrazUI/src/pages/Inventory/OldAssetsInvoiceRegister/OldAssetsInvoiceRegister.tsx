import {
    ActionButton,
    Checkbox,
    DefaultButton,
    DirectionalHint,
    IColumn,
    IDropdownOption,
    IIconProps,
    IconButton,
    Link,
    PrimaryButton,
    Spinner,
    SpinnerSize,
    Stack,
    StackItem,
    TooltipHost,
} from "@fluentui/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Range, RangeKeyDict } from "react-date-range";
import { useId } from "@fluentui/react-hooks";
import {
    convertDateToGBFormat,
    convertUTCDateToLocalDate,
} from "../../../Other/DateFormat";
import PageTemplate from "../../../components/common/PageTemplate";
import StyledDetailsList from "../../../components/common/StyledDetailsList";
import { GetOldAssets } from "../../../services/OldAssetsService";
import { IOldAsset } from "../../../types/OldAsset";
import { useAsync } from "../../../services/hooks/UseAsync";
import { useBoolean } from "@fluentui/react-hooks";
import OldAssetsModal from "./OldAssetsModal";
import { DownloadInvoice } from "../../../services/invoiceService";
import FilterComponents, {
    IFilterPropsDashboard,
} from "../../../components/common/FilterComponents";
import StyledSearchBar from "../../../components/common/StyledSearchBar";
import {
    calloutProps,
    hostStyles,
} from "../InvoiceRegister/StockReceipt.styles";
import { NetworkCompany } from "../../../types/NetworkCompany";
import { GetAllNetworkCompanies } from "../../../services/networkCompanyService";
import { infoButtonStyles } from "../../../components/common/TooltipStyles";
import {
    DROPDOWN_INITIALOPTION,
    FILTER_COLUMNS,
} from "./OldAssetsInvoiceRegisterConstants";

const OldAssetsInvoiceRegister: React.FC<{
    isAccountsAdmin: boolean;
}> = ({ isAccountsAdmin }) => {
    const [operationSuccess, setOperationSuccess] = useState<string>();
    const [errorMessage, setErrorMessage] = useState<string>();
    const {
        execute,
        status: oldAssetStatus,
        data: oldAssets,
        error: isError,
    } = useAsync(GetOldAssets, true);

    const [selectedAssets, setSelectedAssets] = useState<IOldAsset[]>([]);
    const [isModalOpen, { toggle: setIsModalOpen }] = useBoolean(false);
    const [selectedReferenceNumber, setSelectedReferenceNumber] = useState<
        string | undefined
    >();
    const [selectedReferenceIdAssets, setSelectedReferenceIdAssets] = useState<
        IOldAsset[]
    >([]);
    const [invoiceDownloading, setIsInvoiceDownloading] = useState<
        boolean | undefined
    >(undefined);
    const [downloadingItemId, setDownloadingItemId] = useState<string | null>(
        null
    );
    const [filterQuery, setFilterQuery] = useState<string>("");
    const [filteredDate, setFilteredData] = useState<IOldAsset[]>([]);
    const [networkCompanyOptions, setNetworkCompanyOptions] = useState<
        IDropdownOption<NetworkCompany>[]
    >([]);
    const [selectedNetworkCompany, setSelectedNetworkCompany] =
        useState<IDropdownOption<NetworkCompany>>();

    const clearIcon: IIconProps = { iconName: "ClearFilter" };

    let today = new Date();
    let next30Days = new Date();
    next30Days.setDate(today.getDate() + 30);

    let DATE_RANGE = {
        startDate: undefined,
        endDate: undefined,
        key: "selection",
    };

    const [selectedDateRange, setDateRange] = useState<Range>(DATE_RANGE);

    const id = "warrantyDate";
    const dateRangeAnchorId = useId(`date-range-anchor-${id}`);

    let text = "Select date range";
    if (selectedDateRange?.startDate || selectedDateRange?.endDate) {
        text = `${convertDateToGBFormat(
            selectedDateRange?.startDate
        )} - ${convertDateToGBFormat(selectedDateRange?.endDate)}`;
    }

    const isButtonDisabled = selectedAssets?.length === 0;

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
        if (oldAssets) {
            let filteredData = oldAssets?.filter(
                (i: IOldAsset) =>
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
                          (i: IOldAsset) =>
                              i.networkCompanyId === selectedNetworkCompany?.key
                      )
                    : filteredData;

            if (
                selectedDateRange.startDate !== undefined &&
                selectedDateRange.endDate !== undefined
            ) {
                filteredData = filteredData.filter((item) => {
                    const warrantyDate =
                        item.warrantyDate &&
                        convertUTCDateToLocalDate(item.warrantyDate);
                    const endDate = new Date(selectedDateRange.endDate!);

                    endDate.setDate(endDate.getDate());
                    return (
                        selectedDateRange.startDate &&
                        endDate &&
                        warrantyDate != null &&
                        warrantyDate >= selectedDateRange.startDate &&
                        warrantyDate <= endDate!
                    );
                });
            }
            setFilteredData(filteredData);
        }
    }, [
        filterQuery,
        oldAssets,
        selectedDateRange,
        selectedNetworkCompany?.key,
    ]);

    const onChangeNetworkCompany = useCallback(
        (
            event: any,
            item: IDropdownOption<NetworkCompany> | undefined
        ): void => {
            item && setSelectedNetworkCompany(item);
        },
        [setSelectedNetworkCompany]
    );

    const handleSelect = useCallback(
        (ranges: RangeKeyDict) => {
            setDateRange(ranges.selection);
        },
        [setDateRange]
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

    const AddInvoiceButton = () => {
        return !isAccountsAdmin ? (
            <PrimaryButton
                text="Add Invoice"
                styles={{
                    root: {
                        marginRight: 16,
                    },
                }}
                onClick={(event) => handleClick(event)}
                disabled={isButtonDisabled}
            />
        ) : null;
    };

    const handleClick = (event: any) => {
        if (selectedAssets.length !== 0) {
            setIsModalOpen();
        }
    };

    const handleClickReferenceNumber = (item: IOldAsset) => {
        setSelectedReferenceNumber(item?.referenceNumber as string);
        setIsModalOpen();
        const assets = oldAssets
            ?.filter((asset) => asset.referenceNumber === item.referenceNumber)
            .map((data) => data);
        if (assets) {
            setSelectedReferenceIdAssets(assets);
        }
    };

    const dismissPanel = useCallback(
        (isSuccess: any) => {
            if (isSuccess) {
                setOperationSuccess("Successfully Updated");
                execute();
                setSelectedAssets([]);
                setSelectedReferenceIdAssets([]);
            }
            setIsModalOpen();
            setSelectedReferenceIdAssets([]);
            setSelectedReferenceNumber(undefined);
        },
        [execute, setSelectedReferenceNumber, setSelectedAssets, setIsModalOpen]
    );

    const invoiceDownloadHandler = async (item: IOldAsset) => {
        setDownloadingItemId(item?.inventoryId as string);
        setIsInvoiceDownloading(true);
        try {
            const response = await DownloadInvoice(
                item.invoiceId as string,
                item.fileName as string
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
            dateRangeAnchorId,
            handleSelect,
            networkCompanyOptions,
            onChangeNetworkCompany,
            selectedDateRange,
            selectedNetworkCompany?.key,
            text,
        ]
    );

    const _commonColumns = [
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
            minWidth: 90,
            maxWidth: 100,
            isResizable: true,
        },
        {
            key: "warrantyDate",
            name: "Warranty Date",
            fieldName: "warrantyDate",
            minWidth: 90,
            maxWidth: 100,
            isResizable: true,
            onRender: (item: IOldAsset) =>
                item.warrantyDate &&
                convertUTCDateToLocalDate(
                    new Date(item.warrantyDate)
                ).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                }),
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
            key: "assetTagNumber",
            name: "Asset Tag Number",
            fieldName: "assetTagNumber",
            minWidth: 150,
            maxWidth: 130,
            isResizable: true,
        },
        {
            key: "referenceNumber",
            name: "Reference Number",
            fieldName: "referenceNumber",
            minWidth: 100,
            maxWidth: 130,
            isResizable: true,
            onRender: (item: IOldAsset) => {
                return (
                    <Link
                        onClick={(e) => {
                            e.preventDefault();
                            handleClickReferenceNumber(item);
                        }}
                    >
                        <TooltipHost
                            content={item.referenceNumber?.toUpperCase()}
                        >
                            {item.referenceNumber?.toUpperCase()}
                        </TooltipHost>
                    </Link>
                );
            },
        },
        {
            key: "invoiceNumber",
            name: "Invoice Number",
            fieldName: "invoiceNumber",
            minWidth: 100,
            maxWidth: 130,
            isResizable: true,
        },
        {
            key: "invoiceDate",
            name: "Invoice Date",
            fieldName: "invoiceDate",
            minWidth: 90,
            maxWidth: 100,
            isResizable: true,
            onRender: (item: IOldAsset) => {
                return item && item.invoiceDate
                    ? convertUTCDateToLocalDate(
                          item?.invoiceDate
                      ).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                      })
                    : null;
            },
        },
        {
            key: "invoice",
            name: "Invoice",
            fieldName: "invoice",
            minWidth: 70,
            maxWidth: 90,
            isResizable: true,
            onRender: (item: IOldAsset) => {
                return item.referenceNumber ? (
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
    ];

    const _columns: IColumn[] = !isAccountsAdmin
        ? [
              {
                  key: "selectassets",
                  name: "",
                  fieldName: "selectassets",
                  minWidth: 20,
                  maxWidth: 30,
                  isResizable: true,
                  onRender: (item: IOldAsset) => {
                      return (
                          <Checkbox
                              disabled={item?.referenceNumber ? true : false}
                              onChange={(e: any) => {
                                  if (e.target.checked) {
                                      setSelectedAssets([
                                          ...selectedAssets,
                                          item,
                                      ]);
                                  } else {
                                      setSelectedAssets((prev) =>
                                          prev.filter((value) => item !== value)
                                      );
                                  }
                              }}
                          />
                      );
                  },
              },
              ..._commonColumns,
          ]
        : [..._commonColumns];

    return (
        <Stack>
            <PageTemplate
                heading="Associate Invoices (Old Asset)"
                isLoading={oldAssetStatus === "pending"}
                errorOccured={isError || errorMessage !== undefined}
                successMessageBar={operationSuccess}
                setSuccessMessageBar={setOperationSuccess}
                headerElementRight={<AddInvoiceButton />}
                errorMessage={errorMessage}
                clearErrorMessage={() => setErrorMessage(undefined)}
            >
                {oldAssets && oldAssets?.length > 0 ? (
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
                                    }}
                                />
                            </StackItem>
                        </Stack>
                    </>
                ) : null}
                {oldAssetStatus === "success" && oldAssets ? (
                    <StyledDetailsList
                        data={filteredDate as IOldAsset[]}
                        columns={_columns}
                        emptymessage="No assets found"
                    />
                ) : null}

                {
                    <OldAssetsModal
                        selectedReferenceIdAssets={selectedReferenceIdAssets}
                        selectedReferenceNumber={selectedReferenceNumber}
                        selectedAssets={selectedAssets}
                        isModalOpen={isModalOpen}
                        dismissPanel={dismissPanel}
                        isAccountsAdmin={isAccountsAdmin}
                    />
                }
            </PageTemplate>
        </Stack>
    );
};

export default OldAssetsInvoiceRegister;

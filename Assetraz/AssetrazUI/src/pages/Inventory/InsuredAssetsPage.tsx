import { useCallback, useMemo, useState } from "react";
import { useBoolean } from "@fluentui/react-hooks";
import { useId } from "@fluentui/react-hooks";
import {
    ActionButton,
    Checkbox,
    DefaultButton,
    DirectionalHint,
    IColumn,
    IDetailsColumnProps,
    IDropdownOption,
    IIconProps,
    IRenderFunction,
    Link,
    PrimaryButton,
    Stack,
    StackItem,
    TooltipHost,
} from "@fluentui/react";

import PageTemplate from "../../components/common/PageTemplate";
import StyledDetailsList from "../../components/common/StyledDetailsList";
import StyledSearchBar from "../../components/common/StyledSearchBar";
import InsuredAssetsModal from "../../components/insured-assets/InsuredAssetsModal";

import { IInsuredAsset } from "../../types/InsuredAsset";
import { InsuredAssetStatus } from "../../constants/InsuredAssetStatus";
import {
    convertDateToGBFormat,
    convertUTCDateToLocalDate,
} from "../../Other/DateFormat";
import { RangeKeyDict } from "react-date-range";

import FilterComponents, {
    IFilterPropsDashboard,
} from "../../components/common/FilterComponents";
import {
    calloutProps,
    hostStyles,
    infoButtonStyles,
} from "../../components/common/TooltipStyles";
import { FILTER_COLUMNS } from "./InsuranceAssetConstants";

import {
    IInsuranceContextState,
    useInsuranceAssetContext,
} from "../../Contexts/InsuranceContext";

const clearIcon: IIconProps = { iconName: "ClearFilter" };

const InsuredAssetsPage = ({ getData }: any) => {
    const [selectedReferenceNumber, setSelectedReferenceNumber] = useState("");
    const [selectedReferenceIds, setSelectedReferenceIds] =
        useState<string[]>();
    const [referenceId, setReferenceId] = useState<string>("");
    const [operationSuccess, setOperationSuccess] = useState<string>();
    const [selectedAsset, setSelectedAsset] = useState<string[]>([]);
    const [isButtonClicked, setIsButtonClicked] = useState<boolean>(false);
    const [isModalOpen, { toggle: setIsModalOpen }] = useBoolean(false);
    const [isAllSelected, setIsAllSelected] = useState<boolean>(false);

    const {
        insuredAssets,
        setInsuredAssets,
        setInitialOption,
        statusOption,
        setStatusOption,
        isLoading,
        setDateRange,
        setIsLoading,
        networkCompanyOption,
        initialOption,
        selectedDateRange,
        filteredData,
        setFilterQuery,
    } = useInsuranceAssetContext() as IInsuranceContextState;

    const id = "warrantyDate";
    const dateRangeAnchorId = useId(`date-range-anchor-${id}`);

    let text = "Select date range";
    if (selectedDateRange.startDate || selectedDateRange.endDate) {
        text = `${convertDateToGBFormat(
            selectedDateRange.startDate
        )} - ${convertDateToGBFormat(selectedDateRange.endDate)}`;
    }

    const isButtonDisabled = selectedAsset.length === 0;

    const InsureAssetsButton = () => (
        <PrimaryButton
            text="Insure Assets"
            styles={{
                root: {
                    marginRight: 16,
                },
            }}
            onClick={(event) => handleClick(InsuredAssetsModal, event)}
            disabled={isButtonDisabled}
        />
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

    const handleClick = (InsuredAssetsModal: any, event: any) => {
        if (selectedAsset.length !== 0) {
            setIsModalOpen();
            setIsButtonClicked(true);
        }
    };

    const handleSelect = useCallback(
        (ranges: RangeKeyDict) => {
            setDateRange(ranges.selection);
        },
        [setDateRange]
    );

    const handleClickReferenceNumber = (item: IInsuredAsset) => {
        setReferenceId(item?.insuranceReferenceId);
        setSelectedReferenceNumber(item?.referenceNumber);
        setInsuredAssets(insuredAssets);
        setIsModalOpen();
        setSelectedReferenceIds(
            insuredAssets
                .filter((data) => data.referenceNumber === item.referenceNumber)
                .map((data) => data.insuranceReferenceId)
        );
    };

    const dismissPanel = (isSuccess: any) => {
        setSelectedReferenceNumber("");
        if (isSuccess) {
            setOperationSuccess("Successfully Updated");
            setIsLoading(true);
            getData();
            setIsLoading(false);
            setSelectedAsset([]);
        }
        setSelectedReferenceIds(undefined);
        setIsModalOpen();
        setIsButtonClicked(false);
    };

    const _onColumnClick = (props: any) => {
        if (statusOption?.key === "None") {
            if (isAllSelected) {
                const selectedAssets = filteredData
                    .filter((i) => !i.referenceNumber)
                    .map((i) => i.insuranceReferenceId);

                setSelectedAsset(selectedAssets);
            } else {
                setSelectedAsset([]);
            }

            setIsAllSelected((prevIsAllSelected) => !prevIsAllSelected);
        } else {
            setIsAllSelected(false);
            setSelectedAsset([]);
        }
    };

    const renderSelectAllHeader: IRenderFunction<IDetailsColumnProps> = (
        props
    ) => {
        return (
            <Checkbox
                styles={{ root: { marginTop: "12px" } }}
                checked={isAllSelected}
                onChange={_onColumnClick}
            />
        );
    };

    const _columns: IColumn[] = [
        {
            key: "selectassets",
            name: "",
            fieldName: "selectassets",
            minWidth: 20,
            maxWidth: 30,
            isResizable: true,
            onColumnClick: _onColumnClick,
            onRender: (item: IInsuredAsset) => {
                return (
                    <Checkbox
                        checked={selectedAsset?.some(
                            (i) => i === item.insuranceReferenceId
                        )}
                        disabled={item?.referenceNumber ? true : false}
                        onChange={(e: any) => {
                            if (e.target.checked) {
                                setSelectedAsset([
                                    ...selectedAsset,
                                    item.insuranceReferenceId,
                                ]);
                            } else {
                                setSelectedAsset((prev) =>
                                    prev.filter(
                                        (value) =>
                                            item.insuranceReferenceId !== value
                                    )
                                );
                            }
                        }}
                    />
                );
            },
            onRenderHeader: renderSelectAllHeader,
        },
        {
            key: "purchaseOrderNumber",
            name: "PO Number",
            fieldName: "purchaseOrderNumber",
            minWidth: 100,
            maxWidth: 130,
            isResizable: true,
        },
        {
            key: "invoiceNumber",
            name: "Invoice Number",
            fieldName: "invoiceNumber",
            minWidth: 100,
            maxWidth: 130,
            isResizable: true,
            onRender: (item: IInsuredAsset) =>
                item.invoiceNumber ? item.invoiceNumber : "Other Source",
        },
        {
            key: "categoryName",
            name: "Category",
            fieldName: "categoryName",
            minWidth: 100,
            maxWidth: 130,
            isResizable: true,
        },
        {
            key: "manufacturerName",
            name: "Manufacturer",
            fieldName: "manufacturerName",
            minWidth: 100,
            maxWidth: 130,
            isResizable: true,
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
            maxWidth: 130,
            isResizable: true,
            onRender: (item: IInsuredAsset) =>
                item.warrentyDate &&
                convertUTCDateToLocalDate(
                    new Date(item.warrentyDate)
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
            minWidth: 150,
            maxWidth: 130,
            isResizable: true,
        },
        {
            key: "assetValue",
            name: "Asset Value",
            fieldName: "assetValue",
            minWidth: 100,
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
            onRender: (item: IInsuredAsset) => {
                return (
                    <Link
                        onClick={(e) => {
                            e.preventDefault();
                            handleClickReferenceNumber(item);
                        }}
                    >
                        {item.referenceNumber?.toUpperCase()}
                    </Link>
                );
            },
        },
        {
            key: "status",
            name: "Status",
            fieldName: "status",
            minWidth: 100,
            maxWidth: 130,
            isResizable: true,
            onRender: (item: IInsuredAsset) => {
                if (
                    item.status === InsuredAssetStatus["Request Submitted"] ||
                    item.status === InsuredAssetStatus.Insured
                ) {
                    return item.status;
                } else {
                    return " ";
                }
            },
        },
    ];

    const filterProps: IFilterPropsDashboard[] = useMemo(
        () => [
            {
                type: "dropdown",
                label: "Network Company",
                placeholder: "Network Company",
                options: networkCompanyOption ?? [],
                onChange: onChangeNetworkCompany,
                selectedKey: initialOption?.key,
            },
            {
                type: "dropdown",
                label: "Status",
                placeholder: "Status",
                options:
                    Object.keys(InsuredAssetStatus).map((option) => ({
                        key: option,
                        text: option,
                    })) ?? [],
                onChange: onChangeAssetStatus,
                selectedKey: statusOption?.key,
            },
            {
                type: "date",
                label: "Warranty Date",
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
            networkCompanyOption,
            onChangeAssetStatus,
            onChangeNetworkCompany,
            selectedDateRange,
            statusOption?.key,
            text,
        ]
    );

    return (
        <Stack>
            <PageTemplate
                heading="Insurance Register"
                isLoading={isLoading}
                errorOccured={insuredAssets === null}
                successMessageBar={operationSuccess}
                setSuccessMessageBar={setOperationSuccess}
                headerElementRight={<InsureAssetsButton />}
            >
                {insuredAssets?.length > 0 ? (
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
                {insuredAssets && (
                    <StyledDetailsList
                        data={filteredData}
                        columns={_columns}
                        emptymessage="No assets found"
                    />
                )}

                {((selectedReferenceIds && referenceId) || isButtonClicked) && (
                    <InsuredAssetsModal
                        selectedReferenceIds={
                            isButtonClicked
                                ? selectedAsset
                                : selectedReferenceIds
                        }
                        referenceId={referenceId}
                        referenceNumber={selectedReferenceNumber}
                        isModalOpen={isModalOpen}
                        dismissPanel={dismissPanel}
                    />
                )}
            </PageTemplate>
        </Stack>
    );
};

export default InsuredAssetsPage;

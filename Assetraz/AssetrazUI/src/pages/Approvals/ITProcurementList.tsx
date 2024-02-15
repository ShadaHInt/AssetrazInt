import React from "react";
import {
    DefaultButton,
    DirectionalHint,
    IColumn,
    IDropdownOption,
    Link,
    Stack,
    TooltipHost,
} from "@fluentui/react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useBoolean } from "@fluentui/react-hooks";

import { getProcurementsApprovalDashboard } from "../../services/procurementService";
import { GetAllNetworkCompanies } from "../../services/networkCompanyService";

import PageTemplate from "../../components/common/PageTemplate";
import StyledDetailsList, {
    sort,
} from "../../components/common/StyledDetailsList";
import { Tooltip } from "../../components/common/Tooltip";
import ProcurementModal from "../Admin/ProcurementPage/ProcurementModal";
import FilterComponents, {
    IFilterPropsDashboard,
} from "../../components/common/FilterComponents";
import StyledSearchBar from "../../components/common/StyledSearchBar";

import { detailsListStyles } from "../../pages/Admin/ProcurementPage/ProcurementPage.styles";
import {
    calloutProps,
    hostStyles,
    infoButtonStyles,
} from "../../components/common/TooltipStyles";

import { IProcurements } from "../../types/Procurement";
import { convertDateToddMMMYYYFormat } from "../../Other/DateFormat";
import { NetworkCompany } from "../../types/NetworkCompany";
import {
    getProcurementStatus,
    ProcurementStatus,
} from "../../constants/ProcurementStatus";
import {
    DROPDOWN_INITIALOPTION,
    PROCUREMENT_FILTER_COLUMN,
    STATUS_OPTIONS,
} from "../../constants/ITProcurementApproval";

const ITProcurements = ({ id }: { id?: string }) => {
    const [data, setData] = useState<IProcurements[]>([]);
    const [filteredData, setFilteredData] = useState<IProcurements[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalVisible, { toggle: setIsModalVisible }] = useBoolean(false);
    const [seletedProcurementRequest, setSelectedProcurementRequest] = useState<
        IProcurements | undefined
    >();
    const [successMessage, setSuccessMessage] = useState<string | undefined>();
    const [networkCompanies, setNetworkCompanies] = useState<
        IDropdownOption<NetworkCompany>[]
    >([]);
    const [filterQuery, setFilterQuery] = useState<string>("");
    const [selectedStatus, setSelectedStatus] = useState<string>(
        STATUS_OPTIONS["Pending Approval"]
    );
    const [selectedCompany, setSelectedCompany] =
        useState<IDropdownOption<NetworkCompany>>();
    const [columns, setColumns] = useState<IColumn[]>();

    const classes = detailsListStyles();
    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        getNetworkCompanies();
    }, []);

    useEffect(() => {
        let filteredData = data?.filter(
            (i) =>
                isVendorMatching(i?.vendorNameList, filterQuery) ||
                isCategoryMatching(i?.categoryList, filterQuery) ||
                i.requestNumber
                    ?.toLowerCase()
                    .indexOf(filterQuery.toLowerCase()) > -1 ||
                i.createdBy?.toLowerCase().indexOf(filterQuery.toLowerCase()) >
                    -1 ||
                i.approvedBy?.toLowerCase().indexOf(filterQuery.toLowerCase()) >
                    -1
        );

        filteredData =
            selectedStatus !== STATUS_OPTIONS.All
                ? selectedStatus === STATUS_OPTIONS["Pending Approval"]
                    ? filteredData.filter(
                          (i) =>
                              i.status === ProcurementStatus["Pending Approval"]
                      )
                    : filteredData.filter((i) => i.status === selectedStatus)
                : filteredData;

        if (selectedCompany) {
            filteredData =
                selectedCompany.key !== DROPDOWN_INITIALOPTION.key
                    ? filteredData.filter(
                          (i) => i.networkCompanyId === selectedCompany.key
                      )
                    : filteredData;
        }
        setFilteredData(filteredData);
    }, [data, filterQuery, selectedCompany, selectedStatus]);

    const getData = async () => {
        setIsLoading(true);
        await getProcurementsApprovalDashboard()
            .then((res) => {
                setData(res);
                setIsLoading(false);
                if (id) {
                    setSelectedProcurementRequest(
                        res.find((r: IProcurements) => r.requestNumber === id)
                    );
                    setIsModalVisible();
                }
            })
            .catch((err) => setData([]));
        setIsLoading(false);
    };

    const getNetworkCompanies = useCallback(async () => {
        try {
            let result = await GetAllNetworkCompanies();
            result.unshift(DROPDOWN_INITIALOPTION);
            setNetworkCompanies(result);
            const initialOption = result.find(
                (i: NetworkCompany) => i.isPrimary
            );
            setSelectedCompany(initialOption ?? DROPDOWN_INITIALOPTION);
        } catch (err: any) {
            setNetworkCompanies([]);
        }
    }, []);

    const onChange = (
        event: React.FormEvent<HTMLDivElement>,
        item: IDropdownOption<any> | undefined
    ): void => {
        item && setSelectedStatus(item?.text);
    };

    const onChangeNetworkCompany = (
        event: React.FormEvent<HTMLDivElement>,
        item: IDropdownOption<NetworkCompany> | undefined
    ): void => {
        item && setSelectedCompany(item);
    };

    const _onColumnClick = useCallback(
        (event: React.MouseEvent<HTMLElement>, column: IColumn): void => {
            const { newItems, newColumns } = sort(data, column, sortedColumn);
            setColumns(newColumns);
            setData(newItems);
        },
        [data]
    );

    const tooltipContent = useMemo(
        () => (
            <div>
                <strong>Search for a keyword in the columns:</strong>
                <div>
                    {PROCUREMENT_FILTER_COLUMN.map((value, index) => (
                        <span key={index}>
                            {value}
                            {index !== PROCUREMENT_FILTER_COLUMN.length - 1 &&
                                ", "}
                        </span>
                    ))}
                </div>
            </div>
        ),
        []
    );

    const filterProps: IFilterPropsDashboard[] = useMemo(
        () => [
            {
                type: "dropdown",
                label: "Network Company",
                placeholder: "Network Company",
                options: networkCompanies ?? [],
                onChange: onChangeNetworkCompany,
                defaultSelectedKey: selectedCompany?.key,
                selectedKey: selectedCompany?.key,
            },
            {
                type: "dropdown",
                label: "Status",
                placeholder: "Status",
                options:
                    Object.keys(STATUS_OPTIONS).map((option) => ({
                        key: option,
                        text: option,
                    })) ?? [],
                onChange: onChange,
                selectedKey: Object.keys(STATUS_OPTIONS).find(
                    (option) =>
                        option.toLowerCase() === selectedStatus?.toLowerCase()
                ),
            },
        ],
        [networkCompanies, selectedCompany?.key, selectedStatus]
    );

    const _columns: IColumn[] = [
        {
            key: "requestNumber",
            name: "Request Number",
            fieldName: "requestNumber",
            minWidth: 150,
            isResizable: true,
            onRender: (item: IProcurements) => {
                return (
                    <Link
                        onClick={() => {
                            setSelectedProcurementRequest(item);
                            setIsModalVisible();
                        }}
                    >
                        {item.requestNumber}
                    </Link>
                );
            },
        },
        {
            key: "vendorNameList",
            name: "Vendor",
            fieldName: "vendorNameList",
            minWidth: 150,
            isResizable: true,
            onRender: (item: IProcurements) => {
                if (item?.vendors?.length > 0) {
                    return (
                        <div className={classes.tooltip}>
                            <Tooltip
                                content={
                                    <table className={classes.table}>
                                        <thead>
                                            <tr>
                                                <th
                                                    className={
                                                        classes.tableData
                                                    }
                                                >
                                                    Vendor
                                                </th>
                                                <th
                                                    className={
                                                        classes.tableData
                                                    }
                                                >
                                                    Quote Received On
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {item?.vendors.map((i) => {
                                                return (
                                                    <tr key={i.vendorName}>
                                                        <td
                                                            className={
                                                                classes.tableData
                                                            }
                                                        >
                                                            {i.vendorName}
                                                        </td>
                                                        <td
                                                            className={
                                                                classes.tableData
                                                            }
                                                        >
                                                            {i.quoteReceivedOn &&
                                                                new Date(
                                                                    i.quoteReceivedOn
                                                                ).toLocaleDateString(
                                                                    "en-GB",
                                                                    {
                                                                        day: "2-digit",
                                                                        month: "short",
                                                                        year: "numeric",
                                                                    }
                                                                )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                }
                            >
                                {item?.vendorNameList.join(",")}
                            </Tooltip>
                        </div>
                    );
                } else {
                    return item?.vendorNameList;
                }
            },
        },
        {
            key: "categoryList",
            name: "Category",
            fieldName: "categoryList",
            minWidth: 150,
            isResizable: true,
            onRender: (item: IProcurements) => {
                if (item?.categoryList?.length > 0) {
                    return (
                        <Tooltip
                            content={
                                <table className={classes.table}>
                                    <thead>
                                        <tr>
                                            <th className={classes.tableData}>
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
                                                            classes.tableData
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
            key: "createdBy",
            name: "Created By",
            fieldName: "createdBy",
            minWidth: 150,
            isResizable: true,
        },
        {
            key: "requestRaisedOn",
            name: "Request Raised On",
            fieldName: "requestRaisedOn",
            minWidth: 150,
            isResizable: true,
            onRender: (item: IProcurements) =>
                convertDateToddMMMYYYFormat(item.requestRaisedOn),
            isSorted: true,
            isSortedDescending: false,
            onColumnClick: _onColumnClick,
        },
        {
            key: "approvedOn",
            name: "Approved On",
            fieldName: "approvedOn",
            minWidth: 150,
            isResizable: true,
            onRender: (item: IProcurements) =>
                convertDateToddMMMYYYFormat(item.approvedOn),
            onColumnClick: _onColumnClick,
        },
        {
            key: "approvedBy",
            name: "Approved By",
            fieldName: "approvedBy",
            minWidth: 150,
            isResizable: true,
        },
        {
            key: "status",
            name: "Status",
            fieldName: "status",
            minWidth: 100,
            isResizable: true,
            onRender: (item: IProcurements) =>
                getProcurementStatus(item.status),
        },
    ];

    const closeRefresh = (message: string) => {
        setSuccessMessage(message);
        getData();
        setIsModalVisible();
    };

    const setIsModalVisibleHandler = () => {
        if (seletedProcurementRequest !== null) {
            setSelectedProcurementRequest(undefined);
        }
        setIsModalVisible();
    };

    const isVendorMatching = (
        vendor: string[],
        searchkeyword: string
    ): boolean => {
        const filteredArray = vendor.filter((el) =>
            el.toLowerCase().includes(searchkeyword.toLowerCase())
        );
        return filteredArray.length > 0;
    };

    const isCategoryMatching = (
        vendor: string[],
        searchkeyword: string
    ): boolean => {
        const filteredArray = vendor.filter((el) =>
            el.toLowerCase().includes(searchkeyword.toLowerCase())
        );
        return filteredArray.length > 0;
    };

    const sortedColumn = columns ?? _columns;

    return (
        <PageTemplate
            heading=""
            isLoading={isLoading}
            successMessageBar={successMessage}
            setSuccessMessageBar={setSuccessMessage}
            errorOccured={data === null}
        >
            {data.length !== 0 && (
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
            )}
            {data && (
                <StyledDetailsList
                    data={filteredData}
                    columns={sortedColumn}
                    emptymessage="No requests found"
                />
            )}
            {isModalVisible && (
                <ProcurementModal
                    isModalVisible={isModalVisible}
                    selectedProcurement={seletedProcurementRequest}
                    setIsModalVisible={setIsModalVisibleHandler}
                    closeRefresh={closeRefresh}
                    isApprovalModel={true}
                />
            )}
        </PageTemplate>
    );
};

export default ITProcurements;

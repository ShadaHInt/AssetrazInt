import {
    DefaultButton,
    DirectionalHint,
    IColumn,
    IDropdownOption,
    Link,
    Stack,
    TooltipHost,
} from "@fluentui/react";
import {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import React from "react";

import {
    IURAContext,
    useURAContext,
} from "../../Contexts/UserRequestApprovalContext";

import FilterComponents, {
    IFilterPropsDashboard,
} from "../../components/common/FilterComponents";
import PageTemplate from "../../components/common/PageTemplate";
import StyledDetailsList, {
    sort,
} from "../../components/common/StyledDetailsList";
import ViewAssetModal from "../../components/asset-requests/viewAssetModal";
import { Tooltip } from "../../components/common/Tooltip";
import StyledSearchBar from "../../components/common/StyledSearchBar";

import {
    calloutProps,
    hostStyles,
    infoButtonStyles,
} from "../../components/common/TooltipStyles";

import { UR_FILTER_COLUMNS } from "../Admin/UserRequestsPage/UserRequestConstants";
import { STATUS_OPTIONS } from "./UserRequestApprovalConstants";
import { UserRequest } from "./UserRequestTypes";

interface URProps {
    errorMessage: string;
    setErrorMessage: Dispatch<SetStateAction<string>>;
}

const UserRequests = (props: URProps) => {
    const { errorMessage, setErrorMessage } = props;
    const [isOpen, setIsOpen] = useState(false);
    const [columns, setColumns] = useState<IColumn[]>();
    const [successMessage, setSuccessMessage] = useState<string | undefined>();
    const [selectedRequest, setSelectedRequest] = useState<UserRequest>();

    const {
        data,
        setData,
        isLoading,
        setFilterQuery,
        filteredData,
        selectedStatus,
        setSelectedStatus,
        networkCompanyOptions,
        selectedNetworkCompany,
        setSelectedNetworkCompany,
        getUserRequests,
    } = useURAContext() as IURAContext;

    useEffect(() => {
        getUserRequests();
    }, [getUserRequests]);

    const viewAssetRequest = (item: UserRequest) => {
        setSelectedRequest(item);
        setIsOpen(true);
    };

    const tooltipContent = useMemo(
        () => (
            <div>
                <strong>Search for a keyword in the columns:</strong>
                <div>
                    {UR_FILTER_COLUMNS.map((value, index) => (
                        <span key={index}>
                            {value}
                            {index !== UR_FILTER_COLUMNS.length - 1 && ", "}
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

    const onChangeStatus = useCallback(
        (
            event: React.FormEvent<HTMLDivElement>,
            item: IDropdownOption<any> | undefined
        ): void => {
            item && setSelectedStatus(item?.text);
        },
        [setSelectedStatus]
    );

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
            {
                type: "dropdown",
                label: "Status",
                placeholder: "Status",
                options:
                    Object.keys(STATUS_OPTIONS).map((option) => ({
                        key: option,
                        text: option,
                    })) ?? [],
                onChange: onChangeStatus,
                selectedKey: Object.keys(STATUS_OPTIONS).find(
                    (option) =>
                        option.toLowerCase() === selectedStatus?.toLowerCase()
                ),
            },
        ],
        [
            networkCompanyOptions,
            onChangeNetworkCompany,
            onChangeStatus,
            selectedNetworkCompany?.key,
            selectedStatus,
        ]
    );

    const _onColumnClick = (
        event: React.MouseEvent<HTMLElement>,
        column: IColumn
    ): void => {
        const { newItems, newColumns } = sort(data, column, sortedColumn);
        setColumns(newColumns);
        setData(newItems);
    };

    const dismissModal = (isSuccess?: boolean, review?: boolean) => {
        if (isSuccess === true) {
            getUserRequests();
            if (review === true) {
                setSuccessMessage("Successfully approved");
            } else {
                setSuccessMessage("Successfuly rejected");
            }
        }
        setIsOpen(false);
    };

    const _columns: IColumn[] = [
        {
            key: "purchaseRequestNumber",
            name: "Request Number",
            fieldName: "purchaseRequestNumber",
            minWidth: 150,
            isResizable: true,
            onRender: (item: UserRequest) => {
                return (
                    <Link
                        onClick={(e) => {
                            e.preventDefault();
                            viewAssetRequest(item);
                        }}
                    >
                        {item.purchaseRequestNumber}
                    </Link>
                );
            },
        },
        {
            key: "associateName",
            name: "Associate Name",
            fieldName: "associateName",
            minWidth: 150,
            isResizable: true,
            onRender: (item: UserRequest) => {
                if (item?.associateName) {
                    return (
                        <Tooltip content={item?.submittedBy}>
                            {item?.associateName}
                        </Tooltip>
                    );
                } else {
                    return item?.submittedBy;
                }
            },
            onColumnClick: _onColumnClick,
        },
        {
            key: "approverName",
            name: "Manager",
            fieldName: "approverName",
            minWidth: 150,
            isResizable: true,
            onRender: (item: UserRequest) => {
                return item?.approverName;
            },
        },
        {
            key: "submittedOn",
            name: "Request Raised On",
            fieldName: "submittedOn",
            minWidth: 150,
            isResizable: true,
            onRender: (item: UserRequest) =>
                new Date(item.submittedOn).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                }),
            isSorted: true,
            isSortedDescending: true,
            onColumnClick: _onColumnClick,
        },
        {
            key: "priority",
            name: "Priority",
            fieldName: "priority",
            minWidth: 150,
            isResizable: true,
        },
        {
            key: "categoryName",
            name: "Category",
            fieldName: "categoryName",
            minWidth: 150,
            isResizable: true,
        },
        {
            key: "approvedOn",
            name: "Approved On",
            fieldName: "approvedOn",
            minWidth: 100,
            isResizable: true,
            onRender: (item: UserRequest) =>
                item.approvedOn &&
                new Date(item.approvedOn).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                }),
            onColumnClick: _onColumnClick,
        },
        {
            key: "status",
            name: "Status",
            fieldName: "status",
            minWidth: 100,
            isResizable: true,
        },
    ];

    const sortedColumn = columns ?? _columns;

    return (
        <PageTemplate
            heading=""
            isLoading={isLoading}
            setSuccessMessageBar={setSuccessMessage}
            successMessageBar={successMessage}
            errorMessage={errorMessage}
            clearErrorMessage={() => setErrorMessage("")}
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
                    emptymessage="No user requests found"
                />
            )}
            <Stack></Stack>
            <ViewAssetModal
                selectedRequest={selectedRequest}
                openModal={isOpen}
                dismissModal={dismissModal}
            ></ViewAssetModal>
        </PageTemplate>
    );
};

export default UserRequests;

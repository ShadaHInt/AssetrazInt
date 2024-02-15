import * as React from "react";
import {
    DefaultButton,
    DirectionalHint,
    IColumn,
    IDropdownOption,
    Link,
    Stack,
    TooltipHost,
} from "@fluentui/react";
import { detailsListStyles } from "./UserRequestPage.styles";
import PageTemplate from "../../../components/common/PageTemplate";
import StyledDetailsList from "../../../components/common/StyledDetailsList";
import { sort } from "../../../components/common/StyledDetailsList";
import { Tooltip } from "../../../components/common/Tooltip";
import IPurchaseRequest from "../../../types/PurchaseRequest";
import UserRequestModal from "./UserRequestModal";
import { IURContext, useURContext } from "../../../Contexts/UserRequestContext";
import {
    Dispatch,
    SetStateAction,
    useCallback,
    useState,
    useMemo,
} from "react";
import { APPROVED_OPTIONS, UR_FILTER_COLUMNS } from "./UserRequestConstants";
import FilterComponents, {
    IFilterPropsDashboard,
} from "../../../components/common/FilterComponents";
import StyledSearchBar from "../../../components/common/StyledSearchBar";
import {
    calloutProps,
    hostStyles,
    infoButtonStyles,
} from "../../../components/common/TooltipStyles";

interface userRequestProps {
    isLoading: boolean;
    errorMessage: string;
    setErrorMessage: Dispatch<SetStateAction<string>>;
}

const UserRequestsPage = (props: userRequestProps) => {
    const { isLoading, errorMessage, setErrorMessage } = props;
    const [operationSuccess, setOperationSuccess] = useState<
        string | undefined
    >();
    const [userRequestSelected, setUserRequestSelected] = useState({});
    const [showUserRequestModal, setShowUserRequestModal] = useState(false);
    const [columns, setColumns] = useState<IColumn[]>();

    const classes = detailsListStyles();

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

    const {
        data,
        filteredData,
        selectedStatus,
        networkCompanyOptions,
        initialOption,
        setFilterQuery,
        setData,
        setSelectedStatus,
        setInitialOption,
    } = useURContext() as IURContext;

    const onRequestClick = React.useCallback((userRequestData: object) => {
        setUserRequestSelected(userRequestData);
        setShowUserRequestModal(true);
    }, []);

    const _onColumnClick = (
        event: React.MouseEvent<HTMLElement>,
        column: IColumn
    ): void => {
        const { newItems, newColumns } = sort(data, column, sortedColumn);
        setColumns(newColumns);
        setData(newItems);
    };

    const onChangeStatus = useCallback(
        (
            event: React.FormEvent<HTMLDivElement>,
            item: IDropdownOption<any> | undefined
        ): void => {
            item && setSelectedStatus(item?.text);
        },
        [setSelectedStatus]
    );

    const onChangeNetworkCompany = useCallback(
        (event: any, item: IDropdownOption<any> | undefined): void => {
            item && setInitialOption(item);
        },
        [setInitialOption]
    );

    const filterProps: IFilterPropsDashboard[] = useMemo(
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
                label: "Status",
                placeholder: "Status",
                options:
                    Object.keys(APPROVED_OPTIONS).map((option) => ({
                        key: option,
                        text: option,
                    })) ?? [],
                onChange: onChangeStatus,
                selectedKey: Object.keys(APPROVED_OPTIONS).find(
                    (option) =>
                        option.toLowerCase() === selectedStatus?.toLowerCase()
                ),
            },
        ],
        [
            initialOption?.key,
            networkCompanyOptions,
            onChangeNetworkCompany,
            onChangeStatus,
            selectedStatus,
        ]
    );

    const _columns: IColumn[] = [
        {
            key: "purchaseRequestNumber",
            name: "Request Number",
            fieldName: "purchaseRequestNumber",
            minWidth: 150,
            maxWidth: 150,
            isResizable: true,
            onRender: (item: IPurchaseRequest) => {
                return (
                    <Link
                        onClick={(e) => {
                            e.preventDefault();
                            onRequestClick(item);
                        }}
                    >
                        {item.purchaseRequestNumber}
                    </Link>
                );
            },
        },
        {
            key: "priority",
            name: "Priority",
            fieldName: "priority",
            minWidth: 75,
            maxWidth: 75,
            isResizable: true,
        },
        {
            key: "categoryName",
            name: "Category",
            fieldName: "categoryName",
            minWidth: 120,
            maxWidth: 120,
            isResizable: true,
        },
        {
            key: "associateName",
            name: "Associate Name",
            fieldName: "associateName",
            minWidth: 150,
            maxWidth: 150,
            isResizable: true,
            onRender: (item: IPurchaseRequest) => {
                if (item?.associateName?.length > 20) {
                    return (
                        <div className={classes.tooltip}>
                            <Tooltip content={item?.associateName}>
                                {item?.associateName}
                            </Tooltip>
                        </div>
                    );
                } else {
                    return item?.associateName;
                }
            },
            onColumnClick: _onColumnClick,
        },
        {
            key: "approverName",
            name: "Manager",
            fieldName: "approverName",
            minWidth: 150,
            maxWidth: 150,
            isResizable: true,
            onRender: (item: IPurchaseRequest) => {
                if (item?.approverName?.length > 20) {
                    return (
                        <div className={classes.tooltip}>
                            <Tooltip content={item?.approverName}>
                                {item?.approverName}
                            </Tooltip>
                        </div>
                    );
                } else {
                    return item?.approverName;
                }
            },
        },
        {
            key: "createdDate",
            name: "Request Raised On",
            fieldName: "createdDate",
            minWidth: 150,
            maxWidth: 150,
            isResizable: true,
            onRender: (item: IPurchaseRequest) =>
                item.createdDate &&
                new Date(item.createdDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                }),
            isSorted: true,
            isSortedDescending: false,
            onColumnClick: _onColumnClick,
        },
        {
            key: "approvedOn",
            name: "Approved On",
            fieldName: "approvedOn",
            minWidth: 150,
            maxWidth: 150,
            isResizable: true,
            onRender: (item: IPurchaseRequest) =>
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
            maxWidth: 100,
            isResizable: true,
            onColumnClick: _onColumnClick,
        },
        {
            key: "comments",
            name: "Comments",
            fieldName: "comments",
            minWidth: 300,
            maxWidth: 300,
            isResizable: true,
            onRender: (item: IPurchaseRequest) => {
                if (item?.comments?.length > 50) {
                    return (
                        <div className={classes.tooltip}>
                            <Tooltip content={item?.comments}>
                                {item?.comments}
                            </Tooltip>
                        </div>
                    );
                } else {
                    return item?.comments;
                }
            },
        },
    ];

    const sortedColumn = columns ?? _columns;

    const dissmissModal = (type?: string, errorMessage?: string) => {
        setShowUserRequestModal(false);
        setOperationSuccess("");
        setErrorMessage("");
        setUserRequestSelected({});
        if (type === "SUCCESS") {
            setOperationSuccess("Successfully updated");
        } else if (type === "ERROR") {
            setErrorMessage(errorMessage ? errorMessage : "An Error Occured");
        }
    };

    return (
        <PageTemplate
            heading="Approved Employee Requests"
            isLoading={isLoading}
            successMessageBar={operationSuccess}
            setSuccessMessageBar={setOperationSuccess}
            errorMessage={errorMessage}
            clearErrorMessage={() => setErrorMessage("")}
        >
            {data.length > 0 ? (
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
            {data && (
                <StyledDetailsList
                    data={filteredData}
                    columns={sortedColumn}
                    emptymessage="No requests found"
                />
            )}
            {showUserRequestModal && (
                <UserRequestModal
                    userRequestSelected={userRequestSelected}
                    dismissModal={dissmissModal}
                />
            )}
        </PageTemplate>
    );
};

export default UserRequestsPage;

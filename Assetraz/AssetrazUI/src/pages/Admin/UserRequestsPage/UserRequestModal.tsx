import * as React from "react";
import { useState, useEffect } from "react";
import {
    DefaultButton,
    PrimaryButton,
    TextField,
    Stack,
    Separator,
    IColumn,
    Checkbox,
    Shimmer,
    SpinnerSize,
    Spinner,
    Link,
    Label,
    Selection,
    TooltipHost,
    DirectionalHint,
} from "@fluentui/react";
import { useBoolean } from "@fluentui/react-hooks";

import {
    contentStyles,
    buttonStyles,
    inlineInputStyle,
    textAreaStyleReadOnly,
    checkBoxStyle,
    shimmerElements,
} from "./UserRequestPage.styles";

import { updateNewAssetRequest } from "../../../services/requestService";
import {
    getAsset,
    getAssetsByCategory,
    issueAsset,
} from "../../../services/assetService";
import { CreateProcurementRequestForUserRequest } from "../../../services/procurementService";

import "office-ui-fabric-core/dist/css/fabric.min.css";
import StyledModal, {
    ModalSize,
    StyleModalFooter,
} from "../../../components/common/StyledModal";
import IAsset from "../../../types/Asset";
import StyledDetailsList from "../../../components/common/StyledDetailsList";
import StyledSearchBar from "../../../components/common/StyledSearchBar";
import { useNavigate } from "react-router-dom";
import { AssetDetails } from "../../../components/issue-return/types";
import { IURContext, useURContext } from "../../../Contexts/UserRequestContext";
import {
    calloutProps,
    hostStyles,
    infoButtonStyles,
} from "../../../components/common/TooltipStyles";
import { convertDateToddMMMYYYFormat } from "../../../Other/DateFormat";

interface userRequestType {
    userRequestSelected: any;
    dismissModal: (type?: string, errorMessage?: string) => any;
}

const INVENTORY_FILTER_COLUMN = [
    " Manufacturer",
    "Serial Number",
    "Model Number",
    "Asset Tag #",
];

const UserRequestModal: React.FunctionComponent<userRequestType> = (
    props: userRequestType
) => {
    const navigate = useNavigate();
    const [isLoading, setIsloading] = useState<boolean>(false);
    const [isIssuedRequest, setIsIssuedRequest] = useState<boolean>(false);
    const [selectedAsset, setSelectedRequest] = useState<any>();
    const [assets, setAssets] = useState<IAsset[] | null>();
    const [assetDetails, setAssetDetails] = useState<
        AssetDetails[] | undefined | null
    >();

    const [filteredAssets, setFilteredAssets] = useState<any>();
    const [filterQuery, setFilterQuery] = useState<string>("");
    const [isError, setIsError] = useState<boolean>(false);
    const [isRequestForQuote, { toggle: toggleRequestForQuote }] =
        useBoolean(true);
    const [adminComments, setAdminComments] = useState<string>(
        props?.userRequestSelected?.adminComments
            ? props.userRequestSelected.adminComments
            : ""
    );

    const [selectedItemCount, setSelectedItemCount] = useState<number>(0);
    const selection: Selection = React.useMemo(
        () =>
            new Selection<any>({
                onSelectionChanged: () =>
                    setSelectedItemCount(selection.getSelectedCount()),
            }),
        [setSelectedItemCount]
    );

    const tooltipContent = React.useMemo(
        () => (
            <div>
                <strong>Search for a keyword in the columns:</strong>
                <div>
                    {INVENTORY_FILTER_COLUMN.map((value, index) => (
                        <span key={index}>
                            {value}
                            {index !== INVENTORY_FILTER_COLUMN.length - 1 &&
                                ", "}
                        </span>
                    ))}
                </div>
            </div>
        ),
        []
    );

    const { getApprovedUserRequests } = useURContext() as IURContext;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAssetsByCategory(
                    props.userRequestSelected.categoryId
                );
                setFilteredAssets([]);
                setAssets(response || []);
            } catch (error) {
                setAssets(null);
                setIsError(true);
            }
        };

        fetchData();
    }, [props.userRequestSelected.categoryId]);

    useEffect(() => {
        if (assets && assets?.length > 0) {
            var filtered = assets.map(
                ({
                    inventoryId,
                    manufacturerName,
                    serialNumber,
                    modelNumber,
                    assetTagNumber,
                }) => ({
                    inventoryId,
                    manufacturerName,
                    serialNumber,
                    modelNumber,
                    assetTagNumber,
                })
            );

            const searchFiltered = filtered.filter((asset) =>
                Object.values(asset).some((value) =>
                    String(value)
                        .toLowerCase()
                        .includes(filterQuery.toLowerCase())
                )
            );
            setFilteredAssets(searchFiltered);
        }
    }, [assets, filterQuery]);

    const getAssetDetails = React.useCallback(async () => {
        try {
            const issuedAsset: AssetDetails = await getAsset(
                props?.userRequestSelected?.inventoryId
            );
            setAssetDetails([issuedAsset]);
        } catch (error) {
            setAssetDetails([]);
        }
    }, [props?.userRequestSelected?.inventoryId]);

    useEffect(() => {
        if (props?.userRequestSelected?.status === "Issued") {
            setIsIssuedRequest(true);
            getAssetDetails();
        }
    }, [getAssetDetails, props?.userRequestSelected?.status]);

    const closeModal = () => {
        props.dismissModal();
    };

    const changeHandler = (
        event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { value } = event.currentTarget;
        setAdminComments(value);
    };

    const onActiveItemChanged = (
        item?: any,
        index?: number,
        ev?: React.FocusEvent<HTMLElement>
    ) => {
        setSelectedRequest(item);
    };

    const saveRequest = React.useCallback(async () => {
        setIsloading(true);

        const { userRequestSelected } = props;
        const { purchaseRequestNumber, networkCompanyId, categoryId } =
            userRequestSelected;

        const data = {
            ...userRequestSelected,
            adminComments: adminComments,
            status:
                selectedAsset && selectedItemCount !== 0
                    ? "Issued"
                    : props.userRequestSelected?.itrequestNumber
                    ? "Procurement"
                    : "Approved",
            inventoryId: selectedAsset ? selectedAsset.inventoryId : null,
        };

        try {
            if (assets?.length === 0 && isRequestForQuote && !selectedAsset) {
                const requestData = [
                    {
                        networkCompanyId: networkCompanyId,
                        notes: `Procurement Request created to fulfil the User Request Number - ${purchaseRequestNumber}`,
                        categoryId: categoryId,
                        quantity: 1,
                        specifications: "", //temp
                    },
                ];

                const newProcurement =
                    await CreateProcurementRequestForUserRequest(requestData);

                if (newProcurement) {
                    const newData = {
                        ...data,
                        itrequestNumber: newProcurement,
                        status: "Procurement",
                    };

                    const response = await updateNewAssetRequest(
                        purchaseRequestNumber,
                        newData
                    );
                    if (!response) {
                        setIsError(true);
                    }
                }
            } else {
                const response = await updateNewAssetRequest(
                    purchaseRequestNumber,
                    data
                );

                if (selectedAsset && selectedItemCount !== 0) {
                    const issueRequest = {
                        emailId: userRequestSelected.submittedBy,
                        inventoryId: selectedAsset.inventoryId,
                        issuedTo: userRequestSelected.associateName,
                    };

                    const issued = await issueAsset(issueRequest);

                    if (!issued) {
                        setIsError(true);
                    }
                }

                if (!response) {
                    setIsError(true);
                }
            }

            if (!isError) {
                props.dismissModal("SUCCESS");
                getApprovedUserRequests();
            }
        } catch (error) {
            setIsError(true);
        } finally {
            setIsloading(false);
            if (isError) {
                props.dismissModal("ERROR", "An error occurred.");
            }
        }
    }, [
        adminComments,
        assets?.length,
        getApprovedUserRequests,
        isError,
        isRequestForQuote,
        props,
        selectedAsset,
        selectedItemCount,
    ]);

    const _columns: IColumn[] = [
        {
            key: "manufacturerName",
            name: "Manufacturer",
            fieldName: "manufacturerName",
            minWidth: 100,
            isResizable: true,
        },
        {
            key: "modelNumber",
            name: "Model Number",
            fieldName: "modelNumber",
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
            key: "assetTagNumber",
            name: "Asset Tag #",
            fieldName: "assetTagNumber",
            minWidth: 100,
            isResizable: true,
        },
    ];

    const handleClick = () => {
        navigate("/procurement", {
            state: {
                itrequestNumber: props.userRequestSelected?.itrequestNumber,
                userRequestNumber:
                    props?.userRequestSelected?.purchaseRequestNumber,
            },
        });
    };

    return (
        <StyledModal
            title={`Asset request: ${props?.userRequestSelected?.purchaseRequestNumber}`}
            isOpen={true}
            onDismiss={closeModal}
            size={ModalSize.Medium}
        >
            <Stack horizontal horizontalAlign="space-between">
                <Stack>
                    <TextField
                        label="Priority:"
                        readOnly={true}
                        value={props?.userRequestSelected?.priority}
                        styles={inlineInputStyle}
                        borderless
                    />
                    <TextField
                        label="Category:"
                        readOnly={true}
                        value={props?.userRequestSelected?.categoryName}
                        styles={inlineInputStyle}
                        borderless
                    />
                </Stack>
                <Stack>
                    <TextField
                        label="Manager:"
                        readOnly={true}
                        value={props?.userRequestSelected?.approverName}
                        styles={inlineInputStyle}
                        borderless
                    />
                    <TextField
                        label="Approved on:"
                        readOnly={true}
                        value={convertDateToddMMMYYYFormat(
                            props?.userRequestSelected?.approvedOn
                        )}
                        styles={inlineInputStyle}
                        borderless
                    />
                </Stack>
            </Stack>
            <Stack horizontal horizontalAlign="space-between">
                <TextField
                    label="Requested by:"
                    readOnly={true}
                    value={props?.userRequestSelected?.associateName}
                    styles={inlineInputStyle}
                    borderless
                />
                <TextField
                    label="Requestor Email:"
                    readOnly={true}
                    value={props?.userRequestSelected?.submittedBy}
                    styles={inlineInputStyle}
                    borderless
                />
            </Stack>
            <Stack>
                <TextField
                    label="Network Company:"
                    readOnly={true}
                    value={props?.userRequestSelected?.networkCompanyName}
                    styles={inlineInputStyle}
                    borderless
                />
            </Stack>
            <Stack>
                <TextField
                    label="Justification / Purpose:"
                    multiline
                    rows={3}
                    maxLength={2500}
                    readOnly={true}
                    resizable={false}
                    value={props?.userRequestSelected?.purpose}
                    styles={textAreaStyleReadOnly}
                />
                <TextField
                    label="Manager Comments:"
                    multiline
                    rows={3}
                    readOnly={true}
                    maxLength={500}
                    resizable={false}
                    value={props?.userRequestSelected?.comments}
                    styles={textAreaStyleReadOnly}
                />
                <TextField
                    label="Admin comments:"
                    multiline
                    rows={3}
                    maxLength={500}
                    resizable={false}
                    value={adminComments}
                    styles={textAreaStyleReadOnly}
                    onChange={changeHandler}
                />
            </Stack>

            <Separator />
            <Stack horizontal tokens={{ childrenGap: 60 }}>
                {((assets && assets.length !== 0) ||
                    (assets &&
                        assets?.length === 0 &&
                        !props.userRequestSelected?.itrequestNumber)) &&
                    !isIssuedRequest && (
                        <TextField
                            label="Availability status:"
                            readOnly={true}
                            value={
                                assets && assets?.length === 0
                                    ? "No stock, procurement required."
                                    : filteredAssets?.length > 0
                                    ? filteredAssets?.length
                                    : "No items found."
                            }
                            styles={inlineInputStyle}
                            borderless
                        />
                    )}

                {props.userRequestSelected?.itrequestNumber && (
                    <>
                        <Stack horizontal>
                            <Label style={{ marginRight: "10px" }}>
                                Procurement ID:
                            </Label>
                            <Link onClick={handleClick}>
                                {props.userRequestSelected?.itrequestNumber}
                            </Link>
                        </Stack>
                    </>
                )}

                {assets?.length === 0 &&
                    !props.userRequestSelected?.itrequestNumber &&
                    !isIssuedRequest &&
                    props.userRequestSelected.status !== "Submitted" && (
                        <Checkbox
                            styles={checkBoxStyle}
                            boxSide="end"
                            label="Initiate procurement"
                            checked={
                                isRequestForQuote ||
                                props.userRequestSelected?.itrequestNumber
                            }
                            onChange={(e: any) => {
                                toggleRequestForQuote();
                            }}
                        />
                    )}
            </Stack>
            <Separator />
            {!isIssuedRequest && !assets
                ? Array.from({ length: 5 }).map((_, index) => (
                      <Shimmer
                          style={{
                              marginTop: "5px",
                              border: 0,
                              padding: "0px 10px 0px 10px",
                          }}
                          key={index}
                          shimmerElements={shimmerElements}
                      />
                  ))
                : null}
            {(assets &&
                assets.length > 0 &&
                props.userRequestSelected.status !== "Submitted") ||
            (assetDetails && assetDetails.length > 0) ? (
                <Stack
                    style={{
                        maxHeight: 150,
                        overflow: "auto",
                        overflowY: "auto",
                        overflowX: "hidden",
                    }}
                >
                    {!isIssuedRequest && (
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
                    )}
                    {isIssuedRequest && (
                        <Label style={{ marginRight: "10px" }}>
                            Issued Asset:
                        </Label>
                    )}
                    <StyledDetailsList
                        data={
                            isIssuedRequest
                                ? assetDetails ?? []
                                : filteredAssets ?? []
                        }
                        columns={_columns}
                        emptymessage="No assets found"
                        selectionMode="single"
                        onActiveItemChanged={onActiveItemChanged}
                        selection={selection}
                    />
                </Stack>
            ) : null}
            <StyleModalFooter>
                <div className="ms-Grid" dir="ltr">
                    <div className="ms-Grid-row">
                        <div
                            className={`ms-Grid-col ms-sm12 ${contentStyles.flexRight}`}
                        >
                            <DefaultButton
                                styles={buttonStyles}
                                onClick={() => props.dismissModal()}
                                disabled={isLoading}
                            >
                                {props.userRequestSelected.status ===
                                    "Issued" ||
                                props.userRequestSelected?.itrequestNumber
                                    ? "Back"
                                    : "Cancel"}
                            </DefaultButton>
                            <div hidden={isIssuedRequest}>
                                <PrimaryButton
                                    styles={buttonStyles}
                                    disabled={isLoading}
                                    onClick={saveRequest}
                                >
                                    {!isLoading ? (
                                        props.userRequestSelected.status ===
                                        "Submitted" ? (
                                            "Approve"
                                        ) : (
                                            "Save"
                                        )
                                    ) : (
                                        <>
                                            Saving
                                            <Spinner
                                                size={SpinnerSize.xSmall}
                                                style={{ marginLeft: "3px" }}
                                            />
                                        </>
                                    )}
                                </PrimaryButton>
                            </div>
                        </div>
                    </div>
                </div>
            </StyleModalFooter>
        </StyledModal>
    );
};

export default UserRequestModal;

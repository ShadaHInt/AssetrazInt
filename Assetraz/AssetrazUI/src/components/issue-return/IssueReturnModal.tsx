import React, { FormEvent, useCallback, useEffect, useState } from "react";
import {
    DefaultButton,
    Dropdown,
    IDropdownOption,
    IStackTokens,
    PrimaryButton,
    Separator,
    Stack,
    TextField,
} from "@fluentui/react";

import { getEmployees } from "../../services/user/userServices";
import { getAsset, issueAsset, returnAsset } from "../../services/assetService";

import {
    IIssueReturnModalType,
    AssetIssueReturnRequest,
    AssetDetails,
    ErrorTypes,
} from "./types";

import { AssetStatus } from "../../constants/AssetStatus";
import { AssetReturnReason } from "../../constants/AssetReturnReason";

import { User } from "../../types/User";
import StyledModal, {
    ModalSize,
    StyleModalFooter,
} from "../common/StyledModal";
import { convertUTCDateToLocalDate } from "../../Other/DateFormat";
import { SearchableDropdown } from "../common/SearchableDropdown";
import { dropdownStyles } from "../../pages/Admin/EmployeeAssets/EmployeeAssetsStyles";

const stackToken: IStackTokens = {
    childrenGap: 5,
    padding: 10,
};

const wrapStackTokens: IStackTokens = {
    childrenGap: 10,
};

const buttonStyles = { root: { margin: 8 } };
const inlineInputStyle = {
    root: {
        label: {
            whiteSpace: "nowrap",
            padding: "5px 5px 5px 0",
            lineHeight: 22,
            minWidth: 120,
            fontSize: 16,
        },
        lineHeight: "22px",
    },
    fieldGroup: { marginLeft: 10, minWidth: 200, width: "80%" },
    wrapper: { display: "flex" },
};

const input40 = {
    root: { minWidth: 200 },
};
const input50 = {
    root: { marginRight: "4%", width: "40%" },
};

const IssueReturnModal: React.FunctionComponent<IIssueReturnModalType> = (
    props: IIssueReturnModalType
) => {
    const {
        dismissPanel,
        inventoryId,
        purchaseRequestNumber,
        submittedBy,
        issuedTo,
    } = props;

    const [employees, setEmployees] = useState<any>([]);
    const [request, setRequest] = useState<any>();
    const [employeesListOptions, setEmployeesListOptions] = useState<any>();
    const [error, setError] = useState<number>();
    const [isValid, setIsValid] = useState<boolean | undefined>();
    const [assetDetails, setAssetDetails] = useState<
        AssetDetails | undefined | null
    >();
    const [isReturn, setIsReturn] = useState<boolean | undefined>();
    const [isLoading, setIsloading] = useState<boolean>(false);
    const [returnReason, setReturnReason] = useState<boolean>(true);
    const [employeeName, setEmployeeName] = useState<any>();

    useEffect(() => {
        setRequest((prevState: AssetIssueReturnRequest) => ({
            ...prevState,
            inventoryId: inventoryId,
        }));
        getEmployees()
            .then((res) => {
                setEmployees(res);
                transformEmployeesForListing(res);
            })
            .catch((err) => setEmployees(null));
        getAsset(inventoryId)
            .then((res) => {
                res && setAssetDetails(res);
                setRequest((prevState: AssetIssueReturnRequest) => ({
                    ...prevState,
                    emailId: res?.emailId,
                    employeeId: res?.employeeId,
                    issuedTo: res?.issuedTo,
                }));
                if (res?.assetStatus === AssetStatus.Issued) setIsReturn(true);
                else {
                    setIsReturn(false);
                }
                if (purchaseRequestNumber) {
                    setRequest((prevState: AssetIssueReturnRequest) => ({
                        ...prevState,
                        emailId: submittedBy,
                        issuedTo: issuedTo,
                        userRequestNumber: purchaseRequestNumber,
                    }));
                }
            })
            .catch((err) => setAssetDetails(null));
    }, [inventoryId]);

    const sentRequest = useCallback(async () => {
        setIsloading(true);
        let response = undefined;
        if (isReturn) {
            response = await returnAsset(request);
        } else {
            response = await issueAsset(request);
        }
        if (response) dismissPanel(true);
        setIsloading(false);

        if (response) {
            purchaseRequestNumber
                ? window.location.assign("/approved-requests")
                : dismissPanel(false);
        } else if (response === false) {
            setError(ErrorTypes.ALLREADY_ASSIGNED);
        } else {
            setError(ErrorTypes.GENERIC);
        }
    }, [request, dismissPanel, isReturn]);

    const transformEmployeesForListing = (employeesList: User[]): void => {
        const empList: IDropdownOption[] = employeesList.map((r: User) => ({
            text: r.displayName + " (" + r.jobTitle + ")",
            key: r.mail,
        }));
        setEmployeesListOptions(empList);
        if (submittedBy) {
            const emp = empList.filter(
                (item: any) => item.value === submittedBy
            )[0];
            setEmployeeName(emp);
        }
    };
    const Footer = useCallback(
        () => (
            <Stack horizontal horizontalAlign="end">
                <DefaultButton
                    styles={buttonStyles}
                    onClick={() =>
                        purchaseRequestNumber
                            ? window.location.assign("/approved-requests")
                            : dismissPanel(false)
                    }
                >
                    Cancel
                </DefaultButton>
                <PrimaryButton
                    styles={buttonStyles}
                    onClick={sentRequest}
                    disabled={
                        (purchaseRequestNumber ? false : !isValid) ||
                        request?.remarks?.trim().length === 0
                    }
                >
                    Save
                </PrimaryButton>
            </Stack>
        ),
        [sentRequest, dismissPanel, isValid]
    );

    const reasonChangeHandler = (
        e: FormEvent<HTMLDivElement>,
        item: IDropdownOption | undefined
    ): void => {
        if (item?.key === AssetReturnReason["Other"]) {
            setReturnReason(false);
            setIsValid(false);
        } else {
            setReturnReason(true);
            setIsValid(true);
        }
        setRequest((prevState: AssetIssueReturnRequest) => ({
            ...prevState,
            reason: item?.key,
        }));
    };

    const handleSelectionChange = (
        event: FormEvent<HTMLDivElement>,
        selectedOption?: IDropdownOption<any> | undefined,
        index?: number | undefined
    ) => {
        const selectedEmp = employees.filter(
            (employee: any) => employee.mail === selectedOption?.key
        )[0];
        setEmployeeName(selectedOption?.key);
        setRequest((prevState: AssetIssueReturnRequest) => ({
            ...prevState,
            issuedTo: selectedEmp?.displayName,
            emailId: selectedEmp?.mail,
        }));

        if (selectedEmp?.mail && selectedEmp?.displayName && !isReturn) {
            setIsValid(true);
        } else {
            setIsValid(false);
        }
    };

    return (
        <StyledModal
            isOpen={inventoryId ? true : false}
            onDismiss={() =>
                purchaseRequestNumber
                    ? window.location.assign("/approved-requests")
                    : dismissPanel(false)
            }
            title={
                isReturn === undefined ? "" : isReturn ? "Returns" : "Issuance"
            }
            secondaryTitle={
                assetDetails?.assetTagNumber &&
                `Asset Tag: ${assetDetails?.assetTagNumber}`
            }
            size={ModalSize.Medium}
            errorMessageBar={
                error
                    ? error === ErrorTypes.ALLREADY_ASSIGNED
                        ? `Asset already ${isReturn ? "returned" : "assigned"}`
                        : "Some Error occured"
                    : undefined
            }
            setErrorMessageBar={() => setError(undefined)}
            errorOccured={assetDetails === null || employees === null}
            isLoading={
                assetDetails === undefined ||
                employees?.length === 0 ||
                isLoading
            }
        >
            <Stack tokens={stackToken} style={{ minHeight: "650px" }}>
                <Stack
                    horizontal
                    tokens={wrapStackTokens}
                    horizontalAlign="start"
                >
                    <Stack>
                        <Stack>
                            <TextField
                                label="Category:"
                                readOnly
                                styles={inlineInputStyle}
                                borderless
                                name="categoryName"
                                value={assetDetails?.categoryName}
                            />
                            <TextField
                                label="Model Number:"
                                readOnly
                                styles={inlineInputStyle}
                                borderless
                                name="modelNumber"
                                value={assetDetails?.modelNumber}
                            />
                            <TextField
                                label="Manufacturer:"
                                readOnly
                                styles={inlineInputStyle}
                                borderless
                                name="manufacturerName"
                                value={assetDetails?.manufacturerName}
                            />
                        </Stack>
                        <TextField
                            label="PO Number:"
                            readOnly
                            styles={inlineInputStyle}
                            borderless
                            name="purchaseOrderNumber"
                            value={assetDetails?.purchaseOrderNumber}
                        />

                        <TextField
                            label="Invoice Number:"
                            readOnly
                            styles={inlineInputStyle}
                            borderless
                            name="invoiceNumber"
                            value={assetDetails?.invoiceNumber}
                        />
                    </Stack>
                    <Stack>
                        <TextField
                            label="Serial Number:"
                            readOnly
                            styles={inlineInputStyle}
                            borderless
                            name="serialNumber"
                            value={assetDetails?.serialNumber}
                        />
                        <TextField
                            label="Asset Value:"
                            readOnly
                            styles={inlineInputStyle}
                            borderless
                            name="assetValue"
                            value={assetDetails?.assetValue.toString()}
                        />
                        <TextField
                            label="Warranty Date:"
                            readOnly
                            styles={inlineInputStyle}
                            borderless
                            name="warrentyDate"
                            value={
                                assetDetails?.warrentyDate &&
                                convertUTCDateToLocalDate(
                                    new Date(assetDetails.warrentyDate)
                                ).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                })
                            }
                        />
                        <TextField
                            label="PO Date:"
                            readOnly
                            styles={inlineInputStyle}
                            borderless
                            name="requestRaisedOn"
                            value={
                                assetDetails?.requestRaisedOn &&
                                new Date(
                                    assetDetails.requestRaisedOn
                                ).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                })
                            }
                        />
                        <TextField
                            label="Invoice Date:"
                            readOnly
                            styles={inlineInputStyle}
                            borderless
                            name="invoiceDate"
                            value={
                                assetDetails?.invoiceDate &&
                                convertUTCDateToLocalDate(
                                    new Date(assetDetails.invoiceDate)
                                ).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                })
                            }
                        />
                    </Stack>
                </Stack>
                <Separator />
                <Stack wrap tokens={wrapStackTokens}>
                    <Stack.Item styles={input50}>
                        {isReturn || purchaseRequestNumber ? (
                            <TextField
                                label="Issued To :"
                                readOnly
                                styles={inlineInputStyle}
                                borderless
                                name="issuedTo"
                                value={
                                    purchaseRequestNumber
                                        ? issuedTo
                                        : assetDetails?.issuedTo
                                }
                            />
                        ) : null}
                        {!isReturn && !purchaseRequestNumber ? (
                            <>
                                <SearchableDropdown
                                    options={employeesListOptions}
                                    onChange={handleSelectionChange}
                                    placeholder="Select an employee"
                                    label={"Issued To"}
                                    styles={dropdownStyles}
                                    required={true}
                                    selectedKey={employeeName}
                                    errorMessage="This field is required"
                                />
                            </>
                        ) : null}
                    </Stack.Item>

                    <Stack.Item styles={input40}>
                        <TextField
                            label="Email ID :"
                            readOnly
                            styles={inlineInputStyle}
                            borderless
                            name="mail"
                            value={
                                purchaseRequestNumber
                                    ? submittedBy
                                    : request?.emailId
                            }
                        />
                    </Stack.Item>
                    {purchaseRequestNumber ||
                    assetDetails?.userRequestNumber ? (
                        <Stack.Item styles={input40}>
                            <TextField
                                label="User Request Number: "
                                readOnly
                                styles={inlineInputStyle}
                                borderless
                                name="purchaseRequestNumber"
                                value={
                                    purchaseRequestNumber
                                        ? purchaseRequestNumber
                                        : assetDetails?.userRequestNumber
                                }
                            />
                        </Stack.Item>
                    ) : null}
                </Stack>
                <Stack wrap tokens={wrapStackTokens} style={{ minHeight: 220 }}>
                    {/* Return dropdown stack */}
                    {isReturn && (
                        <>
                            <Stack.Item styles={input50}>
                                <Dropdown
                                    label="Reason for Return"
                                    options={Object.entries(
                                        AssetReturnReason
                                    ).map((a) => ({
                                        key: a[0],
                                        text: a[1],
                                    }))}
                                    onChange={reasonChangeHandler}
                                    required
                                    selectedKey={request?.reason}
                                />
                            </Stack.Item>

                            {returnReason === false && (
                                <Stack.Item styles={input40}>
                                    <TextField
                                        label="Remarks"
                                        name="remarks"
                                        multiline
                                        rows={3}
                                        maxLength={200}
                                        onChange={(e, newValue?: string) => {
                                            if (newValue?.length === 0) {
                                                setIsValid(false);
                                            } else {
                                                setIsValid(true);
                                            }
                                            setRequest(
                                                (
                                                    prevState: AssetIssueReturnRequest
                                                ) => ({
                                                    ...prevState,
                                                    remarks: newValue,
                                                })
                                            );
                                        }}
                                        placeholder="Please add remarks"
                                        hidden={returnReason}
                                        disabled={returnReason}
                                        onGetErrorMessage={(value: string) =>
                                            value === ""
                                                ? "Field cannot be empty!"
                                                : ""
                                        }
                                        validateOnLoad={false}
                                        validateOnFocusOut
                                        value={request?.remarks}
                                        required
                                    />
                                </Stack.Item>
                            )}
                        </>
                    )}
                </Stack>
            </Stack>
            <StyleModalFooter>
                <Footer />
            </StyleModalFooter>
        </StyledModal>
    );
};

export default IssueReturnModal;

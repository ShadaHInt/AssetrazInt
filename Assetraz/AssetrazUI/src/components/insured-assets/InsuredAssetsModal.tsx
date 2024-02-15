import {
    ChoiceGroup,
    DatePicker,
    DefaultButton,
    IChoiceGroupOption,
    IColumn,
    IconButton,
    IStackTokens,
    Label,
    PrimaryButton,
    ProgressIndicator,
    Separator,
    Stack,
    TextField,
    addDays,
} from "@fluentui/react";
import React, { FormEvent } from "react";
import { useCallback, useEffect, useState } from "react";
import { useBoolean } from "@fluentui/react-hooks";
import StyledModal, { StyleModalFooter } from "../common/StyledModal";
import StyledDetailsList from "../../components/common/StyledDetailsList";

import DashboardStyle from "../../pages/Home/DashboardStyles";
import {
    DeletePolicyFile,
    DownloadPolicyFile,
    getInsuranceDetails,
    updateAsset,
    uploadPolicy,
} from "../../services/insuranceService";

import {
    EditInsuredAsset,
    IInsuredAssetModalType,
    InsuredAssetRequest,
    IUploadPolicy,
} from "../../types/InsuredAsset";

import SytledDialog from "../common/StyledDialog";
import { InsuredAssetStatus } from "../../constants/InsuredAssetStatus";
import {
    ContainerDiv,
    HiddenInput,
    HiddenLabel,
    isValidFile,
    StyledDiv,
    StyledFontIcon,
    StyledSpan,
    TextOverflow,
} from "../common/FileInput";
import StyledLabel from "../common/StyledLabel";
import { convertUTCDateToLocalDate } from "../../Other/DateFormat";
const inlineInputStyle = {
    root: {
        margin: "15px 0px 0px 0px",
        label: {
            whiteSpace: "nowrap",
            padding: "5px 0px 0px 0px",
            lineHeight: 22,
            fontSize: 14,
        },
    },
    wrapper: { display: "flex" },
};

const radioStyle = {
    label: {
        display: "inline",
        padding: "0 20px 0px 0px",
    },
    flexContainer: {
        columnGap: "1em",
        display: "inline-flex",
        flexDirection: "row",
        flexWrap: "wrap",
    },
};

const stackToken: IStackTokens = {
    childrenGap: 12,
};

const wrapStackTokens: IStackTokens = {
    childrenGap: 15,
};

const InsuredAssetsModal: React.FunctionComponent<IInsuredAssetModalType> = (
    props: IInsuredAssetModalType
) => {
    const {
        selectedReferenceIds,
        referenceId,
        referenceNumber,
        dismissPanel,
        isModalOpen,
    } = props;
    const [asset, setAsset] = useState<InsuredAssetRequest[] | any>([]);
    const [editedData, setEditedData] = useState<InsuredAssetRequest[] | any>(
        []
    );
    const [initialData, setInitialData] = useState<InsuredAssetRequest[] | any>(
        []
    );
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [uploadPolicyFileName, setUploadPolicyFileName] =
        useState<string>("");
    const [uploadPolicyDetails, setUploadPolicyDetails] =
        useState<IUploadPolicy>();
    const [successMessage, setSuccessMessage] = useState<string>();
    const [errorMessage, setErrorMessage] = useState<string>();
    const [isDownloading, setIsDownloading] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [isPolicyFileChanged, setIsPolicyFileChanged] =
        useState<boolean>(false);
    const [isFileChanged, setIsFileChanged] = useState<boolean>(false);
    const [showDeleteDialog, { toggle: toggleDeleteDialog }] =
        useBoolean(false);
    const [isEdited, setIsEdited] = useState<boolean>(false);

    const modalSecondaryTitle = referenceNumber
        ? `Ref# : ${referenceNumber.toUpperCase()}`
        : "";
    const options: IChoiceGroupOption[] = [
        {
            key: "requestsubmitted",
            text: "Request Submitted",
            disabled: referenceNumber ? true : false,
            defaultChecked: referenceNumber ? true : false,
        },
        {
            key: "insured",
            text: "Insured",
            styles: { field: { marginLeft: "15px" } },
            disabled: referenceNumber ? false : true,
            defaultChecked: referenceNumber ? false : true,
        },
    ];

    useEffect(() => {
        const status = referenceNumber
            ? InsuredAssetStatus.Insured
            : InsuredAssetStatus["Request Submitted"];
        setEditedData((prevState: InsuredAssetRequest) => ({
            ...prevState,
            insuranceReferenceId: referenceId,
            status: status,
        }));
        setInitialData((prevState: InsuredAssetRequest) => ({
            ...prevState,
            insuranceReferenceId: referenceId,
            status: status,
        }));
        insuranceDetails();
    }, [selectedReferenceIds, referenceId, referenceNumber]);

    useEffect(() => {
        setIsEdited(JSON.stringify(initialData) === JSON.stringify(editedData));
    }, [editedData, initialData]);

    const insuranceDetails = useCallback(() => {
        getInsuranceDetails(selectedReferenceIds)
            .then((res) => {
                res && setAsset(res);
                setEditedData((prevState: InsuredAssetRequest) => ({
                    ...prevState,
                    insuranceReferenceId: referenceId,
                    insuranceOffice: res[0].insuranceOffice,
                    policyNumber: res[0].policyNumber,
                    policyStartDate: res[0].policyStartDate,
                    policyEndDate: res[0].policyEndDate,
                }));

                setInitialData((prevState: InsuredAssetRequest) => ({
                    ...prevState,
                    insuranceReferenceId: referenceId,
                    insuranceOffice: res[0].insuranceOffice,
                    policyNumber: res[0].policyNumber,
                    policyStartDate: res[0].policyStartDate,
                    policyEndDate: res[0].policyEndDate,
                }));
                setUploadPolicyDetails({
                    policyFilePath: res[0]?.policyFilePath,
                    policyFileName: res[0]?.policyFileName,
                    referenceNumber: referenceNumber,
                });
            })
            .catch((err) => setAsset(null));
    }, [referenceNumber]);

    const handleChangePolicy = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.currentTarget.files) {
            setUploadPolicyFileName(e.currentTarget.files[0].name);
            const policyFile = e.currentTarget.files[0];
            setUploadPolicyDetails({
                ...uploadPolicyDetails,
                policyFile: policyFile,
                policyFileName: uploadPolicyFileName,
                referenceNumber: referenceNumber,
            });
        }
        setIsPolicyFileChanged(true);
        setIsFileChanged(true);
    };
    const dateChangeHandler = (fieldName: string, value: any) => {
        setEditedData((preState: EditInsuredAsset) => ({
            ...preState,
            [fieldName]: value,
        }));
    };

    const changeHandler = (
        event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.currentTarget;
        setEditedData((preState: EditInsuredAsset) => ({
            ...preState,
            [name]: value,
        }));
    };

    const sentRequest = useCallback(async () => {
        setIsLoading(true);
        try {
            if (selectedReferenceIds) {
                var sendData = selectedReferenceIds.map(
                    (selectedReferenceId: string) => ({
                        insuranceReferenceId: selectedReferenceId,
                        policyNumber: editedData.policyNumber,
                        insuranceOffice: editedData.insuranceOffice.trim(),
                        policyStartDate: editedData.policyStartDate,
                        policyEndDate: editedData.policyEndDate,
                        status: editedData.status,
                    })
                );
                if (uploadPolicyDetails && isPolicyFileChanged) {
                    const isAllowedFormat = isValidFile(uploadPolicyFileName);
                    if (isAllowedFormat) {
                        setErrorMessage("");
                        try {
                            const res = await uploadPolicy(uploadPolicyDetails);
                            if (res === true) {
                                try {
                                    const response = await updateAsset(
                                        sendData
                                    );
                                    if (response && res === true) {
                                        setSuccessMessage(
                                            "Updated successfully!"
                                        );
                                        setIsLoading(false);
                                        dismissPanel(true);
                                    } else {
                                        setErrorMessage("Failed to update!");
                                        setIsLoading(false);
                                    }
                                } catch (err: any) {
                                    setErrorMessage(err);
                                    setIsLoading(false);
                                }
                            } else {
                                setErrorMessage("Failed to update!");
                                setIsLoading(false);
                            }
                        } catch (err: any) {
                            setErrorMessage(err);
                            setIsLoading(false);
                        }
                    } else {
                        setErrorMessage("Invalid file format");
                        setIsLoading(false);
                        return;
                    }
                } else {
                    const response = await updateAsset(sendData);
                    if (response === true) {
                        setSuccessMessage("Updated successfully!");
                        setIsLoading(false);
                        dismissPanel(true);
                    } else {
                        setErrorMessage("Failed to update!");
                        setIsLoading(false);
                    }
                }
            }
        } catch (err: any) {
            setErrorMessage(err);
            setIsLoading(false);
        }
    }, [
        selectedReferenceIds,
        uploadPolicyDetails,
        isPolicyFileChanged,
        editedData.policyNumber,
        editedData.insuranceOffice,
        editedData.policyStartDate,
        editedData.policyEndDate,
        editedData.status,
        uploadPolicyFileName,
        dismissPanel,
    ]);

    const downloadHandler = useCallback(async () => {
        setIsDownloading(true);
        try {
            const response = await DownloadPolicyFile(
                referenceNumber,
                asset[0]?.policyFileName
            );
            setIsDownloading(false);
            if (response === true) {
                setSuccessMessage("Policy downloaded successfully");
            } else {
                setErrorMessage("Policy file downloaded failed");
            }
        } catch (err: any) {
            setErrorMessage(err);
        }
    }, [referenceNumber, setSuccessMessage, setErrorMessage, asset]);

    const deletePolicyHandler = useCallback(async () => {
        toggleDeleteDialog();
        setIsDeleting(true);
        await DeletePolicyFile(referenceNumber)
            .then((res) => {
                if (res === true) {
                    setSuccessMessage("Deleted policy file successfully!");
                    setIsFileChanged(true);
                } else {
                    setErrorMessage("Failed to delete file");
                }
            })
            .catch((err: any) => {
                setErrorMessage(err);
            });
        setIsDeleting(false);
        setUploadPolicyDetails({ referenceNumber: referenceNumber });
    }, [
        referenceNumber,
        setSuccessMessage,
        setErrorMessage,
        toggleDeleteDialog,
    ]);

    const validEditedInsuredData = useCallback(() => {
        return (
            editedData &&
            editedData.insuranceOffice?.trim() &&
            editedData.policyNumber?.trim() &&
            editedData.policyStartDate &&
            editedData.policyEndDate
        );
    }, [editedData]);

    const DeleteDialog = useCallback(() => {
        return (
            <SytledDialog
                showDialog={showDeleteDialog}
                toggleDialog={toggleDeleteDialog}
                title="Delete Policy File"
                subText="Are you sure you want to delete?"
                action={deletePolicyHandler}
            />
        );
    }, [showDeleteDialog, toggleDeleteDialog, deletePolicyHandler]);

    const _columns: IColumn[] = [
        {
            key: "purchaseOrderNumber",
            name: "PO Number",
            fieldName: "purchaseOrderNumber",
            minWidth: 75,
            isResizable: true,
        },
        {
            key: "pogeneratedOn",
            name: "PO Date",
            fieldName: "pogeneratedOn",
            minWidth: 75,
            isResizable: true,
            onRender: (item: InsuredAssetRequest) => {
                if (!item.pogeneratedOn) {
                    return "";
                }
                return new Date(item.pogeneratedOn).toLocaleDateString(
                    "en-GB",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    }
                );
            },
        },
        {
            key: "invoiceNumber",
            name: "Invoice Number",
            fieldName: "invoiceNumber",
            minWidth: 75,
            isResizable: true,
        },
        {
            key: "invoiceDate",
            name: "Invoice Date",
            fieldName: "invoiceDate",
            minWidth: 75,
            isResizable: true,
            onRender: (item: InsuredAssetRequest) => {
                if (!item.invoiceDate) {
                    return "";
                }
                return convertUTCDateToLocalDate(
                    new Date(item.invoiceDate)
                ).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                });
            },
        },
        {
            key: "categoryName",
            name: "Category",
            fieldName: "categoryName",
            minWidth: 75,
            isResizable: true,
        },
        {
            key: "manufacturerName",
            name: "Manufacturer",
            fieldName: "manufacturerName",
            minWidth: 75,
            isResizable: true,
        },
        {
            key: "modelNumber",
            name: "Model Number",
            fieldName: "modelNumber",
            minWidth: 75,
            isResizable: true,
        },
        {
            key: "warrentyDate",
            name: "Warranty Date",
            fieldName: "warrentyDate",
            minWidth: 75,
            isResizable: true,
            onRender: (item: InsuredAssetRequest) => {
                if (!item.warrentyDate) {
                    return "";
                }
                return convertUTCDateToLocalDate(
                    new Date(item.warrentyDate)
                ).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                });
            },
        },
        {
            key: "serialNumber",
            name: "Serial Number",
            fieldName: "serialNumber",
            minWidth: 100,
            isResizable: true,
        },
        {
            key: "assetTagNumber",
            name: "Asset Tag#",
            fieldName: "assetTagNumber",
            minWidth: 75,
            isResizable: true,
        },
        {
            key: "assetValue",
            name: "Asset Value",
            fieldName: "assetValue",
            minWidth: 75,
            isResizable: true,
        },
    ];

    const Footer = () => {
        return (
            <Stack horizontal horizontalAlign="end">
                <DefaultButton
                    styles={DashboardStyle.buttonStyles}
                    text="Cancel"
                    onClick={() => dismissPanel(false)}
                />
                <PrimaryButton
                    text="Save"
                    styles={DashboardStyle.buttonStyles}
                    onClick={sentRequest}
                    disabled={
                        referenceNumber
                            ? isFileChanged
                                ? !validEditedInsuredData()
                                : !(!isEdited && validEditedInsuredData())
                            : !(
                                  editedData &&
                                  editedData.insuranceOffice?.trim()
                              )
                    }
                />
            </Stack>
        );
    };

    return (
        <StyledModal
            isOpen={isModalOpen}
            onDismiss={() => dismissPanel(false)}
            title="Update Insurance Status"
            secondaryTitle={modalSecondaryTitle}
            isLoading={isLoading || asset[0] === undefined}
            setSuccessMessageBar={setSuccessMessage}
            successMessageBar={successMessage}
            setErrorMessageBar={setErrorMessage}
            errorMessageBar={errorMessage}
        >
            <DeleteDialog />
            <Stack>
                <Stack tokens={stackToken}>
                    <Stack horizontal tokens={wrapStackTokens}>
                        <Stack style={{ width: "28%" }}>
                            <TextField
                                label="Insurer "
                                styles={inlineInputStyle}
                                size={15}
                                name="insuranceOffice"
                                value={editedData?.insuranceOffice}
                                onChange={changeHandler}
                                required
                            />
                        </Stack>
                        <Stack style={{ width: "30%", marginLeft: "25px" }}>
                            <div style={{ display: "flex" }}>
                                <StyledLabel
                                    text="Policy Number"
                                    isMandatory={referenceNumber ? true : false}
                                ></StyledLabel>
                                <TextField
                                    styles={inlineInputStyle}
                                    name="policyNumber"
                                    size={15}
                                    value={editedData?.policyNumber}
                                    disabled={
                                        referenceNumber === "" ? true : false
                                    }
                                    onChange={changeHandler}
                                />
                            </div>
                        </Stack>

                        <Stack style={{ width: "32%" }}>
                            <div style={{ display: "flex" }}>
                                <StyledLabel
                                    text="Policy Start Date"
                                    isMandatory={referenceNumber ? true : false}
                                ></StyledLabel>
                                <DatePicker
                                    styles={{
                                        root: {
                                            width: "150px",
                                            marginTop: "16px",
                                        },
                                    }}
                                    value={
                                        editedData?.policyStartDate &&
                                        convertUTCDateToLocalDate(
                                            new Date(
                                                editedData?.policyStartDate
                                            )
                                        )
                                    }
                                    disabled={
                                        referenceNumber === "" ? true : false
                                    }
                                    onSelectDate={(e) => {
                                        dateChangeHandler("policyStartDate", e);
                                    }}
                                    minDate={new Date()}
                                    maxDate={
                                        editedData?.policyEndDate &&
                                        addDays(
                                            new Date(editedData?.policyEndDate),
                                            -1
                                        )
                                    }
                                    placeholder={
                                        referenceNumber ? "Select date" : ""
                                    }
                                    initialPickerDate={
                                        editedData.policyStartDate
                                            ? editedData.policyStartDate &&
                                              convertUTCDateToLocalDate(
                                                  editedData.policyStartDate
                                              )
                                            : new Date()
                                    }
                                />
                            </div>
                        </Stack>

                        <Stack style={{ width: "31%" }}>
                            <div style={{ display: "flex" }}>
                                <StyledLabel
                                    text="Policy End Date"
                                    isMandatory={referenceNumber ? true : false}
                                ></StyledLabel>
                                <DatePicker
                                    styles={{
                                        root: {
                                            width: "150px",
                                            marginTop: "16px",
                                        },
                                    }}
                                    value={
                                        editedData.policyEndDate &&
                                        convertUTCDateToLocalDate(
                                            new Date(editedData.policyEndDate)
                                        )
                                    }
                                    disabled={
                                        referenceNumber === "" ||
                                        !editedData.policyStartDate
                                            ? true
                                            : false
                                    }
                                    onSelectDate={(e) => {
                                        dateChangeHandler("policyEndDate", e);
                                    }}
                                    minDate={
                                        editedData?.policyStartDate
                                            ? addDays(
                                                  new Date(
                                                      editedData?.policyStartDate
                                                  ),
                                                  1
                                              )
                                            : new Date()
                                    }
                                    placeholder={
                                        referenceNumber ? "Select date" : ""
                                    }
                                    initialPickerDate={
                                        editedData.policyEndDate
                                            ? editedData.policyEndDate &&
                                              convertUTCDateToLocalDate(
                                                  editedData.policyEndDate
                                              )
                                            : new Date()
                                    }
                                />
                            </div>
                        </Stack>
                    </Stack>
                    <Stack horizontal>
                        <Stack style={{ width: "50%" }}>
                            <ChoiceGroup
                                className="inline-block"
                                label="Insurance Status "
                                styles={radioStyle}
                                options={options}
                                defaultSelectedKey={
                                    referenceNumber
                                        ? "insured"
                                        : "requestsubmitted"
                                }
                            />
                        </Stack>
                        {referenceNumber ? (
                            <Stack style={{ width: "58%" }}>
                                <div
                                    style={{
                                        display: "flex",
                                        marginLeft: "12px",
                                    }}
                                >
                                    <Label
                                        style={{ margin: "0px 18px 18px 18px" }}
                                    >
                                        Policy
                                    </Label>
                                    <Stack style={{ width: "32%" }}>
                                        {isDownloading || isDeleting ? (
                                            <ProgressIndicator
                                                label={
                                                    isDeleting
                                                        ? "Deleting"
                                                        : "Downloading"
                                                }
                                                description="Please wait"
                                            />
                                        ) : uploadPolicyDetails?.policyFilePath &&
                                          uploadPolicyDetails?.policyFilePath
                                              .length > 0 ? (
                                            <Stack
                                                horizontal
                                                tokens={{ childrenGap: 10 }}
                                            >
                                                <IconButton
                                                    iconProps={{
                                                        iconName: "Download",
                                                        style: {
                                                            color: "black",
                                                        },
                                                    }}
                                                    onClick={downloadHandler}
                                                />
                                                <IconButton
                                                    iconProps={{
                                                        iconName: "Delete",
                                                        style: { color: "red" },
                                                    }}
                                                    onClick={toggleDeleteDialog}
                                                />
                                            </Stack>
                                        ) : (
                                            <>
                                                <HiddenLabel>
                                                    <HiddenInput
                                                        accept=".eml, .pdf, .jpeg, .jpg, .png"
                                                        type="file"
                                                        onChange={
                                                            handleChangePolicy
                                                        }
                                                        disabled={
                                                            referenceNumber ===
                                                            ""
                                                                ? true
                                                                : false
                                                        }
                                                    />
                                                    <ContainerDiv>
                                                        <StyledDiv>
                                                            <TextOverflow
                                                                title={
                                                                    uploadPolicyFileName
                                                                }
                                                            >
                                                                {
                                                                    uploadPolicyFileName
                                                                }
                                                            </TextOverflow>
                                                            <StyledFontIcon
                                                                aria-label="Upload"
                                                                iconName="Upload"
                                                            />
                                                        </StyledDiv>
                                                    </ContainerDiv>
                                                    <StyledSpan>
                                                        File types : eml, pdf,
                                                        jpeg, jpg, png
                                                    </StyledSpan>
                                                </HiddenLabel>
                                            </>
                                        )}
                                    </Stack>
                                </div>
                            </Stack>
                        ) : (
                            ""
                        )}
                    </Stack>
                </Stack>
                <Separator />
                <StyledDetailsList data={asset} columns={_columns} />
                <StyleModalFooter>
                    <Footer />
                </StyleModalFooter>
            </Stack>
        </StyledModal>
    );
};
export default InsuredAssetsModal;

import {
    DatePicker,
    DefaultButton,
    DirectionalHint,
    IColumn,
    IIconProps,
    IStackProps,
    IStackStyles,
    IStackTokens,
    Label,
    PrimaryButton,
    ProgressIndicator,
    Separator,
    Stack,
    TextField,
    TooltipHost,
} from "@fluentui/react";
import React, { ChangeEvent, useEffect } from "react";
import { useCallback, useState } from "react";
import { useBoolean } from "@fluentui/react-hooks";
import SytledDialog from "../../../components/common/StyledDialog";
import DashboardStyle from "../../Home/DashboardStyles";
import StyledModal, {
    ModalSize,
    StyleModalFooter,
} from "../../../components/common/StyledModal";
import StyledDetailsList from "../../../components/common/StyledDetailsList";
import { IOldAsset, IOldAssetModalType } from "../../../types/OldAsset";
import {
    HiddenLabel,
    StyledDiv,
    TextOverflow,
} from "../../Admin/PurchaseOrderPage/PurchaseOrderStyles";
import {
    ContainerDiv,
    HiddenInput,
    StyledFontIcon,
    StyledSpan,
    isValidFile,
} from "../../../components/common/FileInput";
import { Invoice } from "../../../types/PurchaseOrder";
import {
    DeleteInvoice,
    DownloadInvoice,
    UploadInvoiceForOldAsset,
} from "../../../services/invoiceService";
import { convertUTCDateToLocalDate } from "../../../Other/DateFormat";

const downloadIcon: IIconProps = { iconName: "download" };

const stackTokens = { childrenGap: 50 };
const stackStyles: Partial<IStackStyles> = { root: { width: 250 } };
const columnProps: Partial<IStackProps> = {
    tokens: { childrenGap: 15 },
    styles: {
        root: {
            width: 900,
            justifyContent: "space-between",
        },
    },
    horizontal: true,
};

const calloutProps = { gapSpace: 0 };
const addIcon: IIconProps = {
    iconName: "Delete",
    style: {
        color: "red",
    },
};

const stackToken: IStackTokens = {
    childrenGap: 12,
};

const wrapStackTokens: IStackTokens = {
    childrenGap: 15,
};

const OldAssetsModal: React.FunctionComponent<IOldAssetModalType> = (
    props: IOldAssetModalType
) => {
    const {
        selectedReferenceIdAssets,
        selectedAssets,
        selectedReferenceNumber,
        dismissPanel,
        isModalOpen,
        isAccountsAdmin,
    } = props;
    const [uploadInvoiceFileName, setUploadInvoiceFileName] =
        useState<string>("");
    const [isInvoiceDownloading, setIsInvoiceDownloading] =
        useState<boolean>(false);
    const [isInvoiceDeleting, setIsInvoiceDeleting] = useState<boolean>(false);
    const [modalLoading, setModalLoading] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>();
    const [errorMessage, setErrorMessage] = useState<string>();
    const [invoiceUploadDetails, setInvoiceUploadDetails] = useState<any>();
    const [showDeleteDialog, { toggle: toggleDeleteDialog }] =
        useBoolean(false);

    const deleteInvoiceHandler = useCallback(async () => {
        setIsInvoiceDeleting(true);
        toggleDeleteDialog();
        try {
            let successCount = 0;
            let errorCount = 0;

            await Promise.all(
                selectedReferenceIdAssets!.map(async (asset) => {
                    const response = await DeleteInvoice(
                        asset?.invoiceId as string
                    );
                    if (response) {
                        successCount++;
                    } else {
                        errorCount++;
                    }
                })
            );

            if (successCount === selectedReferenceIdAssets!.length) {
                setSuccessMessage("Invoice files deleted successfully");
                setIsInvoiceDeleting(false);
                dismissPanel(true);
            } else if (errorCount === selectedReferenceIdAssets!.length) {
                setIsInvoiceDeleting(false);
                setErrorMessage("Invoice files deletion failed");
            }
        } catch (err: any) {
            setIsInvoiceDeleting(false);
            setErrorMessage(err);
        }
    }, [dismissPanel, selectedReferenceIdAssets, toggleDeleteDialog]);

    const DeleteDialog = useCallback(() => {
        return (
            <SytledDialog
                showDialog={showDeleteDialog}
                toggleDialog={toggleDeleteDialog}
                title="Delete Invoice details"
                subText="Are you sure you want to delete?"
                action={deleteInvoiceHandler}
            />
        );
    }, [showDeleteDialog, toggleDeleteDialog, deleteInvoiceHandler]);

    useEffect(() => {
        if (!isModalOpen) {
            setUploadInvoiceFileName("");
            setInvoiceUploadDetails(null);
        }
    }, [isModalOpen]);

    const Footer = () => {
        return (
            <Stack horizontal horizontalAlign="end">
                <DefaultButton
                    styles={DashboardStyle.buttonStyles}
                    text="Cancel"
                    onClick={() => {
                        dismissPanel(false);
                    }}
                />
                {(selectedAssets?.some((item) => item.invoiceNumber) ||
                    selectedReferenceIdAssets?.some(
                        (item) => item.invoiceNumber
                    )) &&
                !isAccountsAdmin ? (
                    <Stack.Item
                        style={{
                            width: "20%",
                        }}
                    >
                        {isInvoiceDeleting ? (
                            <ProgressIndicator label={"Deleting"} />
                        ) : (
                            <DefaultButton
                                text="Delete"
                                styles={DashboardStyle.buttonStyles}
                                iconProps={addIcon}
                                onClick={toggleDeleteDialog}
                                disabled={isInvoiceDownloading}
                            />
                        )}
                    </Stack.Item>
                ) : !isAccountsAdmin ? (
                    <PrimaryButton
                        text="Save"
                        styles={DashboardStyle.buttonStyles}
                        onClick={uploadInvoice}
                        disabled={
                            !(
                                invoiceUploadDetails &&
                                invoiceUploadDetails.invoiceDate &&
                                invoiceUploadDetails.invoiceNumber &&
                                invoiceUploadDetails.invoiceNumber.trim()
                                    .length > 0 &&
                                invoiceUploadDetails.invoiceFile
                            )
                        }
                    />
                ) : null}
            </Stack>
        );
    };

    const handleFile = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            if (e.target.files) {
                const file = e.target.files[0];
                setUploadInvoiceFileName(e.target.files[0].name);
                if (!e.target.files) return;
                setInvoiceUploadDetails((preState: Invoice) => ({
                    ...preState,
                    invoiceFile: file,
                }));
            }
        },
        [setInvoiceUploadDetails]
    );
    const handleInvoiceNumber = useCallback(
        (e: any, value?: string) => {
            e.preventDefault();
            const field = e.target.name;
            setInvoiceUploadDetails({
                ...invoiceUploadDetails,
                [field]: value,
            });
        },
        [invoiceUploadDetails, setInvoiceUploadDetails]
    );

    const handleInvoiceDate = useCallback(
        (value: any) => {
            if (value) {
                const invDate = new Date(value);
                setInvoiceUploadDetails({
                    ...invoiceUploadDetails,
                    invoiceDate: invDate,
                });
            }
        },
        [invoiceUploadDetails, setInvoiceUploadDetails]
    );

    const invoiceDownloadHandler = useCallback(async () => {
        setIsInvoiceDownloading(true);
        try {
            const response = await DownloadInvoice(
                selectedReferenceIdAssets![0].invoiceId as string,
                selectedReferenceIdAssets![0].fileName as string
            );
            setIsInvoiceDownloading(false);
            if (response === true) {
                setSuccessMessage("Invoice file downloaded successfully");
            } else {
                setErrorMessage("Invoice file download failed");
            }
        } catch (err: any) {
            setIsInvoiceDownloading(false);
            setErrorMessage(err);
        }
    }, [
        selectedReferenceIdAssets,
        setIsInvoiceDownloading,
        setSuccessMessage,
        setErrorMessage,
    ]);

    const uploadInvoice = useCallback(async () => {
        setModalLoading(true);
        const inventoryIds = selectedAssets!.map(
            (element) => element.inventoryId
        );
        if (inventoryIds) {
            if (!isValidFile(invoiceUploadDetails.invoiceFile.name)) {
                setErrorMessage("Unsupported file type");
                setModalLoading(false);
                return;
            }
            try {
                const response = await UploadInvoiceForOldAsset(
                    invoiceUploadDetails,
                    inventoryIds as string[]
                );
                if (response) {
                    setSuccessMessage("Invoice file uploaded successfully");
                    setModalLoading(false);
                    dismissPanel(true);
                } else {
                    setErrorMessage("Invoice file upload failed");
                    setModalLoading(false);
                }
            } catch (err: any) {
                setIsInvoiceDownloading(false);
                setErrorMessage(err);
                setModalLoading(false);
            }
        }
    }, [dismissPanel, invoiceUploadDetails, selectedAssets]);

    const _columns: IColumn[] = [
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
            minWidth: 90,
            maxWidth: 100,
            isResizable: true,
        },
        {
            key: "assetTagNumber",
            name: "Asset Tag#",
            fieldName: "assetTagNumber",
            minWidth: 90,
            maxWidth: 100,
            isResizable: true,
        },
    ];

    return (
        <StyledModal
            isOpen={isModalOpen}
            onDismiss={() => dismissPanel(false)}
            title={selectedReferenceNumber ? "Invoice details" : "Add Invoice"}
            isLoading={selectedAssets === undefined || modalLoading}
            setSuccessMessageBar={setSuccessMessage}
            successMessageBar={successMessage}
            setErrorMessageBar={setErrorMessage}
            errorMessageBar={errorMessage}
            size={ModalSize.Medium}
        >
            <DeleteDialog />
            <Stack>
                {/* header */}
                <Stack tokens={stackToken}>
                    <Stack horizontal tokens={wrapStackTokens}>
                        {
                            <Stack
                                horizontal
                                tokens={stackTokens}
                                styles={stackStyles}
                            >
                                <Stack {...columnProps}>
                                    {selectedReferenceNumber ? (
                                        <>
                                            <Stack>
                                                <Label>Invoice Number:</Label>
                                                <TooltipHost
                                                    content={
                                                        selectedReferenceIdAssets
                                                            ? selectedReferenceIdAssets[0]
                                                                  ?.invoiceNumber
                                                            : ""
                                                    }
                                                    calloutProps={calloutProps}
                                                    directionalHint={
                                                        DirectionalHint.topLeftEdge
                                                    }
                                                >
                                                    <TextField
                                                        styles={{
                                                            root: {
                                                                width: "210px",
                                                            },
                                                        }}
                                                        value={
                                                            selectedReferenceIdAssets &&
                                                            selectedReferenceIdAssets[0]
                                                                ?.invoiceNumber
                                                        }
                                                        borderless
                                                        readOnly
                                                    />
                                                </TooltipHost>
                                            </Stack>
                                            <TextField
                                                label="Invoice Date:"
                                                value={
                                                    selectedReferenceIdAssets &&
                                                    selectedReferenceIdAssets[0]
                                                        .invoiceDate &&
                                                    convertUTCDateToLocalDate(
                                                        selectedReferenceIdAssets[0]
                                                            .invoiceDate
                                                    ).toLocaleDateString(
                                                        "en-GB",
                                                        {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric",
                                                        }
                                                    )
                                                }
                                                borderless
                                                styles={{
                                                    root: { width: "210px" },
                                                }}
                                                readOnly
                                            />
                                            {selectedReferenceIdAssets?.some(
                                                (item) => item.invoiceNumber
                                            ) ? (
                                                <Stack.Item align="center">
                                                    {isInvoiceDownloading ? (
                                                        <ProgressIndicator label="Downloading" />
                                                    ) : (
                                                        <DefaultButton
                                                            style={{
                                                                marginTop:
                                                                    "8px",
                                                            }}
                                                            text="Invoice"
                                                            iconProps={
                                                                downloadIcon
                                                            }
                                                            disabled={
                                                                isInvoiceDownloading
                                                            }
                                                            onClick={
                                                                invoiceDownloadHandler
                                                            }
                                                        />
                                                    )}
                                                </Stack.Item>
                                            ) : null}
                                        </>
                                    ) : (
                                        <>
                                            <TextField
                                                label="Invoice Number:"
                                                name="invoiceNumber"
                                                styles={{
                                                    root: { width: "210px" },
                                                }}
                                                maxLength={40}
                                                value={
                                                    invoiceUploadDetails?.invoiceNumber ??
                                                    ""
                                                }
                                                onChange={handleInvoiceNumber}
                                                validateOnFocusOut={true}
                                                validateOnLoad={false}
                                                onGetErrorMessage={(
                                                    value: string
                                                ) => {
                                                    if (value.length === 0) {
                                                        return "Invoice Number is required";
                                                    } else if (!value?.trim()) {
                                                        return "Invalid Invoice number";
                                                    } else {
                                                        return "";
                                                    }
                                                }}
                                            />
                                            <DatePicker
                                                label="Invoice Date:"
                                                styles={{
                                                    root: { width: "210px" },
                                                }}
                                                value={
                                                    selectedAssets &&
                                                    selectedAssets[0]
                                                        ?.invoiceDate
                                                        ? new Date(
                                                              selectedAssets[0].invoiceDate
                                                          )
                                                        : undefined
                                                }
                                                onSelectDate={handleInvoiceDate}
                                                maxDate={new Date()}
                                                placeholder={
                                                    selectedReferenceNumber
                                                        ? "Select date"
                                                        : ""
                                                }
                                            />
                                            <div style={{ marginLeft: "12px" }}>
                                                <Label>Invoice:</Label>
                                                <HiddenLabel>
                                                    <HiddenInput
                                                        accept=".eml, .pdf, .jpeg, .jpg, .png"
                                                        type="file"
                                                        onChange={handleFile}
                                                        disabled={
                                                            selectedReferenceNumber ===
                                                            ""
                                                        }
                                                    />
                                                    <ContainerDiv>
                                                        <StyledDiv>
                                                            <TextOverflow
                                                                title={
                                                                    uploadInvoiceFileName
                                                                }
                                                            >
                                                                {
                                                                    uploadInvoiceFileName
                                                                }
                                                            </TextOverflow>
                                                            <StyledFontIcon
                                                                aria-label="Upload"
                                                                iconName="Upload"
                                                            />
                                                        </StyledDiv>
                                                    </ContainerDiv>
                                                    <StyledSpan>
                                                        File types: eml, pdf,
                                                        jpeg, jpg, png
                                                    </StyledSpan>
                                                </HiddenLabel>
                                            </div>
                                        </>
                                    )}
                                </Stack>
                            </Stack>
                        }
                    </Stack>
                </Stack>
                {/* end of header */}
                <Separator />
                {selectedReferenceNumber && selectedReferenceIdAssets ? (
                    <StyledDetailsList
                        data={selectedReferenceIdAssets}
                        columns={_columns}
                    />
                ) : selectedAssets && selectedAssets?.length > 0 ? (
                    <StyledDetailsList
                        data={selectedAssets}
                        columns={_columns}
                    />
                ) : null}
                <StyleModalFooter>
                    <Footer />
                </StyleModalFooter>
            </Stack>
        </StyledModal>
    );
};
export default OldAssetsModal;

import {
    Checkbox,
    IconButton,
    ProgressIndicator,
    Separator,
    Stack,
    TextField,
} from "@fluentui/react";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useBoolean } from "@fluentui/react-hooks";
import {
    ContainerDiv,
    HiddenInput,
    StyledFontIcon,
    StyledSpan,
} from "../../../components/common/FileInput";
import {
    DeleteVendorQuote,
    DownloadVendorQuote,
} from "../../../services/procurementService";
import { IQuoteVendors } from "../../../types/Procurement";
import {
    HiddenLabel,
    StyledDiv,
    TextOverflow,
} from "../PurchaseOrderPage/PurchaseOrderStyles";
import SytledDialog from "../../../components/common/StyledDialog";

const VendorParticipationLineItem = ({
    vendorDetails,
    setVendorQuoteUploadDetails,
    setSuccessMessageModal,
    setNeedsRefresh,
    setFailure,
    isReadOnly,
    vendorQuoteUploadDetails,
}: any) => {
    const [isShortListed, setIsShortListed] = useState(
        vendorDetails?.isShortListed
    );
    const [isDownloading, setIsDownloading] = useState<boolean>(false);
    const [deleteVendorQuoteDialog, { toggle: toggleDeleteVendorQuoteDialog }] =
        useBoolean(false);
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [fileName, setFileName] = useState("");

    const { procurementVendorId } = vendorDetails;

    useEffect(() => {
        setFileName(vendorDetails.fileName);
    }, [vendorDetails.fileName]);

    useEffect(() => {
        const isNotShortListed: boolean =
            vendorQuoteUploadDetails?.filter(
                (v: IQuoteVendors) => v.isShortListed === true
            ).length === 0;
        isNotShortListed && setIsDisabled(!isNotShortListed);
    }, [vendorQuoteUploadDetails]);

    useEffect(() => {
        const isShortListed: boolean =
            vendorQuoteUploadDetails?.filter(
                (v: IQuoteVendors) => v.isShortListed === true
            ).length > 0;
        isShortListed && setIsDisabled(isShortListed);
    }, []);

    const handleFile = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            if (e.target.files) {
                setIsDisabled(false);
                const file = e.target.files[0];
                setFileName(e.target.files[0].name);
                if (!e.target.files) return;

                setVendorQuoteUploadDetails((preState: IQuoteVendors[]) =>
                    preState.map((element) =>
                        element.procurementVendorId === procurementVendorId
                            ? Object.assign({}, element, {
                                  ...element,
                                  quoteFile: file,
                              })
                            : element
                    )
                );
            }
        },
        [setVendorQuoteUploadDetails, procurementVendorId]
    );

    const handleCheckbox = useCallback(
        (ev?, checked?: boolean): void => {
            setIsShortListed(checked);
            setVendorQuoteUploadDetails((preState: IQuoteVendors[]) =>
                preState.map((element) =>
                    element.procurementVendorId === procurementVendorId
                        ? Object.assign({}, element, {
                              ...element,
                              isShortListed: checked,
                          })
                        : element
                )
            );
        },
        [setVendorQuoteUploadDetails, procurementVendorId]
    );

    const downloadHandler = useCallback(async () => {
        setIsDownloading(true);
        try {
            const response = await DownloadVendorQuote(
                procurementVendorId,
                vendorDetails?.fileName
            );
            setIsDownloading(false);
            if (response === true) {
                setSuccessMessageModal("Quote file downloaded successfully");
            } else {
                setFailure("Quote file downloaded failed");
            }
        } catch (err) {
            setFailure(err);
        }
    }, [
        vendorDetails,
        procurementVendorId,
        setSuccessMessageModal,
        setFailure,
    ]);

    const deleteVendorQuoteHandler = useCallback(async () => {
        toggleDeleteVendorQuoteDialog();
        setVendorQuoteUploadDetails((preState: IQuoteVendors[]) =>
            preState.map((element) =>
                element.procurementVendorId === procurementVendorId
                    ? Object.assign({}, element, {
                          ...element,
                          isShortListed: false,
                      })
                    : element
            )
        );
        setIsDeleting(true);
        await DeleteVendorQuote(procurementVendorId)
            .then((res) => {
                if (res === true) {
                    vendorDetails.fileName = "";
                    setSuccessMessageModal("Deleted quote file successfully!");
                } else {
                    setFailure("Deleting file failed");
                }
            })
            .catch((err) => {
                setFailure(err);
            });
        setIsShortListed(false);
        setNeedsRefresh(true);
        setIsDeleting(false);
    }, [
        toggleDeleteVendorQuoteDialog,
        setVendorQuoteUploadDetails,
        procurementVendorId,
        setNeedsRefresh,
        vendorDetails,
        setSuccessMessageModal,
        setFailure,
    ]);

    const DeleteVendorQuoteConfirmationDialog = useCallback(() => {
        return (
            <SytledDialog
                showDialog={deleteVendorQuoteDialog}
                toggleDialog={toggleDeleteVendorQuoteDialog}
                title="Quote delete confirmation"
                subText={"Are you sure you want to delete the quote?"}
                action={deleteVendorQuoteHandler}
            />
        );
    }, [
        deleteVendorQuoteDialog,
        toggleDeleteVendorQuoteDialog,
        deleteVendorQuoteHandler,
    ]);

    return (
        <>
            <DeleteVendorQuoteConfirmationDialog />
            <Stack
                horizontal
                horizontalAlign="space-between"
                style={
                    isReadOnly
                        ? { padding: "0px 16px", width: "75%", margin: "0" }
                        : {
                              margin: "8px 8px 8px 0",
                              padding: "2px 16px",
                          }
                }
            >
                <Stack.Item style={{ width: "35%" }} align="center">
                    <TextField
                        label="Vendor: "
                        borderless
                        readOnly
                        value={vendorDetails?.vendorName}
                        styles={{
                            root: { label: { whiteSpace: "nowrap" } },
                            wrapper: { display: "flex" },
                        }}
                    />
                </Stack.Item>
                <Stack.Item style={{ width: "30%" }} align="center">
                    {isDownloading || isDeleting ? (
                        <ProgressIndicator
                            label={isDeleting ? "Deleting" : "Downloading"}
                            description="Please wait"
                        />
                    ) : vendorDetails?.fileName &&
                      vendorDetails?.fileName.length > 0 ? (
                        <Stack horizontal tokens={{ childrenGap: 10 }}>
                            <IconButton
                                iconProps={{
                                    iconName: "Download",
                                    style: { color: "black" },
                                }}
                                onClick={downloadHandler}
                            />
                            {!isReadOnly && (
                                <IconButton
                                    iconProps={{
                                        iconName: "Delete",
                                        style: { color: "red" },
                                    }}
                                    onClick={toggleDeleteVendorQuoteDialog}
                                />
                            )}
                        </Stack>
                    ) : (
                        <>
                            {isReadOnly ? (
                                "No Quote Found"
                            ) : (
                                <HiddenLabel>
                                    <HiddenInput
                                        accept=".eml, .pdf, .jpeg, .jpg, .png"
                                        type="file"
                                        onChange={handleFile}
                                        readOnly
                                    />
                                    <ContainerDiv>
                                        <StyledDiv>
                                            <TextOverflow title={fileName}>
                                                {fileName}
                                            </TextOverflow>
                                            <StyledFontIcon
                                                aria-label="Upload"
                                                iconName="Upload"
                                            />
                                        </StyledDiv>
                                    </ContainerDiv>
                                    <StyledSpan>
                                        File types : eml, pdf, jpeg, jpg, png
                                    </StyledSpan>
                                </HiddenLabel>
                            )}
                        </>
                    )}
                </Stack.Item>
                <Stack.Item style={{ width: "30%" }} align="center">
                    {!isReadOnly ? (
                        <Checkbox
                            label="Selected for PO"
                            onChange={handleCheckbox}
                            checked={isShortListed}
                            disabled={
                                fileName.length === 0 ||
                                isReadOnly ||
                                isDisabled ||
                                isDeleting
                            }
                        />
                    ) : (
                        isShortListed && "Shortlisted"
                    )}
                </Stack.Item>
            </Stack>
            {isReadOnly && (
                <Separator
                    styles={{
                        root: { padding: 0, height: 2 },
                    }}
                />
            )}
        </>
    );
};

export default VendorParticipationLineItem;

import {
    DefaultButton,
    IconButton,
    IIconProps,
    Label,
    ProgressIndicator,
    Separator,
    Stack,
    TextField,
} from "@fluentui/react";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import {
    DeleteInvoice,
    DownloadInvoice,
} from "../../../services/invoiceService";
import { DownloadVendorQuote } from "../../../services/procurementService";
import InvoiceLineItem from "./InvoiceLineItem";
import {
    Invoice,
    PurchaseDetails,
    PurchaseItemsDetails,
} from "../../../types/PurchaseOrder";
import SytledDialog from "../../../components/common/StyledDialog";
import { useBoolean } from "@fluentui/react-hooks";
import { convertDateToddMMMYYYFormat } from "../../../Other/DateFormat";

interface Inputs {
    purchaseDetails: PurchaseDetails;
    data: PurchaseItemsDetails[];
    setSuccessMessage: Dispatch<SetStateAction<string | undefined>>;
    setErrorMessage: Dispatch<SetStateAction<string | undefined>>;
    setPurchaseDetails: Dispatch<SetStateAction<PurchaseDetails>>;
    setIsHandedOver: Dispatch<SetStateAction<boolean>>;
    setLoadOnClose: Dispatch<SetStateAction<boolean>>;
    setInvoiceUploadDetails: Dispatch<SetStateAction<Invoice>>;
    invoiceUploadDetails: Invoice;
}
const PurchaseOrderModalBody = (props: Inputs) => {
    const {
        purchaseDetails,
        data,
        setIsHandedOver,
        setSuccessMessage,
        setErrorMessage,
        setPurchaseDetails,
        setLoadOnClose,
        setInvoiceUploadDetails,
        invoiceUploadDetails,
    } = props;

    const downloadIcon: IIconProps = { iconName: "download" };
    const isPOcreated: boolean =
        purchaseDetails.purchaseOrderNumber === null || undefined
            ? false
            : true;
    const isReadOnly: boolean = purchaseDetails.isHandedOver;

    const [showDeleteDialog, { toggle: toggleDeleteDialog }] =
        useBoolean(false);

    const [isInvoiceUploaded, setIsInvoiceUploaded] = useState<boolean>(
        purchaseDetails.invoiceFileName === "" ? false : true
    );

    const inlineInputStyle = {
        root: {
            label: {
                whiteSpace: "nowrap",
                padding: "5px 0px 5px 0px",
                lineHeight: 22,
                fontSize: 16,
            },
            lineHeight: "22px",
        },
        fieldGroup: { marginLeft: 5, minWidth: "65%" },
        wrapper: { display: "flex" },
    };

    const [isQuoteDownloading, setIsQuoteDownloading] =
        useState<boolean>(false);
    const [isInvoiceDownloading, setIsInvoiceDownloading] =
        useState<boolean>(false);
    const [isInvoiceDeleting, setIsInvoiceDeleting] = useState<boolean>(false);

    const deleteInvoiceHandler = async () => {
        setIsInvoiceDeleting(true);
        toggleDeleteDialog();
        try {
            const response = await DeleteInvoice(purchaseDetails.invoiceId);
            setIsInvoiceDeleting(false);
            if (response) {
                setIsInvoiceUploaded(false);
                setLoadOnClose(true);
                setPurchaseDetails({
                    ...purchaseDetails,
                    invoiceId: "",
                    invoiceNumber: "",
                    invoiceFileName: "",
                });
                setSuccessMessage("Invoice file deleted");
            } else {
                setErrorMessage("Invoice file deletion failed");
            }
        } catch (err: any) {
            setIsInvoiceDeleting(false);
            setErrorMessage(err);
        }
    };

    const quoteDownloadHandler = async () => {
        setIsQuoteDownloading(true);
        try {
            const response = await DownloadVendorQuote(
                purchaseDetails.procurementVendorId,
                purchaseDetails.quoteFileName
            );
            setIsQuoteDownloading(false);
            if (response === true) {
                setSuccessMessage("Quote file downloaded successfully");
            } else {
                setErrorMessage("Quote file downloaded failed");
            }
        } catch (err: any) {
            setIsQuoteDownloading(false);
            setErrorMessage(err);
        }
    };

    const invoiceDownloadHandler = async () => {
        setIsInvoiceDownloading(true);
        try {
            const response = await DownloadInvoice(
                purchaseDetails.invoiceId,
                purchaseDetails.invoiceFileName
            );
            setIsInvoiceDownloading(false);
            if (response === true) {
                setSuccessMessage("Invoice file downloaded successfully");
            } else {
                setErrorMessage("Invoice file downloaded failed");
            }
        } catch (err: any) {
            setIsInvoiceDownloading(false);
            setErrorMessage(err);
        }
    };

    const CommentSection = () => {
        const commentStyle = {
            ...inlineInputStyle,
            root: {
                ...inlineInputStyle.root,
                width: 450,
                label: {
                    ...inlineInputStyle.root.label,
                    minWidth: 210,
                },
            },
        };

        return (
            <Stack
                horizontal
                style={{
                    width: "30%",
                }}
            >
                <Separator
                    vertical
                    styles={{
                        root: {
                            "&::after": {
                                width: 3,
                                margin: "-15px 0",
                            },
                        },
                    }}
                />
                <Stack>
                    <Stack
                        tokens={{
                            childrenGap: 10,
                            padding: "0px 15px",
                            maxWidth: 800,
                        }}
                    >
                        <Stack.Item style={{ padding: "2em" }}>
                            <Label>IT Admin Comments :</Label>
                            <TextField
                                styles={commentStyle}
                                multiline
                                value={purchaseDetails.notes}
                                readOnly={isReadOnly}
                                resizable={false}
                            />
                        </Stack.Item>
                        <Stack.Item style={{ padding: "2em" }}>
                            <Label>Quote Approver Comments :</Label>
                            <TextField
                                styles={commentStyle}
                                multiline
                                value={purchaseDetails.comments}
                                readOnly={isReadOnly}
                                resizable={false}
                            />
                        </Stack.Item>
                    </Stack>
                </Stack>
            </Stack>
        );
    };

    const DeleteInvoiceDialog = useCallback(() => {
        return (
            <SytledDialog
                showDialog={showDeleteDialog}
                toggleDialog={toggleDeleteDialog}
                title="Delete Invoice"
                subText="Are you sure you want to delete?"
                action={deleteInvoiceHandler}
            />
        );
    }, [showDeleteDialog, toggleDeleteDialog]);

    return (
        <>
            <DeleteInvoiceDialog />
            <Stack horizontal>
                <Stack tokens={{ childrenGap: 10 }} style={{ width: "30%" }}>
                    <TextField
                        label="Vendor Name:"
                        value={purchaseDetails?.vendorName}
                        readOnly
                        styles={inlineInputStyle}
                        borderless
                        name="vendor"
                    />
                    <TextField
                        label="Request Generated On:"
                        value={convertDateToddMMMYYYFormat(
                            purchaseDetails?.requestRaisedOn
                        )}
                        readOnly
                        styles={inlineInputStyle}
                        borderless
                        name="requestGeneratedOn"
                    />
                    <TextField
                        label="Request Approved On:"
                        value={convertDateToddMMMYYYFormat(
                            purchaseDetails?.approvedOn
                        )}
                        readOnly
                        styles={inlineInputStyle}
                        borderless
                        name="requestApprovedOn"
                    />
                    <TextField
                        label="Total Order Value:"
                        value={
                            isPOcreated
                                ? data[0]?.totalOrderValue?.toString()
                                : data
                                      .reduce((total, item) => {
                                          return isNaN(total + item.amount)
                                              ? 0
                                              : total + item.amount;
                                      }, 0)
                                      .toString()
                        }
                        readOnly
                        styles={inlineInputStyle}
                        borderless
                        name="total"
                    />
                    {isPOcreated && (
                        <TextField
                            label="Total PO Value:"
                            value={data
                                .reduce((total, item) => {
                                    return isNaN(
                                        total +
                                            item.quantityReceived *
                                                item.ratePerQuantity
                                    )
                                        ? 0
                                        : total +
                                              item.quantityReceived *
                                                  item.ratePerQuantity;
                                }, 0)
                                .toString()}
                            readOnly
                            styles={inlineInputStyle}
                            borderless
                            name="total"
                        />
                    )}
                </Stack>
                <Separator
                    vertical
                    styles={{
                        root: {
                            "&::after": {
                                width: 3,
                                margin: "-15px 0",
                            },
                        },
                    }}
                />
                <Stack
                    tokens={{ childrenGap: 10 }}
                    style={{
                        paddingLeft: "20px",
                        paddingRight: "20px",
                        width: !isPOcreated ? "20%" : "35%",
                    }}
                >
                    <Stack
                        horizontal
                        style={{
                            margin: "8px 8px 0px 0",
                            width: "80%",
                        }}
                        horizontalAlign="space-between"
                        wrap
                    >
                        <Stack.Item style={{ width: "30%" }} align="center">
                            {isQuoteDownloading ? (
                                <ProgressIndicator label={"Downloading"} />
                            ) : (
                                <DefaultButton
                                    text="Quote"
                                    iconProps={downloadIcon}
                                    disabled={isQuoteDownloading}
                                    onClick={() => quoteDownloadHandler()}
                                />
                            )}
                        </Stack.Item>
                        {isPOcreated && isInvoiceUploaded && (
                            <Stack.Item style={{ width: "30%" }} align="center">
                                {isInvoiceDownloading ? (
                                    <ProgressIndicator label={"Downloading"} />
                                ) : (
                                    <DefaultButton
                                        text="Invoice"
                                        iconProps={downloadIcon}
                                        disabled={isInvoiceDownloading}
                                        onClick={() =>
                                            invoiceDownloadHandler &&
                                            invoiceDownloadHandler()
                                        }
                                    />
                                )}
                            </Stack.Item>
                        )}

                        {isPOcreated && isInvoiceUploaded && !isReadOnly && (
                            <Stack.Item style={{ width: "20%" }}>
                                {isInvoiceDeleting ? (
                                    <ProgressIndicator label={"Deleting"} />
                                ) : (
                                    <IconButton
                                        iconProps={{
                                            iconName: "Delete",
                                            style: { color: "red" },
                                        }}
                                        onClick={toggleDeleteDialog}
                                    />
                                )}
                            </Stack.Item>
                        )}
                    </Stack>
                    {isPOcreated && (
                        <>
                            <InvoiceLineItem
                                isReadOnly={isReadOnly}
                                purchaseDetails={purchaseDetails}
                                isInvoiceUploaded={isInvoiceUploaded}
                                invoiceUploadDetails={invoiceUploadDetails}
                                setInvoiceUploadDetails={
                                    setInvoiceUploadDetails
                                }
                                setIsHandedOver={setIsHandedOver}
                            />
                        </>
                    )}
                </Stack>

                <CommentSection />
            </Stack>
        </>
    );
};

export default PurchaseOrderModalBody;

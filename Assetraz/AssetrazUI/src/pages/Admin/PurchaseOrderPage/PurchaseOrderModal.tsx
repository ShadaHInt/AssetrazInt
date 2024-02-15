//React
import {
    Stack,
    IStackTokens,
    Separator,
    DefaultButton,
    PrimaryButton,
} from "@fluentui/react";
import * as React from "react";
import {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useState,
} from "react";
import { useBoolean } from "@fluentui/react-hooks";
import StyledModal, {
    StyleModalFooter,
} from "../../../components/common/StyledModal";
import {
    CreatePurchaseOrder,
    PurchaseOrderDetails,
    UpdatePurchaseOrderDetails,
} from "../../../services/purchaseOrderServices";
import PurchaseOrderTable from "./PurchaseOrderTable";
import PurchaseOrderModalBody from "./PurchaseOrderModalBody";
import {
    Invoice,
    PurchaseDetails,
    PurchaseItemsDetails,
} from "../../../types/PurchaseOrder";
import SytledDialog from "../../../components/common/StyledDialog";
import { ProcurementItemDetails } from "../../../services/procurementService";
import { UploadInvoice } from "../../../services/invoiceService";
import { isValidFile } from "../../../components/common/FileInput";

const decimalRegex = /^(?:\d*\.\d+|\.\d+)$/;

interface ModalInputs {
    onDismiss(): any;
    isOpen: boolean;
    purchaseDetails: PurchaseDetails;
    setPurchaseDetails: Dispatch<SetStateAction<PurchaseDetails>>;
    setLoadOnClose: Dispatch<SetStateAction<boolean>>;
    closeRefresh: (message: string) => void;
}

const PurchaseOrderModal = (props: ModalInputs) => {
    const {
        onDismiss,
        isOpen,
        purchaseDetails,
        closeRefresh,
        setPurchaseDetails,
        setLoadOnClose,
    } = props;
    const stackToken: IStackTokens = {
        childrenGap: 3,
        padding: 7,
    };

    const [data, setData] = React.useState<PurchaseItemsDetails[]>([]);
    const [prevData, setPrevData] = React.useState<PurchaseItemsDetails[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | undefined>();
    const [successMessage, setSuccessMessage] = useState<string | undefined>();
    const [isBtnDisabled, setIsBtnDisabled] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [showConfirmationDialog, { toggle: toggleConfirmationDialog }] =
        useBoolean(false);
    const [assetHandoverDialog, { toggle: toggleAssetHandoverDialog }] =
        useBoolean(false);
    const [invoiceUploadDetails, setInvoiceUploadDetails] = useState<any>();
    const [isLoading, setIsloading] = useState<boolean>(false);
    const [isHandedOver, setIsHandedOver] = useState<boolean>(false);
    const [isPartial, setIsPartial] = useState<boolean>(false);
    const buttonStyles = { root: { margin: 8 } };
    const modalTitle = `Procurement Request : ${purchaseDetails.requestNumber}`;
    const modalSecondaryHeading = `PO Number : ${purchaseDetails.purchaseOrderNumber}`;
    const isPoCreated: boolean =
        purchaseDetails.purchaseOrderNumber === null ? false : true;
    useEffect(() => {
        if (isOpen) {
            getPurchaseDetails();
        }
    }, [isOpen]);

    const getPurchaseDetails = async () => {
        setIsloading(true);
        try {
            let result;
            if (!isPoCreated) {
                result = await ProcurementItemDetails(
                    purchaseDetails?.procurementRequestId,
                    purchaseDetails?.vendorId
                );
            } else {
                result = await PurchaseOrderDetails(
                    purchaseDetails?.purchaseOrderRequestId,
                    encodeURIComponent(purchaseDetails?.purchaseOrderNumber)
                );
            }

            setIsloading(false);
            if (result) {
                setData(
                    result.map((item: PurchaseItemsDetails) => ({
                        ...item,
                        amount: item.quantity * item.ratePerQuantity,
                        procurementRequestId:
                            purchaseDetails.procurementRequestId,
                        purchaseOrderDetailsId:
                            item.procurementDetailsId ??
                            item.purchaseOrderDetailsId,
                    }))
                );
                setPrevData(result);
            }
        } catch (err: any) {
            setErrorMessage(err);
            setIsloading(false);
        }
    };
    const createPo = useCallback(async () => {
        setIsError(true);
        let isValid: boolean = true;
        let prevDetails: PurchaseItemsDetails | undefined;
        data.forEach((d: PurchaseItemsDetails) => {
            if (!d.quantity || !d.ratePerQuantity || !d.specifications) {
                setErrorMessage("Please input valid details");
                isValid = false;
            }
            if (!/^[0-9]*(\.[0-9]{1,2})?$/.test(d.ratePerQuantity.toString())) {
                setErrorMessage("Invalid Rate per Quantity");
                isValid = false;
            }
            if (!/^[0-9]+$/.test(String(d.quantity))) {
                setErrorMessage("Quantity should not contain decimal values");
                isValid = false;
            }
            if (
                Number(d.quantity) === 0 ||
                Number(d.ratePerQuantity) === 0 ||
                /\s/.test(d.quantity.toString()) ||
                /\s/.test(d.ratePerQuantity.toString())
            ) {
                setErrorMessage("Please input valid details");
                isValid = false;
            }
            prevDetails = prevData.find(
                (obj) =>
                    obj.purchaseOrderDetailsId ??
                    obj.procurementDetailsId === d.purchaseOrderDetailsId ??
                    d.procurementDetailsId
            );
            if (
                prevDetails &&
                (Number(d.ratePerQuantity) > prevDetails.ratePerQuantity ||
                    Number(d.quantity) > prevDetails.quantity)
            ) {
                setErrorMessage(
                    "Quantity or Rate/Quantity cannot be greater than approved value"
                );
                isValid = false;
            }
        });
        if (!isValid) {
            return false;
        }

        try {
            setIsBtnDisabled(true);
            setIsloading(true);
            const response = await CreatePurchaseOrder(data);
            setIsBtnDisabled(false);
            if (response) {
                closeRefresh("Purchase order created successfully");
            }
        } catch (err: any) {
            setErrorMessage(err);
            setIsBtnDisabled(false);
        }
        setIsloading(false);
    }, [data, prevData, closeRefresh]);

    const panelDismiss = () => {
        onDismiss();
        setErrorMessage("");
    };

    const updatePODetails = useCallback(
        async (partial?: boolean, noAssetHandOver?: boolean) => {
            setIsloading(true);
            try {
                if (
                    !purchaseDetails.invoiceNumber ||
                    purchaseDetails.invoiceNumber === ""
                ) {
                    if (
                        invoiceUploadDetails.invoiceFile &&
                        !isValidFile(invoiceUploadDetails.invoiceFile.name)
                    ) {
                        setErrorMessage("Unsupported file type");
                        setIsloading(false);
                        return;
                    }

                    const result = await UploadInvoice(invoiceUploadDetails);
                    if (result) {
                        await UpdatePurchaseOrderDetails(
                            data,
                            partial ? partial : isPartial,
                            noAssetHandOver ? !noAssetHandOver : isHandedOver
                        );
                        closeRefresh("Purchase order updated successfully");
                    }
                } else {
                    const response = await UpdatePurchaseOrderDetails(
                        data,
                        partial ? partial : isPartial,
                        noAssetHandOver ? !noAssetHandOver : isHandedOver
                    );
                    if (response)
                        closeRefresh("Purchase order updated successfully");
                    else panelDismiss();
                }
            } catch (err: any) {
                setErrorMessage(err);
            }
            setIsloading(false);
        },
        [
            panelDismiss,
            closeRefresh,
            data,
            invoiceUploadDetails,
            isHandedOver,
            isPartial,
            purchaseDetails.invoiceNumber,
        ]
    );

    const savePO = useCallback(() => {
        setIsError(true);
        let isValid: boolean = true;
        let prevDetails: PurchaseItemsDetails | undefined;
        data.forEach((d: PurchaseItemsDetails) => {
            if (!d.quantityReceived || Number(d.quantityReceived) === 0) {
                setErrorMessage("Please input valid details");
                isValid = false;
            }
            if (decimalRegex.test(String(d.quantityReceived))) {
                setErrorMessage(
                    "Quantity received should not contain decimal values"
                );
                isValid = false;
                return;
            }
            if (!/^[0-9]+$/.test(String(d.quantityReceived))) {
                setErrorMessage("Quantity received should be an integer");
                isValid = false;
            }
            prevDetails = prevData.find(
                (obj) => obj.categoryId === d.categoryId
            );
            if (
                prevDetails &&
                Number(d.quantityReceived) > prevDetails.quantity
            ) {
                setErrorMessage(
                    "Quantity received cannot be greater than quantity"
                );
                isValid = false;
            }
        });
        if (!isValid) {
            return false;
        }
        data.forEach((pres) => {
            prevData.some((prev) => {
                if (
                    pres.categoryId === prev.categoryId &&
                    Number(pres.quantityReceived) < prev.quantity
                ) {
                    isValid = false;
                    return true;
                }
                return false;
            });
            if (!isValid) {
                return;
            }
        });

        if (isValid) {
            if (isHandedOver) toggleAssetHandoverDialog();
            else updatePODetails();
        } else {
            toggleConfirmationDialog();
        }
    }, [
        data,
        isHandedOver,
        prevData,
        toggleAssetHandoverDialog,
        toggleConfirmationDialog,
        updatePODetails,
    ]);

    const PartialPO = useCallback(async () => {
        setIsPartial(true);
        if (isHandedOver) {
            toggleConfirmationDialog();
            toggleAssetHandoverDialog();
        } else {
            updatePODetails(true);
            toggleConfirmationDialog();
        }
    }, [
        isHandedOver,
        toggleAssetHandoverDialog,
        toggleConfirmationDialog,
        updatePODetails,
    ]);

    const AssetHandOver = useCallback(() => {
        updatePODetails();
        toggleAssetHandoverDialog();
    }, [toggleAssetHandoverDialog, updatePODetails]);

    const noPartialPO = useCallback(() => {
        if (isHandedOver) {
            toggleAssetHandoverDialog();
        } else {
            updatePODetails();
        }
        toggleConfirmationDialog();
    }, [
        isHandedOver,
        toggleAssetHandoverDialog,
        toggleConfirmationDialog,
        updatePODetails,
    ]);

    const noAssetHandOver = useCallback(() => {
        setInvoiceUploadDetails((prevState: Invoice) => ({
            ...prevState,
            isHandedOver: false,
        }));
        setIsHandedOver(false);
        updatePODetails(undefined, true);
        toggleAssetHandoverDialog();
    }, [toggleAssetHandoverDialog, updatePODetails]);

    const AssetHandoverConfirmationDialog = useCallback(() => {
        return (
            <SytledDialog
                showDialog={assetHandoverDialog}
                toggleDialog={toggleAssetHandoverDialog}
                title="Asset Handover Confirmation"
                subText={
                    isPartial
                        ? "Do you want to hand over assets to IT team with partial delivery from vendor?"
                        : "Handing over assets to IT will not allow you to make further changes to this PO. Do you want to proceed?"
                }
                action={AssetHandOver}
                noAction={noAssetHandOver}
            />
        );
    }, [
        assetHandoverDialog,
        toggleAssetHandoverDialog,
        isPartial,
        AssetHandOver,
        noAssetHandOver,
    ]);

    const PartialPOConfirmationDialog = useCallback(() => {
        return (
            <SytledDialog
                showDialog={showConfirmationDialog}
                toggleDialog={toggleConfirmationDialog}
                noAction={noPartialPO}
                title="Partial PO Confirmation"
                subText="There is a mismatch in items received and requested. Do you expect another invoice / delivery for the remaining items"
                action={PartialPO}
            />
        );
    }, [
        showConfirmationDialog,
        toggleConfirmationDialog,
        noPartialPO,
        PartialPO,
    ]);

    const Footer = () => (
        <Stack horizontal horizontalAlign="end">
            <DefaultButton styles={buttonStyles} onClick={panelDismiss}>
                Cancel
            </DefaultButton>
            {(!isPoCreated || !purchaseDetails.isHandedOver) && (
                <PrimaryButton
                    styles={buttonStyles}
                    onClick={() => (!isPoCreated ? createPo() : savePO())}
                    disabled={
                        !isPoCreated
                            ? isBtnDisabled
                            : purchaseDetails.invoiceFileName !== ""
                            ? isBtnDisabled
                            : !(
                                  invoiceUploadDetails &&
                                  invoiceUploadDetails.invoiceDate &&
                                  invoiceUploadDetails.invoiceNumber &&
                                  invoiceUploadDetails.invoiceNumber.trim()
                                      .length > 0 &&
                                  invoiceUploadDetails.invoiceFile
                              )
                    }
                >
                    {!isPoCreated ? "Create PO" : "Save"}
                </PrimaryButton>
            )}
        </Stack>
    );

    return (
        <StyledModal
            isOpen={isOpen}
            onDismiss={() => panelDismiss()}
            title={modalTitle}
            secondaryTitle={isPoCreated ? modalSecondaryHeading : ""}
            setErrorMessageBar={() => setErrorMessage(undefined)}
            setSuccessMessageBar={setSuccessMessage}
            errorMessageBar={errorMessage}
            successMessageBar={successMessage}
            isLoading={isLoading}
        >
            <Stack tokens={stackToken} style={{ minHeight: "650px" }}>
                <PartialPOConfirmationDialog />
                <AssetHandoverConfirmationDialog />
                <PurchaseOrderModalBody
                    purchaseDetails={purchaseDetails}
                    data={data}
                    setSuccessMessage={setSuccessMessage}
                    setErrorMessage={setErrorMessage}
                    setLoadOnClose={setLoadOnClose}
                    setInvoiceUploadDetails={setInvoiceUploadDetails}
                    invoiceUploadDetails={invoiceUploadDetails}
                    setPurchaseDetails={setPurchaseDetails}
                    setIsHandedOver={setIsHandedOver}
                />
                <Separator />
                <Stack>
                    <PurchaseOrderTable
                        data={data}
                        isPoCreated={isPoCreated}
                        isReadOnly={purchaseDetails.isHandedOver}
                        setPO={setData}
                        prevData={prevData}
                        isError={isError}
                    />
                </Stack>
            </Stack>
            <StyleModalFooter>
                <Footer />
            </StyleModalFooter>
        </StyledModal>
    );
};

export default PurchaseOrderModal;

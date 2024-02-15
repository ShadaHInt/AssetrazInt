import { useCallback, useEffect, useState } from "react";

import { useBoolean } from "@fluentui/react-hooks";

import { Category } from "../../../types/Category";
import { Manufacturer } from "../../../types/Manufacturer";
import { NetworkCompany } from "../../../types/NetworkCompany";
import {
    IProcurements,
    IQuoteVendors,
    ProcurementProps,
} from "../../../types/Procurement";
import { Vendor } from "../../../types/Vendor";

import { ProcurementStatus } from "../../../constants/ProcurementStatus";

import { GetAllNetworkCompanies } from "../../../services/networkCompanyService";
import { GetAllVendors } from "../../../services/vendorService";
import { GetAllCategories } from "../../../services/categoryService";
import { GetAllManfacturer } from "../../../services/manufacturerService";
import {
    CreateProcurementRequest,
    ProcurementDetails,
    UpdateProcurementRequest,
    UpdateRequestStatus,
    UploadVendorQuotes,
} from "../../../services/procurementService";

import SytledDialog from "../../../components/common/StyledDialog";
import StyledModal, {
    StyleModalFooter,
} from "../../../components/common/StyledModal";

import { RandomId } from "./Utils";

import ModalHeader from "./ProcurementModalHeader";
import ModalBody from "./ProcurementModalBody";
import { IDropdownOption, Separator } from "@fluentui/react";
import { ApprovaFooter, ProcuremenModalFooter } from "./ProcuremenModalFooter";
import { IsNumericGreZero } from "../../../Other/InputValidation";
import { isValidFile } from "../../../components/common/FileInput";
import { PurchaseRequestDetail } from "../../../services/purchaseOrderServices";
import {
    IProcurementRequestContextValues,
    useProcurementRequestContext,
} from "../../../Contexts/ProcurementRequestContext";

interface IProcurementModalInterface {
    isModalVisible: boolean;
    setIsModalVisible: () => void;
    closeRefresh: (string: string) => void;
    selectedProcurement: IProcurements | undefined;
    isApprovalModel?: boolean;
    onModalClose?: () => void;
}

const ProcurementModal = (props: IProcurementModalInterface) => {
    const EmptyRequest = {
        id: RandomId(),
        vendorList: [],
        categoryId: "",
        manfacturerId: "",
        modelNumber: "",
        specifications: "",
        quantity: "",
        networkCompanyId: "",
        ratePerQuantity: "0",
    };

    const {
        isModalVisible,
        setIsModalVisible,
        closeRefresh,
        selectedProcurement,
        isApprovalModel = false,
    } = props;

    const { setHasUserRequest } =
        useProcurementRequestContext() as IProcurementRequestContextValues;

    const [networkCompanies, setNetworkCompanies] = useState<
        IDropdownOption<NetworkCompany>[] | null
    >([]);
    const [vendors, setVendors] = useState<IDropdownOption<Vendor>[] | null>(
        []
    );
    const [needsRefresh, { toggle: setNeedsRefresh }] = useBoolean(false);
    const [categories, setCategories] = useState<
        IDropdownOption<Category>[] | null
    >([]);
    const [manfacturer, setManfacturer] = useState<
        IDropdownOption<Manufacturer>[] | null
    >([]);
    const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
    const [procurementNote, setProcurementNote] = useState<string>();
    const [selectedNetworkCompany, setSelectedNetworkCompany] =
        useState<string>();
    const [failure, setFailure] = useState<string>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [request, setRequest] = useState<ProcurementProps[]>([EmptyRequest]);
    const [vendorQuoteUploadDetails, setVendorQuoteUploadDetails] = useState<
        IQuoteVendors[]
    >([]);
    const [successMessageModal, setSuccessMessageModal] = useState<
        string | undefined
    >();
    const [totalAssetAmount, setTotalAssetAmount] = useState<number>(0);

    const [showLineErrorMessage, setShowLineErrorMessage] =
        useState<boolean>(false);
    const [showDeleteDialog, { toggle: toggleDeleteDialog }] =
        useBoolean(false);
    const [showRequestDialog, { toggle: toggleRequestDialog }] =
        useBoolean(false);
    const [modalErrorOccured, setModalErrorOccured] = useState<boolean>(false);

    const selectedProcurementStatus = selectedProcurement?.status;
    const isReadOnly =
        selectedProcurementStatus === ProcurementStatus.Withdrawn ||
        selectedProcurementStatus === ProcurementStatus.Rejected ||
        selectedProcurementStatus === ProcurementStatus.Approved ||
        selectedProcurementStatus === ProcurementStatus["Pending Approval"] ||
        isApprovalModel;
    const procurementRequestId = selectedProcurement?.procurementRequestId
        ? selectedProcurement?.procurementRequestId
        : undefined;
    let modalTitle = "";
    if (selectedProcurementStatus === ProcurementStatus.Submitted) {
        modalTitle = "Edit Procurement Request : ";
    } else if (selectedProcurementStatus === ProcurementStatus.Generated) {
        modalTitle = "Update Quote Details : ";
    } else if (
        selectedProcurementStatus === ProcurementStatus["Pending Approval"] &&
        isApprovalModel
    ) {
        modalTitle = "Approve/Reject Procurement  request : ";
    } else {
        modalTitle = "View Procurement Request : ";
    }
    if (procurementRequestId) {
        modalTitle = modalTitle + selectedProcurement?.requestNumber;
    } else {
        modalTitle = "New Procurement Request";
    }

    const shortlistedVendor = vendors?.filter((v) =>
        vendorQuoteUploadDetails
            ?.filter((vq) => vq.isShortListed === true)
            .map((vq) => vq.vendorId)
            .includes(v.key as string)
    );

    const getDatas = useCallback(async () => {
        setIsLoading(true);
        if (
            selectedProcurementStatus === undefined ||
            selectedProcurementStatus === ProcurementStatus.Submitted
        ) {
            await GetAllNetworkCompanies()
                .then((res) => setNetworkCompanies(res))
                .catch((err) => setNetworkCompanies(null));
            await GetAllCategories()
                .then((res) => setCategories(res))
                .catch((err) => setCategories(null));
            await GetAllManfacturer()
                .then((res) => setManfacturer(res))
                .catch((err) => setManfacturer(null));
            await GetAllVendors()
                .then((res) => setVendors(res))
                .catch((err) => setVendors(null));
            await PurchaseRequestDetail(
                selectedProcurement?.requestNumber
            ).then((res) => {
                if (res) {
                    setHasUserRequest && setHasUserRequest(true);
                } else {
                    setHasUserRequest && setHasUserRequest(false);
                }
            });
        }
        if (selectedProcurementStatus === ProcurementStatus.Generated) {
            await GetAllVendors()
                .then((res) => setVendors(res))
                .catch((err) => setVendors(null));
            await GetAllManfacturer()
                .then((res) => setManfacturer(res))
                .catch((err) => setManfacturer(null));
        }

        if (procurementRequestId !== undefined) {
            await ProcurementDetails(procurementRequestId)
                .then((res: ProcurementProps[]) => {
                    setSelectedVendors(res[0].vendorList);
                    setSelectedNetworkCompany(res[0].networkCompanyId);
                    setProcurementNote(res[0].notes);
                    setRequest(
                        res.map((obj) => ({
                            ...obj,
                            id: RandomId(),
                        }))
                    );
                })
                .catch((err) => {
                    setModalErrorOccured(true);
                });

            await PurchaseRequestDetail(
                selectedProcurement?.requestNumber
            ).then((res) => {
                if (res) {
                    setHasUserRequest && setHasUserRequest(true);
                } else {
                    setHasUserRequest && setHasUserRequest(false);
                }
            });
        }
        setIsLoading(false);
    }, [
        procurementRequestId,
        selectedProcurement?.requestNumber,
        selectedProcurementStatus,
        setHasUserRequest,
    ]);

    useEffect(() => {
        getDatas();
    }, [getDatas]);

    useEffect(() => {
        let total = 0;
        request.forEach(
            (element: any) =>
                (total += element.quantity * element.ratePerQuantity)
        );
        setTotalAssetAmount(total);
    }, [request]);

    useEffect(() => {
        setVendorQuoteUploadDetails(
            selectedProcurement?.vendors as IQuoteVendors[]
        );
    }, [selectedProcurement]);

    const validateInput = useCallback(() => {
        setShowLineErrorMessage(true);

        let isFormValid = true;
        let isRatePerQuantityValid = true;
        let isQuantityValid = true;

        request.forEach((r: any) => {
            if (
                !r.categoryId ||
                !r.manfacturerId ||
                !r.modelNumber ||
                !IsNumericGreZero(r.quantity) ||
                !r.specifications ||
                selectedVendors.length === 0
            )
                isFormValid = false;
            if (!/^[0-9]+$/.test(String(r.quantity))) {
                isQuantityValid = false;
            }

            if (selectedProcurementStatus === ProcurementStatus.Generated) {
                if (
                    isNaN(parseFloat(r.ratePerQuantity)) ||
                    parseFloat(r.ratePerQuantity) <= 0 ||
                    !r.vendorId
                )
                    isFormValid = false;
                if (!/^[0-9]*(\.[0-9]{1,2})?$/.test(r.ratePerQuantity))
                    isRatePerQuantityValid = false;
                if (
                    !shortlistedVendor?.map((sv) => sv.key).includes(r.vendorId)
                ) {
                    isFormValid = false;
                }
            }
        });

        if (!selectedVendors || !selectedNetworkCompany || !isFormValid) {
            setFailure("Please input details");
            return false;
        }
        if (!isQuantityValid) {
            setFailure("Decimal values should not be accepted for quantity");
            return false;
        }
        if (!isRatePerQuantityValid) {
            setFailure(
                "Values with more than 2 decimal places should not be accepted for rate per quantity field."
            );
            return false;
        }
        setShowLineErrorMessage(false);
        return true;
    }, [
        selectedVendors,
        request,
        selectedNetworkCompany,
        selectedProcurementStatus,
        shortlistedVendor,
    ]);

    const submitData = useCallback(
        async (requestForQuote: boolean = false, cc: boolean = false) => {
            if (!validateInput()) return;

            setIsLoading((prevState) => true);
            request.forEach((element: any) => {
                element.vendorList = selectedVendors;
                element.networkCompanyId = selectedNetworkCompany;
                element.procurementRequestId = procurementRequestId;
                element.notes = procurementNote;
            });
            if (procurementRequestId !== undefined) {
                if (vendorQuoteUploadDetails.length > 0) {
                    let invalidFile = false;
                    vendorQuoteUploadDetails.forEach((quote) => {
                        if (
                            quote.quoteFile &&
                            !isValidFile(quote.quoteFile.name)
                        ) {
                            invalidFile = true;
                        }
                    });
                    if (invalidFile) {
                        setFailure("Unsupported file type");
                        setIsLoading(false);
                        return;
                    }

                    const response = await UploadVendorQuotes(
                        vendorQuoteUploadDetails
                    );
                    if (response === false) {
                        setFailure("Upload failed");
                    }
                }
                await UpdateProcurementRequest(request, requestForQuote, cc)
                    .then((res) => {
                        if (res === true) {
                            closeRefresh("Successfully updated");
                        } else {
                            setFailure("Failed to update details");
                        }
                    })
                    .catch((err) => setFailure(err));
            } else {
                await CreateProcurementRequest(request, requestForQuote, cc)
                    .then((res) => {
                        if (res === true) {
                            closeRefresh("Successfully saved");
                        } else {
                            setFailure("Failed to create request");
                        }
                    })
                    .catch((err) => setFailure(err));
            }
            setIsLoading((prevState) => false);
            props.onModalClose && props.onModalClose();
        },
        [
            procurementNote,
            request,
            selectedVendors,
            selectedNetworkCompany,
            procurementRequestId,
            vendorQuoteUploadDetails,
            closeRefresh,
            validateInput,
            props,
        ]
    );

    const DeleteRequest = useCallback(async () => {
        if (procurementRequestId) {
            setIsLoading((prevState) => true);
            await UpdateRequestStatus(procurementRequestId, true)
                .then((res) => {
                    if (res === true) {
                        closeRefresh("Successfully deleted");
                    } else {
                        setFailure("Something went wrong");
                    }
                })
                .catch((err) => setFailure("Something went wrong"));
            toggleDeleteDialog();
            setIsLoading((prevState) => false);
            props.onModalClose && props.onModalClose();
        }
    }, [procurementRequestId, toggleDeleteDialog, props, closeRefresh]);

    const addRequest = () => {
        setRequest((prevState: any) => [...prevState, EmptyRequest]);
    };

    const DeleteDialog = useCallback(() => {
        return (
            <SytledDialog
                showDialog={showDeleteDialog}
                toggleDialog={toggleDeleteDialog}
                title="Delete Request"
                subText="Are you sure you want to delete?"
                action={DeleteRequest}
            />
        );
    }, [showDeleteDialog, toggleDeleteDialog, DeleteRequest]);

    const RequestDialog = useCallback(() => {
        const title =
            selectedProcurementStatus === ProcurementStatus.Generated ||
            selectedProcurementStatus === ProcurementStatus.Submitted ||
            !selectedProcurementStatus
                ? "Request for quote"
                : "Request for approval";

        return (
            <SytledDialog
                showDialog={showRequestDialog}
                toggleDialog={toggleRequestDialog}
                title={title}
                subText="Should copy of the email be sent to the ops admins?"
                action={() => submitData(true, true)}
                noAction={() => submitData(true, false)}
            />
        );
    }, [
        selectedProcurementStatus,
        showRequestDialog,
        toggleRequestDialog,
        submitData,
    ]);

    return (
        <StyledModal
            title={modalTitle}
            isOpen={isModalVisible}
            onDismiss={() => {
                if (needsRefresh) {
                    closeRefresh("");
                    setVendorQuoteUploadDetails([]);
                } else {
                    setIsModalVisible();
                    setVendorQuoteUploadDetails([]);
                }
                props.onModalClose && props.onModalClose();
            }}
            isLoading={isLoading}
            errorMessageBar={failure}
            setErrorMessageBar={() => {
                setFailure(undefined);
                setShowLineErrorMessage(false);
            }}
            setSuccessMessageBar={setSuccessMessageModal}
            successMessageBar={successMessageModal}
            errorOccured={modalErrorOccured}
        >
            <DeleteDialog />
            <RequestDialog />
            <ModalHeader
                isReadOnly={isReadOnly}
                vendors={vendors}
                networkCompanies={networkCompanies}
                selectedNetworkCompany={selectedNetworkCompany}
                selectedVendors={selectedVendors}
                selectedProcurement={selectedProcurement}
                totalAssetAmount={totalAssetAmount}
                showLineErrorMessage={showLineErrorMessage}
                vendorQuoteUploadDetails={vendorQuoteUploadDetails}
                addRequest={addRequest}
                setFailure={setFailure}
                setNeedsRefresh={setNeedsRefresh}
                setSelectedVendors={setSelectedVendors}
                setSuccessMessageModal={setSuccessMessageModal}
                setSelectedNetworkCompany={setSelectedNetworkCompany}
                setVendorQuoteUploadDetails={setVendorQuoteUploadDetails}
                procurementNote={procurementNote}
                setProcurementNote={setProcurementNote}
            />
            <Separator />
            {categories && manfacturer && shortlistedVendor && (
                <ModalBody
                    isReadOnly={isReadOnly}
                    status={selectedProcurementStatus}
                    vendors={shortlistedVendor}
                    categories={categories}
                    manfacturer={manfacturer}
                    request={request}
                    showLineErrorMessage={showLineErrorMessage}
                    setRequest={setRequest}
                />
            )}
            <StyleModalFooter>
                {isApprovalModel ? (
                    <ApprovaFooter
                        selectedProcurementStatus={selectedProcurementStatus}
                        procurementRequestId={procurementRequestId}
                        comments={selectedProcurement?.comments}
                        setIsModalVisible={setIsModalVisible}
                        closeRefresh={closeRefresh}
                        setIsLoading={setIsLoading}
                        setFailure={setFailure}
                    />
                ) : (
                    <ProcuremenModalFooter
                        selectedProcurementStatus={selectedProcurementStatus}
                        procurementRequestId={procurementRequestId}
                        isReadOnly={isReadOnly}
                        setIsLoading={setIsLoading}
                        needsRefresh={needsRefresh}
                        closeRefresh={closeRefresh}
                        setFailure={setFailure}
                        setIsModalVisible={setIsModalVisible}
                        submitData={submitData}
                        toggleDeleteDialog={toggleDeleteDialog}
                        toggleRequestDialog={() => {
                            if (validateInput()) toggleRequestDialog();
                        }}
                        onModalClose={props.onModalClose}
                    />
                )}
            </StyleModalFooter>
        </StyledModal>
    );
};

export default ProcurementModal;

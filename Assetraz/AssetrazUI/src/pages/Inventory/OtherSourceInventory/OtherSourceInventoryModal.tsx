import { useCallback, useEffect, useState } from "react";

import { ICategory } from "../../../types/Category";
import { Manufacturer } from "../../../types/Manufacturer";
import { NetworkCompany } from "../../../types/NetworkCompany";
import {
    IOtherSourceInventory,
    OtherSourceInventoryProps,
} from "../../../types/OtherSourceInventory";

import {
    createOtherSourceInventoryRequest,
    getOtherSourcesInventoryById,
    UpdateOtherSourceInventoryRequest,
    uploadSupportDocument,
} from "../../../services/assetService";

import { GetAllNetworkCompanies } from "../../../services/networkCompanyService";
import { GetAllSources } from "../../../services/sourceService";
import {
    GetAllCategories,
    GetCategories,
} from "../../../services/categoryService";
import { GetAllManfacturer } from "../../../services/manufacturerService";

import StyledModal, {
    StyleModalFooter,
} from "../../../components/common/StyledModal";

import OtherSourceInventoryModalBody from "./OtherSourceInventoryModalBody";
import ModalHeader from "./OtherSourceInventoryModalHeader";
import {
    DefaultButton,
    IDropdownOption,
    PrimaryButton,
    Separator,
    Stack,
} from "@fluentui/react";
import { Source } from "../../../types/Source";
import DashboardStyle from "../../Home/DashboardStyles";
import { RandomId } from "../../Admin/ProcurementPage/Utils";
import { useBoolean } from "@fluentui/react-hooks";
import {
    IsNumericGreZero,
    IsStringValid,
    IsValidDate,
} from "../../../Other/InputValidation";
import { assetTagRegex } from "../InvoiceRegister/AddAssetsModal";

interface IOtherSourceInventoryInterface {
    isModalVisible: boolean;
    isReadOnly: boolean;
    selectedOtherSource: IOtherSourceInventory | undefined;
    setIsModalVisible: () => void;
    closeRefresh: (string: string) => void;
}

const specialCharacterRegex = /^[^a-zA-Z0-9]/;

const OtherInventoryModal = (props: IOtherSourceInventoryInterface) => {
    const EmptyRequest = {
        id: RandomId(),
        sourceId: "",
        categoryId: "",
        manufacturerId: "",
        receivedDate: new Date(),
        fileName: "",
        supportingDocumentFile: null,
        notes: "",
        modelNumber: "",
        warrantyDate: undefined,
        serialNumber: "",
        issuable: false,
        assetTagNumber: null,
        assetValue: "",
        specifications: "",
        networkCompanyId: "",
    };

    const {
        isModalVisible,
        isReadOnly,
        selectedOtherSource,
        setIsModalVisible,
        closeRefresh,
    } = props;

    const [networkCompanies, setNetworkCompanies] =
        useState<IDropdownOption<NetworkCompany> | null>();
    const [sources, setSources] = useState<IDropdownOption<Source>[] | null>();
    const [categories, setCategories] = useState<any[] | []>([]);
    const [manufacturer, setManufacturer] = useState<
        IDropdownOption<Manufacturer>[] | null
    >([]);
    const [selectedNetworkCompany, setSelectedNetworkCompany] =
        useState<string>();
    const [selectedSource, setSelectedSource] = useState<string>();
    const [failure, setFailure] = useState<string>();
    const [receivedDate, setReceivedDate] = useState<any>();
    const [documentFileName, setDocumentFileName] = useState<any>();
    const [documentNumber, setDocumentNumber] = useState<string>();
    const [documentFilePath, setDocumentFilePath] = useState<any>();
    const [documentFile, setDocumentFile] = useState<Blob | undefined | null>();
    const [notes, setNotes] = useState<any>();
    const [isFileChange, { toggle: toggleFileChange }] = useBoolean(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showLineErrorMessage, setShowLineErrorMessage] =
        useState<boolean>(false);
    const [request, setRequest] = useState<OtherSourceInventoryProps[]>([
        EmptyRequest,
    ]);
    const [modalErrorOccured, setModalErrorOccured] = useState<boolean>(false);
    const [allCategories, setAllCategories] = useState<any[] | []>([]);
    const [isExistingAsset, { toggle: toggleIsExistingAsset }] =
        useBoolean(false);

    const otherSourceId = selectedOtherSource?.inventoryOtherSourceId
        ? selectedOtherSource.inventoryOtherSourceId
        : undefined;

    const duplicateAssetErrorMessage =
        "Duplicate asset tag number has been added! Please change it.";

    let modalTitle = "Other Source Inventory: ";

    if (otherSourceId) {
        modalTitle = modalTitle + selectedOtherSource?.documentID;
    } else {
        modalTitle = "Other Source Inventory";
    }

    const getDatas = useCallback(async () => {
        setIsLoading(true);
        await GetAllNetworkCompanies()
            .then((res) => setNetworkCompanies(res))
            .catch((err) => setNetworkCompanies(null));
        await GetAllCategories()
            .then((res) => setCategories(res))
            .catch((err) => setCategories([]));
        await GetAllManfacturer()
            .then((res) => setManufacturer(res))
            .catch((err) => setManufacturer(null));
        await GetAllSources()
            .then((res) => setSources(res))
            .catch((err) => setSources(null));
        await GetCategories()
            .then((res) => setAllCategories(res))
            .catch((err) => setAllCategories([]));

        if (otherSourceId !== undefined) {
            await getOtherSourcesInventoryById(otherSourceId)
                .then((res: OtherSourceInventoryProps[]) => {
                    if (res.some((i) => i.assetStatus)) {
                        setSelectedNetworkCompany(res[0].networkCompanyName);
                        setSelectedSource(res[0].sourceName);
                    } else {
                        setSelectedNetworkCompany(res[0].networkCompanyId);
                        setSelectedSource(res[0].sourceId);
                    }
                    setReceivedDate(res[0].receivedDate);
                    setNotes(res[0].notes);
                    setDocumentFileName(res[0].fileName);
                    setDocumentNumber(res[0].documentNumber);
                    setDocumentFilePath(res[0].supportingDocumentFilePath);
                    if (res.some((i) => i.cutOverStock)) {
                        toggleIsExistingAsset();
                    }
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
        }
        setIsLoading(false);
    }, [isReadOnly, otherSourceId]);

    useEffect(() => {
        getDatas();
    }, [getDatas]);

    const categoryFieldRequired = (
        categoryId: string | undefined,
        categories: ICategory[],
        column: string
    ) => {
        let isColumnRequired: any;
        const categoryInfo: ICategory = categories.filter(
            (category) => category.categoryId === categoryId
        )[0];
        switch (column) {
            case "AssetTagNumber":
                isColumnRequired = categoryInfo?.assetTagRequired;
                break;

            case "SerialNumber":
                isColumnRequired = categoryInfo?.serialNumberRequired;
                break;
            case "Warranty":
                isColumnRequired = categoryInfo?.warrantyRequired;
                break;
            case "Issuable":
                isColumnRequired = categoryInfo?.issuable;
                break;
            default:
                isColumnRequired = true;
                break;
        }
        return isColumnRequired &&
            isColumnRequired.toString().toLowerCase() === "true"
            ? true
            : false;
    };

    const isRegisterable = request?.every(
        (a) =>
            (categoryFieldRequired(
                a.categoryId,
                allCategories,
                "AssetTagNumber"
            )
                ? IsStringValid(a.assetTagNumber)
                : true) &&
            (categoryFieldRequired(a.categoryId, allCategories, "SerialNumber")
                ? IsStringValid(a.serialNumber)
                : true) &&
            IsNumericGreZero(a.assetValue) &&
            (categoryFieldRequired(a.categoryId, allCategories, "Warranty")
                ? IsValidDate(a.warrantyDate)
                : true)
    );

    const hasPropertyWithRegex = useCallback(
        (propertyName, regex) => {
            return request.some((r: any) => {
                const propertyValue = r[propertyName];
                return regex.test(propertyValue);
            });
        },
        [request]
    );

    const validateInput = useCallback(() => {
        setShowLineErrorMessage(true);

        let isFormValid = true;

        request.forEach((r: any) => {
            if (
                !r.categoryId ||
                !r.manufacturerId ||
                !isRegisterable ||
                isNaN(parseInt(r.assetValue))
            )
                isFormValid = false;
        });

        if (isExistingAsset) {
            if (
                !selectedNetworkCompany ||
                !isFormValid ||
                hasPropertyWithRegex("assetTagNumber", assetTagRegex) ||
                hasPropertyWithRegex("serialNumber", specialCharacterRegex)
            ) {
                setFailure("Please input details");
                return false;
            }
        } else if (
            !selectedNetworkCompany ||
            !selectedSource ||
            !receivedDate ||
            !documentFileName ||
            !isFormValid ||
            !documentNumber ||
            documentNumber.length > 50 ||
            hasPropertyWithRegex("assetTagNumber", assetTagRegex) ||
            hasPropertyWithRegex("serialNumber", specialCharacterRegex)
        ) {
            setFailure("Please input details");
            return false;
        }

        setShowLineErrorMessage(false);
        return true;
    }, [
        documentFileName,
        isRegisterable,
        receivedDate,
        request,
        selectedNetworkCompany,
        selectedSource,
        isExistingAsset,
        documentNumber,
        hasPropertyWithRegex,
    ]);

    const submitData = async (register?: boolean) => {
        if (!validateInput()) return;

        var flag = 0;
        for (var i = 0; i < request!.length; i++) {
            if (request![i].assetTagNumber == null) {
                continue;
            } else {
                for (var j = i + 1; j < request!.length; j++) {
                    if (
                        request![j].assetTagNumber == null ||
                        request![j].assetTagNumber === ""
                    ) {
                        continue;
                    } else {
                        if (
                            request![j].assetTagNumber?.toLowerCase() ===
                            request![i].assetTagNumber?.toLowerCase()
                        ) {
                            flag++;
                            break;
                        }
                    }
                }
            }
        }

        if (flag > 0) {
            setFailure(duplicateAssetErrorMessage);
            return;
        } else {
            setFailure(undefined);
        }

        setIsLoading((prevState) => true);
        request.forEach((element: any) => {
            element.sourceId = selectedSource;
            element.networkCompanyId = selectedNetworkCompany;
            element.receivedDate = isExistingAsset ? new Date() : receivedDate;
            element.notes = notes;
            element.supportingDocumentFile = isExistingAsset
                ? undefined
                : documentFile;
            element.cutOverStock = isExistingAsset;
            element.documentNumber = isExistingAsset
                ? undefined
                : documentNumber;
            element.assetTagNumber =
                element.assetTagNumber === ""
                    ? undefined
                    : element.assetTagNumber;
        });

        let response: any;
        if (otherSourceId !== undefined) {
            try {
                response = await UpdateOtherSourceInventoryRequest(
                    request,
                    register,
                    otherSourceId
                );
                if (response && isExistingAsset) {
                    if (!isFileChange) {
                        closeRefresh(
                            register
                                ? "Successfully registered"
                                : "Successfully saved"
                        );
                    } else {
                        closeRefresh(
                            register
                                ? "Successfully registered"
                                : "Successfully saved"
                        );
                    }
                } else if (!response) {
                    setFailure("Failed to create request");
                } else if (response && isFileChange) {
                    let obj = {
                        supportingDocumentFile: documentFile,
                        fileName: documentFileName,
                        inventoryOtherSourceId: response,
                    };
                    await uploadSupportDocument(obj)
                        .then((res) => {
                            if (res === true) {
                                closeRefresh(
                                    register
                                        ? "Successfully registered"
                                        : "Successfully saved"
                                );
                            } else {
                                setFailure("Failed to create request");
                            }
                        })
                        .catch((err) => setFailure(err));
                } else {
                    closeRefresh(
                        register
                            ? "Successfully registered"
                            : "Successfully saved"
                    );
                }
            } catch (err: any) {
                setFailure(err);
                setIsLoading(false);
            }
        } else {
            try {
                response = await createOtherSourceInventoryRequest(
                    request,
                    register
                );
                if (response && isExistingAsset) {
                    if (isFileChange) {
                        let obj = {
                            supportingDocumentFile: documentFile,
                            fileName: documentFileName,
                            inventoryOtherSourceId: response,
                        };
                        await uploadSupportDocument(obj)
                            .then((res) => {
                                if (res === true) {
                                    closeRefresh(
                                        register
                                            ? "Successfully registered"
                                            : "Successfully saved"
                                    );
                                } else {
                                    setFailure("Failed to create request");
                                }
                            })
                            .catch((err) => setFailure(err));
                    } else {
                        closeRefresh(
                            register
                                ? "Successfully registered"
                                : "Successfully saved"
                        );
                    }
                } else if (response) {
                    if (isFileChange) {
                        let obj = {
                            supportingDocumentFile: documentFile,
                            fileName: documentFileName,
                            inventoryOtherSourceId: response,
                        };
                        await uploadSupportDocument(obj)
                            .then((res) => {
                                if (res === true) {
                                    closeRefresh(
                                        register
                                            ? "Successfully registered"
                                            : "Successfully saved"
                                    );
                                } else {
                                    setFailure("Failed to create request");
                                }
                            })
                            .catch((err) => setFailure(err));
                    } else {
                        closeRefresh(
                            register
                                ? "Successfully registered"
                                : "Successfully saved"
                        );
                    }
                } else {
                    setFailure("Failed to create request");
                }
            } catch (err: any) {
                setFailure(err);
                setIsLoading(false);
            }
        }
        setIsLoading((prevState) => false);
    };

    const addRequest = () => {
        setRequest((prevState: any) => [...prevState, EmptyRequest]);
    };
    const saveDisabled = () => {
        if (!isExistingAsset) {
            if (
                !selectedNetworkCompany ||
                !selectedSource ||
                !receivedDate ||
                !documentFileName ||
                !documentNumber ||
                documentNumber.length > 50
            ) {
                return true;
            }
        } else if (!selectedNetworkCompany) {
            return true;
        }
        return false;
    };

    return (
        <StyledModal
            title={modalTitle}
            isOpen={isModalVisible}
            errorMessageBar={failure}
            setErrorMessageBar={() => {
                setFailure(undefined);
                setShowLineErrorMessage(false);
            }}
            onDismiss={setIsModalVisible}
            isLoading={isLoading}
            errorOccured={modalErrorOccured}
        >
            <ModalHeader
                isReadOnly={request.some((i) => i.assetStatus)}
                sources={sources}
                networkCompanies={networkCompanies}
                selectedNetworkCompany={selectedNetworkCompany}
                selectedSource={selectedSource}
                receivedDate={receivedDate}
                notes={notes}
                documentFileName={documentFileName}
                toggleFileChange={toggleFileChange}
                otherSourceId={otherSourceId}
                filePath={documentFilePath}
                showLineErrorMessage={showLineErrorMessage}
                setFailure={setFailure}
                addRequest={addRequest}
                setSelectedSource={setSelectedSource}
                setSelectedNetworkCompany={setSelectedNetworkCompany}
                setReceivedDate={setReceivedDate}
                setDocumentFileName={setDocumentFileName}
                setDocumentFile={setDocumentFile}
                setFilePath={setDocumentFilePath}
                setNotes={setNotes}
                isExistingAsset={isExistingAsset}
                toggleIsExistingAsset={toggleIsExistingAsset}
                documentNumber={documentNumber}
                setDocumentNumber={setDocumentNumber}
            />
            <Separator />
            <Stack
                styles={{
                    root: {
                        maxHeight: 300,
                        overflowY: "auto",
                        overflowX: "hidden",
                        marginBottom: 40,
                    },
                }}
            >
                <OtherSourceInventoryModalBody
                    isReadOnly={request.some((i) => i.assetStatus)}
                    categories={categories}
                    manufacturers={manufacturer}
                    showLineErrorMessage={showLineErrorMessage}
                    categoryFieldRequired={categoryFieldRequired}
                    allCategories={allCategories}
                    // request={request}
                    // setRequest={setRequest}
                />
            </Stack>
            <StyleModalFooter>
                <Stack horizontal horizontalAlign="space-between">
                    <Stack horizontal>
                        {!request.some((i) => i.assetStatus) && (
                            <PrimaryButton
                                style={{ width: "600" }}
                                onClick={() => submitData(true)}
                                disabled={saveDisabled()}
                                text="Register to Inventory"
                            />
                        )}
                    </Stack>
                    <Stack horizontal horizontalAlign="end">
                        {!request.some((i) => i.assetStatus) && (
                            <>
                                <DefaultButton
                                    styles={DashboardStyle.buttonStyles}
                                    onClick={setIsModalVisible}
                                    text="Cancel"
                                />
                                <PrimaryButton
                                    styles={DashboardStyle.buttonStyles}
                                    onClick={() => submitData()}
                                    text="Save"
                                    disabled={saveDisabled()}
                                />
                            </>
                        )}
                        {request.some((i) => i.assetStatus) && (
                            <Stack>
                                <Stack.Item align="end">
                                    <DefaultButton
                                        text="Back"
                                        onClick={setIsModalVisible}
                                    />
                                </Stack.Item>
                            </Stack>
                        )}
                    </Stack>
                </Stack>
            </StyleModalFooter>
        </StyledModal>
    );
};

export default OtherInventoryModal;

import React, { FormEvent, useCallback, useEffect, useState } from "react";
import StyledModal, {
    StyleModalFooter,
} from "../../../components/common/StyledModal";
import {
    IOtherSourceInventory,
    OtherSourceInventoryProps,
} from "../../../types/OtherSourceInventory";
import {
    IDropdownOption,
    Separator,
    TextField,
    TooltipHost,
} from "@fluentui/react";
import OtherSourceHeaderRefactored from "./OtherSourceModalHeaderRefactored";
import {
    IOtherSourceModalContext,
    useOtherSourceModalContext,
} from "../../../Contexts/OtherSourceModalContext";
import OtherSourceInventoryModalBody from "./OtherSourceInventoryModalBody";
import {
    GetAllCategories,
    GetCategories,
} from "../../../services/categoryService";
import { GetAllManfacturer } from "../../../services/manufacturerService";
import { Manufacturer } from "../../../types/Manufacturer";
import { useBoolean } from "@fluentui/react-hooks";
import {
    UpdateOtherSourceInventoryRequest,
    createOtherSourceInventoryRequest,
    getOtherSourcesInventoryById,
    uploadSupportDocument,
} from "../../../services/assetService";
import {
    IsNumericGreZero,
    IsStringValid,
    IsValidDate,
} from "../../../Other/InputValidation";
import { CategoryFieldRequired } from "./OtherSourceHelperFunctions";
import { OtherSourceModalFooter } from "./OtherSourceModalComponents";

export interface IOtherSourceInventoryInterface {
    isModalVisible: boolean;
    isReadOnly: boolean;
    selectedOtherSource: IOtherSourceInventory | undefined;
    setIsModalVisible: () => void;
    closeRefresh: (string: string) => void;
    refetchWithoutLoading: () => void;
}

export const inlineInputStyle = {
    root: {
        label: {
            whiteSpace: "nowrap",
            padding: "5px 0px 5px 0",
            lineHeight: 22,
            fontSize: 16,
        },
        lineHeight: "22px",
    },
    fieldGroup: { marginLeft: 10, width: "80%" },
    wrapper: { display: "flex" },
};

//Regex & const
export const specialCharacterRegex = /^[^a-zA-Z0-9]/;
export const assetTagRegex = /[^a-zA-Z0-9-]|^-+|^[^a-zA-Z0-9]/;

export const OtherSourceInventoryRefactored: React.FC<
    IOtherSourceInventoryInterface
> = ({
    isModalVisible,
    isReadOnly,
    selectedOtherSource,
    setIsModalVisible,
    closeRefresh,
    refetchWithoutLoading,
}) => {
    const { otherSourceDetail, setOtherSourceDetail } =
        useOtherSourceModalContext() as IOtherSourceModalContext;
    const [failure, setFailure] = useState<string>();
    const [isLoading, setIsLoading] = useState<boolean>();
    let modalTitle = "Other Source Inventory: ";
    const otherSourceId = selectedOtherSource?.inventoryOtherSourceId
        ? selectedOtherSource.inventoryOtherSourceId
        : undefined;

    const [categories, setCategories] = useState<any[] | []>([]);
    const [manufacturer, setManufacturer] = useState<
        IDropdownOption<Manufacturer>[] | null
    >([]);
    const [allCategories, setAllCategories] = useState<any[] | []>([]);
    const [isExistingAsset, { toggle: toggleIsExistingAsset }] =
        useBoolean(false);
    const [isFileChange, setIsFileChange] = useState<boolean>(false);

    if (otherSourceId) {
        modalTitle = modalTitle + selectedOtherSource?.documentID;
    } else {
        modalTitle = "Other Source Inventory";
    }

    const fetchOtherSourceById = async (otherSourceId: string) => {
        setIsLoading(true);
        const data = await getOtherSourcesInventoryById(otherSourceId);
        if (data) {
            setIsLoading(false);
            return data;
        }
        setIsLoading(false);
    };

    const reFetchData = useCallback(async () => {
        if (selectedOtherSource && otherSourceId) {
            const otherSourceData = await fetchOtherSourceById(otherSourceId);
            refetchWithoutLoading();
            if (otherSourceData) {
                setOtherSourceDetail(
                    otherSourceData as OtherSourceInventoryProps[]
                );
            }
        }
    }, [
        otherSourceId,
        refetchWithoutLoading,
        selectedOtherSource,
        setOtherSourceDetail,
    ]);

    useEffect(() => {
        const fetchData = async () => {
            if (selectedOtherSource && otherSourceId) {
                const otherSourceData = await fetchOtherSourceById(
                    otherSourceId
                );
                if (otherSourceData) {
                    if (
                        otherSourceData?.some(
                            (i: OtherSourceInventoryProps) =>
                                i.cutOverStock === true
                        ) &&
                        isExistingAsset === false
                    ) {
                        toggleIsExistingAsset();
                    } else if (
                        otherSourceData?.some(
                            (i: OtherSourceInventoryProps) =>
                                i.cutOverStock === false
                        ) &&
                        isExistingAsset === true
                    ) {
                        toggleIsExistingAsset();
                    }
                    setOtherSourceDetail(
                        otherSourceData as OtherSourceInventoryProps[]
                    );
                }
            }
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedOtherSource, otherSourceId, setOtherSourceDetail]);

    //fetching category, manufacturer, all categories details
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [categoriesData, manufacturerData, allCategoriesData] =
                    await Promise.all([
                        GetAllCategories(),
                        GetAllManfacturer(),
                        GetCategories(),
                    ]);

                setCategories(categoriesData);
                setManufacturer(manufacturerData);
                setAllCategories(allCategoriesData);
            } catch (error) {
                setFailure(error as string);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const documentNumberHandler = useCallback(
        (
            event: FormEvent<HTMLInputElement | HTMLTextAreaElement>,
            newValue?: string | undefined
        ) => {
            if (!otherSourceDetail) {
                setOtherSourceDetail([
                    {
                        documentNumber: newValue,
                    },
                ]);
            } else {
                const updatedRequest = [...otherSourceDetail!];
                updatedRequest[0].documentNumber = newValue;
                setOtherSourceDetail(updatedRequest);
            }
        },
        [otherSourceDetail, setOtherSourceDetail]
    );

    const isRegisterable = otherSourceDetail?.every(
        (a) =>
            (CategoryFieldRequired(
                a.categoryId,
                allCategories,
                "AssetTagNumber"
            )
                ? IsStringValid(a.assetTagNumber)
                : true) &&
            (CategoryFieldRequired(a.categoryId, allCategories, "SerialNumber")
                ? IsStringValid(a.serialNumber)
                : true) &&
            IsNumericGreZero(a.assetValue) &&
            (CategoryFieldRequired(a.categoryId, allCategories, "Warranty")
                ? IsValidDate(a.warrantyDate)
                : true)
    );

    const hasPropertyWithRegex = useCallback(
        (propertyName, regex) => {
            return otherSourceDetail?.some((r: any) => {
                const propertyValue = r[propertyName];
                return regex.test(propertyValue);
            });
        },
        [otherSourceDetail]
    );

    const validateInput = useCallback(() => {
        const isAssetValid = otherSourceDetail?.every(
            (r) =>
                r.categoryId &&
                r.manufacturerId &&
                isRegisterable &&
                r.assetValue &&
                !isNaN(parseInt(r.assetValue))
        );

        const isFirstItemValid =
            otherSourceDetail &&
            otherSourceDetail.length > 0 &&
            (!otherSourceDetail[0].networkCompanyId ||
                (isExistingAsset
                    ? !isAssetValid ||
                      hasPropertyWithRegex("assetTagNumber", assetTagRegex) ||
                      hasPropertyWithRegex(
                          "serialNumber",
                          specialCharacterRegex
                      )
                    : !isAssetValid ||
                      !otherSourceDetail[0].sourceId ||
                      !otherSourceDetail[0].receivedDate ||
                      !otherSourceDetail[0].fileName ||
                      !otherSourceDetail[0].documentNumber ||
                      otherSourceDetail[0].documentNumber.length > 50 ||
                      hasPropertyWithRegex("assetTagNumber", assetTagRegex) ||
                      hasPropertyWithRegex(
                          "serialNumber",
                          specialCharacterRegex
                      )));

        if (isFirstItemValid) {
            setFailure("Please input details");
            return false;
        }

        return true;
    }, [
        hasPropertyWithRegex,
        isExistingAsset,
        isRegisterable,
        otherSourceDetail,
        setFailure,
    ]);

    const submitData = useCallback(
        async (register?: boolean, needsCloseRefresh?: boolean) => {
            let requestData;
            if (otherSourceDetail) {
                requestData = [...otherSourceDetail];
            }
            if (!validateInput()) return;

            let response: any;

            const seenAssetTagNumbers: { [key: string]: boolean } = {};
            let hasDuplicates = false;

            requestData?.forEach((element) => {
                if (element.assetTagNumber) {
                    const normalizedTagNumber =
                        element.assetTagNumber.toLowerCase();
                    if (seenAssetTagNumbers[normalizedTagNumber]) {
                        hasDuplicates = true;
                    } else {
                        seenAssetTagNumbers[normalizedTagNumber] = true;
                    }
                }
            });

            if (isExistingAsset) {
                var currentDate = new Date();
                currentDate.setHours(0, 0, 0, 0);
                requestData = requestData?.map((item) => ({
                    ...item,
                    cutOverStock: true,
                    documentNumber: undefined,
                    receivedDate: currentDate,
                }));
            }

            if (hasDuplicates) {
                setFailure(
                    "Duplicate AssetTag has been added. Please change it."
                );
                return;
            } else {
                setFailure(undefined);
            }

            setIsLoading(true);

            try {
                if (otherSourceId !== undefined) {
                    response = await UpdateOtherSourceInventoryRequest(
                        requestData,
                        register,
                        otherSourceId
                    );
                } else {
                    response = await createOtherSourceInventoryRequest(
                        requestData,
                        register
                    );
                }

                if (response) {
                    if (isFileChange) {
                        const obj = {
                            supportingDocumentFile:
                                requestData?.[0].supportingDocumentFile,
                            fileName: requestData?.[0].fileName,
                            inventoryOtherSourceId: response,
                        };

                        const res = await uploadSupportDocument(obj);

                        if (res === true) {
                            needsCloseRefresh &&
                                closeRefresh(
                                    register
                                        ? "Successfully registered"
                                        : "Successfully saved"
                                );
                            setOtherSourceDetail([
                                {},
                            ] as OtherSourceInventoryProps[]);
                            setFailure(undefined);
                        } else {
                            setFailure("Failed to create request");
                        }
                    } else {
                        needsCloseRefresh &&
                            closeRefresh(
                                register
                                    ? "Successfully registered"
                                    : "Successfully saved"
                            );
                        setOtherSourceDetail([
                            {},
                        ] as OtherSourceInventoryProps[]);
                        setFailure(undefined);
                    }
                } else {
                    setFailure("Failed to create request");
                }
            } catch (err: any) {
                setFailure(err);
            } finally {
                setIsLoading(false);
            }
        },
        [
            closeRefresh,
            isExistingAsset,
            isFileChange,
            otherSourceDetail,
            otherSourceId,
            setOtherSourceDetail,
            validateInput,
        ]
    );

    const dismissModal = () => {
        setOtherSourceDetail([{}] as OtherSourceInventoryProps[]);
        setIsModalVisible();
        if (isExistingAsset) {
            toggleIsExistingAsset();
        }
    };

    return (
        <StyledModal
            title={modalTitle}
            isOpen={isModalVisible}
            errorMessageBar={failure}
            setErrorMessageBar={() => {
                setFailure(undefined);
            }}
            onDismiss={() => {
                setFailure(undefined);
                dismissModal();
            }}
            isLoading={isLoading}
        >
            <OtherSourceHeaderRefactored
                otherSourceId={otherSourceId}
                isReadOnly={isReadOnly}
                isExistingAsset={isExistingAsset}
                toggleIsExistingAsset={toggleIsExistingAsset}
                setIsFileChange={setIsFileChange}
                submitData={submitData}
                fetchData={reFetchData}
                setFailure={setFailure}
            >
                {isReadOnly ? (
                    <>
                        <TooltipHost
                            content={
                                otherSourceDetail?.[0]?.documentNumber ?? ""
                            }
                        >
                            <TextField
                                label="Document Number: "
                                borderless
                                readOnly
                                styles={inlineInputStyle}
                                value={
                                    otherSourceDetail?.[0]?.documentNumber ?? ""
                                }
                            />
                        </TooltipHost>
                    </>
                ) : (
                    <TextField
                        placeholder="Document Number"
                        label="Document Number"
                        resizable={false}
                        required
                        onChange={documentNumberHandler}
                        value={otherSourceDetail?.[0]?.documentNumber}
                        errorMessage={
                            otherSourceDetail?.[0]?.documentNumber &&
                            otherSourceDetail?.[0]?.documentNumber.length > 50
                                ? "Document Number exceeds character limit"
                                : undefined
                        }
                        validateOnLoad={false}
                        validateOnFocusOut
                    />
                )}
            </OtherSourceHeaderRefactored>
            <Separator />

            <OtherSourceInventoryModalBody
                isReadOnly={
                    otherSourceDetail?.some((i) => i.assetStatus) ?? false
                }
                categories={categories}
                manufacturers={manufacturer}
                showLineErrorMessage={
                    //showLineErrorMessage ??
                    false
                }
                categoryFieldRequired={CategoryFieldRequired}
                allCategories={allCategories}
            />

            <StyleModalFooter>
                <OtherSourceModalFooter
                    setIsModalVisible={setIsModalVisible}
                    isExistingAsset={isExistingAsset}
                    submitData={submitData}
                    toggleIsExistingAsset={toggleIsExistingAsset}
                    setFailure={setFailure}
                />
            </StyleModalFooter>
        </StyledModal>
    );
};

import * as React from "react";
import { useCallback, useEffect, useState } from "react";

//Fluent & other 3rd party components
import {
    DefaultButton,
    PrimaryButton,
    ProgressIndicator,
    Separator,
    Stack,
    TextField,
} from "@fluentui/react";

//Services
import { DownloadInvoice } from "../../../services/invoiceService";
import {
    updateAssetDetailsFromInvoice,
    getAssetsyInvoice,
} from "../../../services/assetService";
import { GetCategories } from "../../../services/categoryService";

//Components
import StyledModal, {
    StyleModalFooter,
} from "../../../components/common/StyledModal";
import AddAssetsModalBody from "./AddAssetsModalBody";

//Helper functions
import {
    IsIntGreZero,
    IsNumericGreZero,
    IsStringValid,
    IsValidDate,
} from "../../../Other/InputValidation";
import { convertUTCDateToLocalDate } from "../../../Other/DateFormat";
import { CategoryFieldRequired } from "./helperFunctions";

//Types
import IAsset from "../../../types/Asset";

//Styles
import { inlineInputStyle, downloadIcon } from "./StockReceipt.styles";

//Regex & const
const specialCharacterRegex = /^[^a-zA-Z0-9]/;
export const assetTagRegex = /[^a-zA-Z0-9-]|^-+|^[^a-zA-Z0-9]/;

const AddAssetsModal = (props: any) => {
    const { invoiceId, invoiceData, setInvoiceId, onUpdate } = props;
    const [assets, setAssets] = useState<IAsset[] | null>();
    const [prevAssets, setPrevAssets] = useState<IAsset[] | any>();
    const [editedList, setEditedList] = useState<any[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | undefined>();
    const [successMessage, setSuccessMessage] = useState<string | undefined>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [categories, setCategories] = useState<any[] | []>([]);
    const [isInvoiceDownloading, setIsInvoiceDownloading] =
        useState<boolean>(false);

    const duplicateAssetErrorMessage =
        "Duplicate asset tag number has been added! Please change it.";
    const duplicateSerialNumberErrorMessage =
        "Duplicate Serial Number has been added! Please change it.";

    const modalTitle =
        (invoiceData.isAssetAddedToInventory === false
            ? "Add to Inventory : "
            : "View invoice details: ") + invoiceData?.invoiceNumber;

    const isAssetValueValid =
        editedList.length > 0 &&
        prevAssets.length > 0 &&
        editedList.some((a) => {
            const prev = prevAssets?.find(
                (obj: IAsset) => obj.inventoryId === a.inventoryId
            ).assetValue;
            return prev && Number(a.assetValue) > Number(prev);
        });

    const isSaveable =
        editedList.length > 0 &&
        editedList.every(
            (a) =>
                (a.AssetTagRequired
                    ? IsStringValid(a.assetTagNumber) &&
                      !assetTagRegex.test(a.assetTagNumber)
                    : !assetTagRegex.test(a.assetTagNumber)) &&
                (a.SerialNumberRequired
                    ? IsStringValid(a.serialNumber) &&
                      !specialCharacterRegex.test(a.serialNumber)
                    : !specialCharacterRegex.test(a.serialNumber)) &&
                IsIntGreZero(a.assetValue) &&
                (a.WarrantyRequired ? IsValidDate(a.warrentyDate) : true)
        );

    const isRegisterable = assets?.every(
        (a) =>
            (CategoryFieldRequired(a.categoryName, categories, "AssetTagNumber")
                ? IsStringValid(a.assetTagNumber) &&
                  !assetTagRegex.test(a.assetTagNumber)
                : !assetTagRegex.test(a.assetTagNumber)) &&
            (CategoryFieldRequired(a.categoryName, categories, "SerialNumber")
                ? IsStringValid(a.serialNumber) &&
                  !specialCharacterRegex.test(a.serialNumber)
                : !specialCharacterRegex.test(a.serialNumber)) &&
            IsNumericGreZero(a.assetValue) &&
            (CategoryFieldRequired(a.categoryName, categories, "Warranty")
                ? IsValidDate(a.warrentyDate)
                : true)
    );
    const isRegistered = invoiceData?.isAssetAddedToInventory;

    useEffect(() => {
        GetCategories()
            .then((categoryResp) => {
                setCategories(categoryResp);
            })
            .catch(() => {
                setCategories([]);
            });
        getAssetsyInvoice(invoiceId)
            .then((res) => {
                setAssets(res);
                const object = [...res];
                setPrevAssets(object);
            })
            .catch((err) => setAssets(null));
    }, [invoiceId]);

    const submitData = useCallback(
        async (register?: boolean) => {
            //checking for duplicate Asset Tag Number
            let duplicateAssetTag = false;
            let duplicateSerialNumber = false;
            var flag = 0;

            for (let i = 0; i < assets!.length; i++) {
                if (assets![i].assetTagNumber == null) {
                    continue;
                }

                for (let j = i + 1; j < assets!.length; j++) {
                    if (assets![j].assetTagNumber == null) {
                        continue;
                    }

                    if (
                        assets![j].assetTagNumber.toLowerCase().trim() ===
                        assets![i].assetTagNumber.toLowerCase().trim()
                    ) {
                        duplicateAssetTag = true;
                        flag++;
                        break;
                    }
                }

                if (duplicateAssetTag) {
                    break;
                }
            }
            for (let i = 0; i < assets!.length; i++) {
                if (assets![i].serialNumber == null) {
                    continue;
                }

                for (let q = i + 1; q < assets!.length; q++) {
                    if (assets![q].serialNumber == null) {
                        continue;
                    }

                    if (
                        assets![q].serialNumber.toLowerCase().trim() ===
                        assets![i].serialNumber.toLowerCase().trim()
                    ) {
                        duplicateSerialNumber = true;
                        flag++;
                        break;
                    }
                }

                if (duplicateSerialNumber) {
                    break;
                }
            }

            if (duplicateAssetTag) {
                setErrorMessage(duplicateAssetErrorMessage);
            } else if (duplicateSerialNumber) {
                setErrorMessage(duplicateSerialNumberErrorMessage);
            } else {
                setErrorMessage(undefined);
            }

            if (
                (isRegisterable || isSaveable) &&
                flag === 0 &&
                !isAssetValueValid
            ) {
                setIsLoading(true);

                try {
                    let response;
                    let updatedAssets;
                    if (register) {
                        updatedAssets = assets?.map((asset: IAsset) => ({
                            ...asset,
                            issuable: CategoryFieldRequired(
                                asset.categoryName,
                                categories,
                                "Issuable"
                            ),
                        }));
                    }
                    if (editedList || updatedAssets) {
                        response = await updateAssetDetailsFromInvoice(
                            editedList.length > 0 && !register
                                ? editedList
                                : (updatedAssets as IAsset[]),
                            invoiceId,
                            register
                        );
                    }
                    setIsLoading(false);
                    if (response) {
                        setInvoiceId(undefined);
                        onUpdate(
                            register
                                ? "Registered successfully"
                                : "Saved successfully"
                        );
                    } else {
                        setErrorMessage("Error occured. Please try again!");
                    }
                } catch (err: any) {
                    setErrorMessage(err);
                    setIsLoading(false);
                }
            } else {
                if (flag === 0) {
                    setErrorMessage("Please fill the required fields");
                }
                if (isAssetValueValid) {
                    setErrorMessage("Asset value should not be greater");
                }
            }
        },
        [
            assets,
            isRegisterable,
            isSaveable,
            editedList,
            invoiceId,
            setInvoiceId,
            onUpdate,
        ]
    );

    const Header = useCallback(() => {
        const invoiceDownloadHandler = async () => {
            setIsInvoiceDownloading(true);
            try {
                const response = await DownloadInvoice(
                    invoiceData.invoiceId,
                    invoiceData.invoiceFileName
                );
                if (response === true) {
                    setSuccessMessage("Invoice file downloaded successfully");
                } else {
                    setErrorMessage("Invoice file downloaded failed");
                }
            } catch (err: any) {
                setErrorMessage(err);
            }
            setIsInvoiceDownloading(false);
        };

        return (
            <Stack horizontal style={{ margin: "16px" }}>
                <Stack>
                    <TextField
                        label="PO Number:"
                        readOnly
                        styles={inlineInputStyle}
                        borderless
                        name="purchaseOrderNumber"
                        value={invoiceData?.purchaseOrderNumber}
                    />
                    <TextField
                        label="Invoice Number:"
                        readOnly
                        styles={inlineInputStyle}
                        borderless
                        name="invoiceNumber"
                        value={invoiceData?.invoiceNumber}
                    />
                </Stack>
                <Stack>
                    <TextField
                        label="PO Date:"
                        readOnly
                        styles={inlineInputStyle}
                        borderless
                        name="requestRaisedOn"
                        value={
                            invoiceData?.requestRaisedOn &&
                            new Date(
                                invoiceData?.requestRaisedOn
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
                            invoiceData?.invoiceDate &&
                            convertUTCDateToLocalDate(
                                new Date(invoiceData?.invoiceDate)
                            ).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            })
                        }
                    />
                </Stack>
                <Stack verticalAlign="end" style={{ margin: 16 }}>
                    <Stack.Item>
                        {isInvoiceDownloading ? (
                            <ProgressIndicator label="Downloading" />
                        ) : (
                            <DefaultButton
                                text="Invoice"
                                iconProps={downloadIcon}
                                onClick={invoiceDownloadHandler}
                            />
                        )}
                    </Stack.Item>
                </Stack>
            </Stack>
        );
    }, [invoiceData, isInvoiceDownloading]);

    const Footer = useCallback(
        ({ isRegistered, categories }) => {
            if (isRegistered) {
                return (
                    <Stack>
                        <Stack.Item align="end">
                            <DefaultButton
                                text="Cancel"
                                onClick={() => setInvoiceId(undefined)}
                            />
                        </Stack.Item>
                    </Stack>
                );
            }
            return (
                <Stack horizontal horizontalAlign="space-between">
                    <Stack.Item>
                        <PrimaryButton
                            text="Register to Inventory"
                            onClick={() => submitData(true)}
                            disabled={!isRegisterable}
                        />
                    </Stack.Item>
                    <Stack horizontal tokens={{ childrenGap: 10 }}>
                        <DefaultButton
                            text="Cancel"
                            onClick={() => setInvoiceId(undefined)}
                        />
                        <PrimaryButton
                            text="Save"
                            onClick={() => submitData()}
                            disabled={!isSaveable}
                        />
                    </Stack>
                </Stack>
            );
        },
        [isSaveable, isRegisterable, setInvoiceId, submitData]
    );

    return (
        <StyledModal
            isLoading={assets === undefined || isLoading}
            isOpen={invoiceId.length > 0}
            onDismiss={() => setInvoiceId(undefined)}
            title={modalTitle}
            errorMessageBar={errorMessage}
            setErrorMessageBar={setErrorMessage}
            successMessageBar={successMessage}
            setSuccessMessageBar={setSuccessMessage}
            errorOccured={assets === null}
        >
            <Stack>
                <Stack>
                    <Header />
                    <Separator />
                    <AddAssetsModalBody
                        setEditedList={setEditedList}
                        assets={assets}
                        setAssets={setAssets}
                        prevAssets={prevAssets}
                        editedList={editedList}
                        isRegistered={isRegistered}
                        categories={categories}
                    />

                    <StyleModalFooter>
                        <Footer isRegistered={isRegistered} />
                    </StyleModalFooter>
                </Stack>
            </Stack>
        </StyledModal>
    );
};

export default AddAssetsModal;

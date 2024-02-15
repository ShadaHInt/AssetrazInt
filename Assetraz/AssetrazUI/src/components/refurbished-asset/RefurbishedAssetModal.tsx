import React, { FormEvent, useCallback, useEffect, useState } from "react";
import {
    DatePicker,
    DefaultButton,
    defaultDatePickerStrings,
    Dropdown,
    IDropdownOption,
    PrimaryButton,
    Separator,
    Stack,
    StackItem,
    TextField,
    Toggle,
} from "@fluentui/react";
import { IRefurbishedAssetModalType } from "./types";
import StyledModal, { StyleModalFooter } from "../common/StyledModal";
import {
    getAsset,
    getRefurbishedAssetById,
    updateRefurbished,
} from "../../services/assetService";
import { RefurbishedAsset } from "../../types/RefurbishedAsset";
import { RefurbishmentStatus } from "../../constants/RefurbishmentStatus";
import { AssetDetails } from "../issue-return/types";
import {
    convertDateToddMMMYYYFormat,
    convertLocalDateToUTCDate,
    convertUTCDateToLocalDate,
} from "../../Other/DateFormat";
import {
    buttonStyles,
    inlineInputStyle,
    input25,
    input30,
    inputFullWidth,
    stackToken,
    wrapStackTokens,
} from "./RefurbishedAssetStyles";

const RefurbishedAssetModal: React.FunctionComponent<
    IRefurbishedAssetModalType
> = (props: IRefurbishedAssetModalType) => {
    const { dismissPanel, refurbishedAssetId, selectedAssetId } = props;
    const [errorMessage, setErrorMessage] = useState<string>();
    const [isEdited, setIsEdited] = useState(false);
    const [isLoading, setIsloading] = useState<boolean>(false);
    const [issuedAsset, setIsIssuedAsset] = useState<boolean>(false);
    const [refurbishedAsset, setRefurbishedAsset] = useState<
        RefurbishedAsset | null | undefined
    >();

    const [prevAssets, setPrevAssets] = useState<
        RefurbishedAsset | null | undefined
    >();

    const [assetDetails, setAssetDetails] = useState<
        AssetDetails | undefined | null
    >();

    const setRefurbishedAssetAPi = useCallback(async () => {
        try {
            let response = await getRefurbishedAssetById(refurbishedAssetId);
            if (selectedAssetId) {
                try {
                    let assetDetail = await getAsset(selectedAssetId);
                    if (assetDetail) {
                        if (assetDetail.assetStatus === "Issued") {
                            setIsIssuedAsset(true);
                        }
                    }
                } catch (err: any) {
                    setErrorMessage(err);
                }
            }
            const object = { ...response };
            setPrevAssets(object);
            if (response) {
                setRefurbishedAsset(response);
                setAssetDetailAPi(response.inventoryId);
            } else {
                setRefurbishedAsset(null);
            }
        } catch (err: any) {
            setErrorMessage(err);
        }
    }, [refurbishedAssetId, selectedAssetId]);

    const setAssetDetailAPi = async (inventoryId: string) => {
        try {
            let response = await getAsset(inventoryId);
            if (response) {
                setAssetDetails(response);
            } else {
                setAssetDetails(null);
            }
        } catch (err: any) {
            setErrorMessage(err);
        }
    };

    useEffect(() => {
        setRefurbishedAssetAPi();
    }, [setRefurbishedAssetAPi]);

    const sentRequest = useCallback(async () => {
        if (
            refurbishedAsset?.remarks == null ||
            refurbishedAsset?.remarks.trim().length === 0
        ) {
            setErrorMessage("Comments are required");
        } else {
            setIsloading(true);
            try {
                let response = await updateRefurbished(
                    refurbishedAsset,
                    refurbishedAssetId
                );

                if (response === true) {
                    setIsloading(false);
                    dismissPanel(true);
                }
            } catch (err: any) {
                setIsloading(false);
                setErrorMessage(err);
            }
        }
    }, [dismissPanel, refurbishedAsset, refurbishedAssetId]);

    const Footer = useCallback(
        () => (
            <Stack horizontal horizontalAlign="end">
                <DefaultButton
                    styles={buttonStyles}
                    onClick={() => dismissPanel(false)}
                >
                    Cancel
                </DefaultButton>
                <PrimaryButton
                    styles={buttonStyles}
                    onClick={sentRequest}
                    disabled={
                        !isEdited ||
                        refurbishedAsset?.remarks == null ||
                        refurbishedAsset?.remarks.trim().length === 0
                    }
                >
                    Save
                </PrimaryButton>
            </Stack>
        ),
        [dismissPanel, isEdited, sentRequest, refurbishedAsset]
    );

    const reasonChangeHandler = (
        e: FormEvent<HTMLDivElement>,
        item: IDropdownOption | undefined
    ): void => {
        setIsEdited(true);
        if (item?.key === RefurbishmentStatus.Completed.toString()) {
            setRefurbishedAsset(
                (prevState: RefurbishedAsset | null | undefined) => {
                    if (prevState) {
                        return {
                            ...prevState,
                            refurbishedDate: convertLocalDateToUTCDate(
                                new Date()
                            ),
                            issuable: true,
                            status: item?.key as string,
                        };
                    }
                    return prevState;
                }
            );
        } else {
            setRefurbishedAsset(
                (prevState: RefurbishedAsset | null | undefined) => {
                    if (prevState) {
                        return {
                            ...prevState,
                            refurbishedDate: undefined,
                            status: item?.key as string,
                            issuable: false,
                        };
                    }
                    return prevState;
                }
            );
        }
        if (item?.key === prevAssets?.status) {
            setIsEdited(false);
        }
    };

    const changeHandler = (fieldName: string, value: any) => {
        setIsEdited(true);
        if (refurbishedAsset?.status === RefurbishmentStatus.Completed) {
            setRefurbishedAsset(
                (prevState: RefurbishedAsset | null | undefined) => {
                    if (prevState) {
                        return {
                            ...prevState,
                            [fieldName]: value,
                        };
                    }
                    return prevState;
                }
            );
        } else {
            setRefurbishedAsset(
                (prevState: RefurbishedAsset | null | undefined) => {
                    if (prevState) {
                        return {
                            ...prevState,
                            [fieldName]: null,
                        };
                    }
                    return prevState;
                }
            );
        }
        if (
            convertDateToddMMMYYYFormat(value) ===
            convertDateToddMMMYYYFormat(
                convertUTCDateToLocalDate(prevAssets?.refurbishedDate as Date)
            )
        ) {
            setIsEdited(false);
        }
    };

    const _onChange = (
        ev: React.MouseEvent<HTMLElement>,
        checked?: boolean
    ) => {
        setIsEdited(true);
        if (checked) {
            setRefurbishedAsset(
                (prevState: RefurbishedAsset | null | undefined) => {
                    if (prevState) {
                        var currentDate = new Date();
                        currentDate.setHours(0, 0, 0, 0);
                        return {
                            ...prevState,
                            issuable: false,
                            status: "NotSuccessful",
                            addToScrap: true,
                            refurbishedDate: convertLocalDateToUTCDate(
                                new Date()
                            ),
                            scrappedDate: currentDate,
                        };
                    }
                    return prevState;
                }
            );
        } else {
            if (refurbishedAsset?.status === RefurbishmentStatus.Completed) {
                setRefurbishedAsset(
                    (prevState: RefurbishedAsset | null | undefined) => {
                        if (prevState) {
                            return {
                                ...prevState,
                                issuable: true,
                                addToScrap: false,
                                refurbishedDate: undefined,
                            };
                        }
                        return prevState;
                    }
                );
            } else {
                setRefurbishedAsset(
                    (prevState: RefurbishedAsset | null | undefined) => {
                        if (prevState) {
                            return {
                                ...prevState,
                                issuable: false,
                                addToScrap: false,
                                refurbishedDate: undefined,
                            };
                        }
                        return prevState;
                    }
                );
            }
        }

        if (checked === prevAssets?.addToScrap) {
            setIsEdited(false);
        }
    };

    return (
        <StyledModal
            isOpen={refurbishedAssetId ? true : false}
            onDismiss={() => dismissPanel(false)}
            title={"Returned Assets Status Change"}
            errorMessageBar={errorMessage}
            setErrorMessageBar={() => setErrorMessage(undefined)}
            errorOccured={refurbishedAsset === null}
            isLoading={
                (refurbishedAsset === undefined &&
                    errorMessage === undefined) ||
                isLoading
            }
        >
            <Stack tokens={stackToken} style={{ minHeight: "650px" }}>
                <Stack wrap tokens={wrapStackTokens} horizontal>
                    <Stack>
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
                    </Stack>
                    <Stack>
                        <TextField
                            label="Category:"
                            readOnly
                            styles={inlineInputStyle}
                            borderless
                            name="categoryName"
                            value={refurbishedAsset?.categoryName}
                        />
                        <TextField
                            label="Model Number:"
                            readOnly
                            styles={inlineInputStyle}
                            borderless
                            name="modelNumber"
                            value={refurbishedAsset?.modelNumber}
                        />
                        <TextField
                            label="Manufacturer:"
                            readOnly
                            styles={inlineInputStyle}
                            borderless
                            name="manufacturerName"
                            value={refurbishedAsset?.manufacturerName}
                        />
                    </Stack>
                    <Stack>
                        <TextField
                            label="Warranty Date:"
                            readOnly
                            styles={inlineInputStyle}
                            borderless
                            name="warrentyDate"
                            value={
                                refurbishedAsset?.warrentyDate &&
                                convertUTCDateToLocalDate(
                                    new Date(refurbishedAsset?.warrentyDate)
                                ).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                })
                            }
                        />
                        <TextField
                            label="Serial Number:"
                            readOnly
                            styles={inlineInputStyle}
                            borderless
                            name="serialNumber"
                            value={refurbishedAsset?.serialNumber}
                        />
                        <TextField
                            label="Asset Tag#:"
                            readOnly
                            styles={inlineInputStyle}
                            borderless
                            name="assetTagNumber"
                            value={refurbishedAsset?.assetTagNumber}
                        />
                    </Stack>
                    <Stack>
                        <TextField
                            label="Returned Date:"
                            readOnly
                            styles={inlineInputStyle}
                            borderless
                            name="returnedDate"
                            value={
                                refurbishedAsset?.returnDate &&
                                new Date(
                                    refurbishedAsset.returnDate
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
                <Stack horizontal wrap tokens={wrapStackTokens}>
                    <Stack.Item styles={input25}>
                        <Dropdown
                            styles={input30}
                            label="Status"
                            options={Object.entries(RefurbishmentStatus).map(
                                (a) => ({
                                    key: a[0],
                                    text: a[1],
                                })
                            )}
                            onChange={reasonChangeHandler}
                            required
                            defaultValue={RefurbishmentStatus["NotStarted"]}
                            selectedKey={refurbishedAsset?.status}
                            disabled={
                                refurbishedAsset?.addToScrap
                                    ? true
                                    : false ||
                                      issuedAsset ||
                                      !refurbishedAsset?.isLatestEntry
                            }
                        />
                    </Stack.Item>
                    <Stack.Item styles={input25}>
                        <DatePicker
                            styles={input30}
                            label="Refurbished Date"
                            onSelectDate={(e) => {
                                changeHandler("refurbishedDate", e);
                            }}
                            value={
                                refurbishedAsset?.refurbishedDate &&
                                convertUTCDateToLocalDate(
                                    new Date(refurbishedAsset?.refurbishedDate)
                                )
                            }
                            strings={defaultDatePickerStrings}
                            minDate={
                                new Date(refurbishedAsset?.returnDate as string)
                            }
                            maxDate={new Date(Date.now())}
                            disabled={
                                issuedAsset ||
                                !refurbishedAsset?.isLatestEntry ||
                                refurbishedAsset?.addToScrap ||
                                refurbishedAsset?.status !==
                                    RefurbishmentStatus.Completed
                                    ? true
                                    : false
                            }
                        />
                    </Stack.Item>
                    <StackItem styles={input25}>
                        <Toggle
                            label="Move to scrap ?"
                            onText="Yes"
                            offText="No"
                            onChange={_onChange}
                            disabled={
                                issuedAsset || !refurbishedAsset?.isLatestEntry
                            }
                        />
                    </StackItem>
                    <Stack.Item styles={inputFullWidth}>
                        <TextField
                            styles={input30}
                            label="Comments:"
                            name="remarks"
                            placeholder="Please add remarks"
                            multiline
                            value={
                                refurbishedAsset
                                    ? (refurbishedAsset.remarks as string)
                                    : ""
                            }
                            rows={5}
                            onChange={(e, newValue?: string) => {
                                setIsEdited(true);
                                if (newValue === prevAssets?.remarks) {
                                    setIsEdited(false);
                                }
                                setRefurbishedAsset(
                                    (
                                        prevState:
                                            | RefurbishedAsset
                                            | null
                                            | undefined
                                    ) => {
                                        if (prevState) {
                                            return {
                                                ...prevState,
                                                remarks: newValue as string,
                                            };
                                        }
                                        return prevState;
                                    }
                                );
                            }}
                            onGetErrorMessage={(value: string) => {
                                if (value.trim().length === 0) {
                                    return "Comments are required";
                                } else {
                                    return "";
                                }
                            }}
                            validateOnLoad={false}
                            validateOnFocusOut
                            required
                            disabled={
                                issuedAsset || !refurbishedAsset?.isLatestEntry
                            }
                        />
                    </Stack.Item>
                </Stack>
            </Stack>
            <StyleModalFooter>
                <Footer />
            </StyleModalFooter>
        </StyledModal>
    );
};

export default RefurbishedAssetModal;

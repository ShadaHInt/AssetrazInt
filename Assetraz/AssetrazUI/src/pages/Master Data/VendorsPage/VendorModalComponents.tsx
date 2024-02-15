import React, { useCallback, useEffect, useState } from "react";
import { StateData, countriesData } from "../CountryData";
import { useVendorContext } from "../../../Contexts/VendorDetailContext";

import {
    Checkbox,
    DefaultButton,
    DirectionalHint,
    IDropdownOption,
    IIconProps,
    IRenderFunction,
    ITextFieldProps,
    IconButton,
    Label,
    PrimaryButton,
    Stack,
    TextField,
    TooltipHost,
} from "@fluentui/react";

import {
    AddVendorModalBodyProps,
    AddVendorModalFooterProps,
    IVendor,
} from "../../../types/Vendor";
import { SearchableDropdown } from "../../../components/common/SearchableDropdown";
import {
    AddVendor,
    DeleteVendor,
    UpdateVendor,
} from "../../../services/vendorService";
import DashboardStyle from "../../Home/DashboardStyles";

import {
    dropdownStyles,
    inlineCheckboxStyle,
    inlineCheckboxStyle2,
    inlineInputStyle,
    stackTokens,
} from "./VendorModalComponentsStyles";
import { trimObjectValues } from "./VendorPageHelperFunctions";
import { theme } from "../../../components/asset-requests/ViewAssetStyle";
import { infoButtonStyles } from "../../../components/common/TooltipStyles";

const deleteIcon: IIconProps = { iconName: "Delete" };
const deleteIconStyles = {
    icon: {
        fontSize: "x-large",
    },
    root: {
        color: theme.palette.redDark,
        marginTop: "8px",
    },
    rootHovered: {
        color: theme.palette.neutralDark,
    },
};

const vendorNameRegex = /^[a-zA-Z0-9\s]{1,40}$/;
const cityRegex = /^[a-zA-Z]+$/;
const contactPersonRegex = /^[a-zA-Z\s]+$/;
const contactNumberRegex = /^[6-9]\d{9}$/;
const emailAddressRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
const gstinRegex =
    /^[0-9]{2}[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}[0-9]{1}[A-Za-z]{1}[A-Za-z0-9]{1}$/;
const toolTipContent =
    "Valid GSTIN format - NNAAAAANNNNANAN, where N stands for numeric and A stands for alphabet.";

export const AddUpdateVendorModalBody: React.FC<AddVendorModalBodyProps> = ({
    isAddModal,
    setDataEdited,
}) => {
    const { vendorDetail, setVendorDetail, initialVendorDetail } =
        useVendorContext();
    const [selectedState, setSelectedState] = useState<string | null>(null);
    const countries = Object.keys(countriesData.country) as Array<
        keyof typeof countriesData["country"]
    >;
    const [selectedCountry, setSelectedCountry] = useState<
        keyof typeof countriesData["country"] | null
    >();

    const countryCode = Object.keys(countriesData.country).find(
        (key) => countriesData.country[key] === vendorDetail?.country
    );

    const stateCode = countryCode
        ? countriesData.states[countryCode!].find(
              (state) => state.name === vendorDetail?.state
          )?.code
        : undefined;

    const CustomGstinLabel: IRenderFunction<ITextFieldProps> = (props) => {
        return (
            <>
                <TooltipHost
                    content={toolTipContent}
                    directionalHint={DirectionalHint.rightTopEdge}
                >
                    <Stack
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            marginRight: "16px",
                        }}
                    >
                        <Label>
                            GSTIN Number: {props?.required ? "*" : null}
                        </Label>
                        <DefaultButton
                            aria-label={"more info"}
                            styles={infoButtonStyles}
                            iconProps={{ iconName: "Info" }}
                        />
                    </Stack>
                </TooltipHost>
            </>
        );
    };

    const findCountryCode = (countryName: string): string | undefined => {
        for (const code in countriesData.country) {
            if (countriesData.country[code] === countryName) {
                return code;
            }
        }
        return undefined;
    };

    useEffect(() => {
        if (vendorDetail && !isAddModal) {
            if (vendorDetail.country && vendorDetail.state) {
                const countryName = vendorDetail.country;
                const countryCode = findCountryCode(countryName);
                setSelectedCountry(countryCode);
                const stateCode = vendorDetail.state;

                const selectedStateData = (
                    countriesData.states as {
                        [code: string]: StateData[];
                    }
                )[countryCode!]?.find((state) => state.name === stateCode);
                if (selectedStateData) {
                    setSelectedState(selectedStateData.code);
                } else {
                    setSelectedState(null);
                }
            }
        }
    }, [isAddModal, vendorDetail]);

    useEffect(() => {
        if (vendorDetail?.country) {
            const countryName = vendorDetail.country;
            const countryCode = findCountryCode(countryName);
            setSelectedCountry(countryCode);
        }
    }, [vendorDetail?.country]);

    useEffect(() => {
        if (initialVendorDetail && vendorDetail) {
            const trimmedInitialVendor = trimObjectValues(initialVendorDetail);
            const trimmedVendorDetail = trimObjectValues(vendorDetail);
            setDataEdited(
                JSON.stringify(trimmedInitialVendor) !==
                    JSON.stringify(trimmedVendorDetail)
            );
        }
    }, [initialVendorDetail, setDataEdited, vendorDetail]);

    const handleChange = (
        e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
        value: string | undefined,
        field: keyof IVendor
    ) => {
        const updatedValue = {
            ...vendorDetail,
            [field]: value,
        } as IVendor;
        setVendorDetail(updatedValue);
    };

    const handleCheckBox = (
        ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
        isChecked?: boolean
    ) => {
        if (ev?.currentTarget instanceof HTMLInputElement) {
            const { name } = ev.currentTarget;
            const updatedValue = {
                ...vendorDetail,
                [name]: isChecked,
            } as IVendor;
            setVendorDetail(updatedValue);
        }
    };

    const handleCountryChange = (
        event: React.FormEvent<HTMLDivElement>,
        item?: IDropdownOption
    ) => {
        if (item) {
            setSelectedCountry(
                item.key as keyof typeof countriesData["country"]
            );
            setSelectedState(null);
            const updatedValue = {
                ...vendorDetail,
                country: item.text,
            } as IVendor;
            setVendorDetail(updatedValue);
        }
    };

    const handleStateChange = (
        event: React.FormEvent<HTMLDivElement>,
        item?: IDropdownOption
    ) => {
        if (item) {
            setSelectedState(item.key.toString());
            const updatedValue = {
                ...vendorDetail,
                state: item.text,
            } as IVendor;
            setVendorDetail(updatedValue);
        }
    };

    return (
        <Stack tokens={stackTokens}>
            <TextField
                label="Vendor Name:"
                styles={inlineInputStyle}
                required
                value={vendorDetail?.vendorName}
                onChange={(e, t) => handleChange(e, t, "vendorName")}
                onGetErrorMessage={(value: string) => {
                    if (value.trim().length === 0) {
                        return "Required";
                    } else if (
                        value.trim().length > 40 &&
                        !vendorNameRegex.test(value)
                    ) {
                        return "Vendor name only accepts 40 characters and must be Alpha Numeric.";
                    } else if (value.trim().length > 40) {
                        return "Vendor name only accepts 40 characters.";
                    } else if (!vendorNameRegex.test(value)) {
                        return "Field accepts Alpha Numeric only.";
                    }
                }}
                validateOnFocusOut
                validateOnLoad={false}
            />

            <TextField
                label="Address Line 1:"
                value={vendorDetail?.vendorAddressLine1}
                styles={inlineInputStyle}
                onChange={(e, t) => handleChange(e, t, "vendorAddressLine1")}
                required
                onGetErrorMessage={(value: string) => {
                    if (value.trim().length === 0) {
                        return "Required";
                    }
                }}
                validateOnFocusOut
                validateOnLoad={false}
            />

            <TextField
                label="Address Line 2:"
                value={vendorDetail?.vendorAddressLine2}
                styles={inlineInputStyle}
                onChange={(e, t) => handleChange(e, t, "vendorAddressLine2")}
            />

            <SearchableDropdown
                options={countries.map((countryKey) => ({
                    key: countryKey,
                    text: countriesData.country[countryKey],
                }))}
                onChange={handleCountryChange}
                placeholder="Select a country"
                label={"Select a country"}
                styles={dropdownStyles}
                selectedKey={
                    vendorDetail?.country ? countryCode : selectedCountry
                }
                style={{ width: "40%" }}
                required
            />

            <SearchableDropdown
                options={
                    selectedCountry
                        ? countriesData.states[selectedCountry].map(
                              (state) => ({
                                  key: state.code,
                                  text: state.name,
                              })
                          )
                        : []
                }
                onChange={handleStateChange}
                selectedKey={vendorDetail?.state ? stateCode : selectedState}
                placeholder="Select a state"
                label={"Select a state"}
                styles={dropdownStyles}
                style={{ width: "40%" }}
                required
            />

            <TextField
                label="City:"
                value={vendorDetail?.city}
                styles={inlineInputStyle}
                onChange={(e, t) => handleChange(e, t, "city")}
                required
                onGetErrorMessage={(value: string) => {
                    if (value.trim().length === 0) {
                        return "Required";
                    }
                    if (!cityRegex.test(value)) {
                        return "Field accepts characters only";
                    }
                }}
                validateOnFocusOut
                validateOnLoad={false}
            />

            <TextField
                label="Contact Person:"
                value={vendorDetail?.contactPerson}
                styles={inlineInputStyle}
                onChange={(e, t) => handleChange(e, t, "contactPerson")}
                onGetErrorMessage={(value: string) => {
                    if (value.trim().length === 0) {
                        return "Required";
                    }
                    if (!contactPersonRegex.test(value)) {
                        return "Field accepts characters only";
                    }
                }}
                validateOnFocusOut
                validateOnLoad={false}
                required
            />

            <TextField
                label="Phone number :"
                value={vendorDetail?.contactNumber}
                styles={inlineInputStyle}
                onChange={(e, t) => handleChange(e, t, "contactNumber")}
                onGetErrorMessage={(value: string) => {
                    if (value.trim().length === 0) {
                        return "Required";
                    }
                    if (!contactNumberRegex.test(value.trim())) {
                        return "Invalid";
                    }
                }}
                validateOnFocusOut
                validateOnLoad={false}
                required
                prefix="+91"
            />

            <TextField
                label="Email Address:"
                value={vendorDetail?.emailAddress}
                styles={inlineInputStyle}
                onChange={(e, t) => handleChange(e, t, "emailAddress")}
                onGetErrorMessage={(value: string) => {
                    if (!emailAddressRegex.test(value)) {
                        return "Invalid";
                    }
                    if (value.trim().length === 0) {
                        return "Required";
                    }
                }}
                validateOnFocusOut
                validateOnLoad={false}
                required
            />

            <TextField
                value={vendorDetail?.gstin}
                styles={inlineInputStyle}
                onChange={(e, t) => handleChange(e, t?.toUpperCase(), "gstin")}
                required
                onGetErrorMessage={(value: string) => {
                    if (value.trim().length === 0) {
                        return "Required";
                    }
                    if (!gstinRegex.test(value)) {
                        return "Invalid";
                    }
                }}
                validateOnFocusOut
                validateOnLoad={false}
                onRenderLabel={CustomGstinLabel}
            />

            <Stack
                tokens={{ childrenGap: 30 }}
                horizontal
                verticalAlign="center"
            >
                <Label>Preferred Vendor:</Label>
                <Checkbox
                    label=""
                    styles={inlineCheckboxStyle}
                    onChange={handleCheckBox}
                    boxSide="end"
                    checked={vendorDetail?.preferredVendor}
                    name="preferredVendor"
                />
            </Stack>

            <Stack
                style={{ marginTop: "10px" }}
                tokens={{ childrenGap: 30 }}
                horizontal
                verticalAlign="center"
            >
                <Label>Active:</Label>
                <Checkbox
                    label=""
                    styles={inlineCheckboxStyle2}
                    onChange={handleCheckBox}
                    boxSide="end"
                    checked={
                        vendorDetail?.active === undefined
                            ? true
                            : vendorDetail?.active
                    }
                    name="active"
                />
            </Stack>
        </Stack>
    );
};

export const AddUpdateVendorModalFooter: React.FC<
    AddVendorModalFooterProps
> = ({
    closeModal,
    setLoading,
    setErrorMessage,
    setSuccessMessage,
    getData,
    isAddModal,
    setIsAddModal,
    dataEdited,
}) => {
    const { vendorDetail } = useVendorContext();
    const sentRequest = async () => {
        try {
            setLoading(true);
            let response;
            const requestValue = {
                ...vendorDetail,
                active:
                    vendorDetail?.active !== undefined
                        ? vendorDetail.active
                        : true,
            } as IVendor;

            if (isAddModal) {
                response = await AddVendor(requestValue);
            } else if (!isAddModal && dataEdited) {
                response = await UpdateVendor(requestValue);
            }

            if (response) {
                setSuccessMessage(
                    isAddModal
                        ? "Vendor Added Successfully."
                        : "Vendor updated Successfully."
                );
                setIsAddModal && setIsAddModal(false);
                getData();
                setLoading(false);
                closeModal();
            }
        } catch (e) {
            setLoading(false);
            setErrorMessage(e as string);
        }
    };

    const validateRequiredFields = useCallback(() => {
        if (vendorDetail) {
            const isCountrySelected = vendorDetail.country !== undefined;
            const isStateSelected = vendorDetail.state !== undefined;
            const isAddressLine1Valid =
                vendorDetail.vendorAddressLine1?.trim().length > 0;
            const isEmailAddressValid =
                emailAddressRegex.test(vendorDetail.emailAddress || "") &&
                (vendorDetail.emailAddress?.trim().length ?? 0) > 0;
            const isGstinNumberValid =
                (vendorDetail.gstin?.trim().length ?? 0) > 0 &&
                gstinRegex.test(vendorDetail.gstin || "");
            const isCityValid =
                (vendorDetail.city?.trim().length ?? 0) > 0 &&
                cityRegex.test(vendorDetail.city || "");
            const isVendorNameValid =
                vendorNameRegex.test(vendorDetail.vendorName?.trim()) &&
                vendorDetail.vendorName?.trim().length > 0;

            const isContactPersonValid = contactPersonRegex.test(
                vendorDetail.contactPerson
            );

            const isContactNumberValid = contactNumberRegex.test(
                vendorDetail.contactNumber || ""
            );

            return (
                isVendorNameValid &&
                isAddressLine1Valid &&
                isCountrySelected &&
                isStateSelected &&
                isCityValid &&
                isContactPersonValid &&
                isContactNumberValid &&
                isEmailAddressValid &&
                isGstinNumberValid
            );
        }

        return false;
    }, [vendorDetail]);

    const deleteVendor = async () => {
        setLoading(true);
        try {
            var response = await DeleteVendor(vendorDetail?.vendorId as string);
            if (response) {
                setSuccessMessage("Successfully deleted.");
                getData();
                setLoading(false);
                closeModal();
            } else {
                setSuccessMessage(
                    "Vendor made inactive. There are associated assets with this vendor."
                );
                setLoading(false);
                getData();
                closeModal();
            }
        } catch (e) {
            setErrorMessage(e as string);
            setLoading(false);
        }
    };

    return (
        <Stack horizontal horizontalAlign="space-between">
            <Stack horizontalAlign="start">
                {!isAddModal ? (
                    <IconButton
                        styles={deleteIconStyles}
                        iconProps={deleteIcon}
                        ariaLabel="Delete"
                        onClick={deleteVendor}
                        title="Delete vendor"
                    />
                ) : null}
            </Stack>

            <Stack
                horizontal
                horizontalAlign="end"
                tokens={{ childrenGap: 10 }}
            >
                <DefaultButton
                    styles={DashboardStyle.buttonStyles}
                    text="Cancel"
                    onClick={() => {
                        closeModal();
                        setIsAddModal && setIsAddModal(false);
                    }}
                />
                <PrimaryButton
                    text="Submit"
                    styles={DashboardStyle.buttonStyles}
                    onClick={sentRequest}
                    disabled={
                        isAddModal
                            ? !validateRequiredFields()
                            : dataEdited
                            ? !validateRequiredFields()
                            : true
                    }
                />
            </Stack>
        </Stack>
    );
};

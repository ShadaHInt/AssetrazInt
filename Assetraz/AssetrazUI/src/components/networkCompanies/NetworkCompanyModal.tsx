import * as React from "react";
import { useEffect, useState } from "react";
import StyledModal, {
    ModalSize,
    StyleModalFooter,
} from "../common/StyledModal";
import {
    INetworkCompany,
    INetworkCompanyModal,
} from "../../types/NetworkCompany";
import {
    AddNetworkCompany,
    DeleteNetworkcompany,
    UpdateNetworkCompany,
} from "../../services/networkCompanyService";
import {
    StackItem,
    Stack,
    TextField,
    DefaultButton,
    PrimaryButton,
    Toggle,
    getTheme,
    IIconProps,
    IconButton,
} from "@fluentui/react";
import StyledLabel from "../common/StyledLabel";
import { validateContactNumber } from "../../Other/InputValidation";

const inlineInputStyle = {
    root: {
        margin: "2px 0px 0px 20px",
        width: "500px",
    },
};

const theme = getTheme();

const deleteIcon: IIconProps = { iconName: "Delete" };
const deleteIconStyles = {
    icon: {
        fontSize: "x-large",
    },
    root: {
        color: theme.palette.redDark,
    },
    rootHovered: {
        color: theme.palette.neutralDark,
    },
};

const buttonStyles = { root: { marginRight: 10 } };

const NetworkCompanyModal: React.FunctionComponent<INetworkCompanyModal> = (
    props
) => {
    const { networkCompanySelected, dismissPanel } = props;
    const [networkCompanyObj, setNetworkCompanyObj] = useState<any | null>();
    const [isLoading, setIsLoading] = useState(false);
    const [failure, setFailure] = useState<string>();
    const [isEdited, setIsEdited] = useState(false);

    useEffect(() => {
        setNetworkCompanyObj(networkCompanySelected);
    }, [networkCompanySelected]);

    const onInput = (type: string, value: any) => {
        let tempObj: any = {};
        if (networkCompanyObj) {
            tempObj = networkCompanyObj;
        }
        tempObj = { ...tempObj, [type]: value };
        setNetworkCompanyObj(tempObj);
        setIsEdited(true);
    };

    const capitalizeText = (text: string) => {
        if (text && typeof text === "string") {
            const lowercase = text.toLowerCase();
            return lowercase.charAt(0).toUpperCase() + lowercase.slice(1);
        } else {
            return text;
        }
    };

    const submitData = async () => {
        setIsLoading(true);
        if (networkCompanyObj?.companyName) {
            networkCompanyObj.companyName = capitalizeText(
                networkCompanyObj?.companyName.trim()
            );
        }
        if (Object.keys(networkCompanySelected).length === 0) {
            try {
                let response = await AddNetworkCompany(networkCompanyObj);

                if (response?.data === true) {
                    onCloseModal(true, "Added");
                    setIsLoading(false);
                } else {
                    setFailure(response);
                    setIsLoading(false);
                }
            } catch (err: any) {
                setFailure(err);
            }
        } else {
            try {
                let response = await UpdateNetworkCompany(networkCompanyObj);
                if (response?.data === true) {
                    onCloseModal(true, "Updated");
                    setIsLoading(false);
                } else {
                    setFailure(response);
                    setIsLoading(false);
                }
            } catch (err: any) {
                setFailure(err);
            }
        }
    };
    const onCloseModal = (isSuccess: boolean, message: string) => {
        dismissPanel(isSuccess, message);
        setIsLoading(false);
    };

    const deleteNetworkCompany = async () => {
        if (networkCompanyObj.isPrimary === true) {
            setFailure(
                "Company cannot be deleted as this is a Primary Company!"
            );
        } else {
            try {
                let response = await DeleteNetworkcompany(
                    networkCompanyObj?.networkCompanyId
                );
                if (response?.data === true) {
                    onCloseModal(true, "Deleted");
                    setIsLoading(false);
                } else {
                    setFailure(response);
                    setIsLoading(false);
                }
            } catch (err: any) {
                setFailure(err);
            }
        }
    };

    const _onChange = (
        ev: React.MouseEvent<HTMLElement>,
        checked?: boolean
    ) => {
        if (checked) {
            setNetworkCompanyObj((preState: INetworkCompany) => ({
                ...preState,
                isPrimary: true,
            }));
        } else {
            setNetworkCompanyObj((preState: INetworkCompany) => ({
                ...preState,
                isPrimary: false,
            }));
        }
        setIsEdited(true);
    };

    const validateInput = () => {
        if (
            networkCompanyObj &&
            networkCompanyObj?.companyName?.trim().length > 0 &&
            networkCompanyObj?.companyAddressLine1?.trim().length > 0 &&
            networkCompanyObj?.city?.trim().length > 0 &&
            networkCompanyObj?.state?.trim().length > 0 &&
            networkCompanyObj?.country?.trim().length > 0 &&
            networkCompanyObj?.contactNumber?.trim().length > 0 &&
            !validateContactNumber(networkCompanyObj?.contactNumber)
        )
            return false;
        else {
            return true;
        }
    };

    return (
        <StyledModal
            title={
                networkCompanyObj?.networkCompanyId
                    ? "Edit Network Company"
                    : "New Network Company"
            }
            size={ModalSize.Large}
            isOpen={true}
            onDismiss={() => onCloseModal(false, "")}
            errorMessageBar={failure}
            isLoading={isLoading}
            setErrorMessageBar={setFailure}
        >
            <Stack>
                <Stack horizontal>
                    <StackItem style={{ width: "15%" }}>
                        <StyledLabel text="Company Name  " isMandatory={true} />
                    </StackItem>
                    <StackItem style={{ marginTop: "10px" }}>
                        <TextField
                            styles={inlineInputStyle}
                            value={networkCompanyObj?.companyName}
                            maxLength={40}
                            onChange={(e: any) => {
                                let value = e.target.value;
                                value = value.replace(/[^a-zA-Z0-9 ]/gi, "");
                                onInput("companyName", value);
                            }}
                            onGetErrorMessage={(value: string) => {
                                if (value.trim().length === 0) {
                                    return "Required";
                                } else {
                                    return "";
                                }
                            }}
                            validateOnFocusOut
                            validateOnLoad={false}
                        />
                    </StackItem>
                </Stack>
                <Stack horizontal>
                    <StackItem style={{ width: "15%" }}>
                        <StyledLabel
                            text="Address Line 1  "
                            isMandatory={true}
                        />
                    </StackItem>
                    <StackItem style={{ marginTop: "10px" }}>
                        <TextField
                            styles={inlineInputStyle}
                            value={networkCompanyObj?.companyAddressLine1}
                            onChange={(e: any) => {
                                onInput("companyAddressLine1", e?.target.value);
                            }}
                            onGetErrorMessage={(value: string) => {
                                if (value.trim().length === 0) {
                                    return "Required";
                                } else {
                                    return "";
                                }
                            }}
                            validateOnFocusOut
                            validateOnLoad={false}
                        />
                    </StackItem>
                </Stack>
                <Stack horizontal>
                    <StackItem style={{ width: "15%" }}>
                        <StyledLabel
                            text="Address Line 2  "
                            isMandatory={false}
                        />
                    </StackItem>
                    <StackItem style={{ marginTop: "10px" }}>
                        <TextField
                            styles={inlineInputStyle}
                            value={networkCompanyObj?.companyAddressLine2}
                            onChange={(e: any) => {
                                onInput("companyAddressLine2", e?.target.value);
                            }}
                        />
                    </StackItem>
                </Stack>
                <Stack horizontal>
                    <StackItem style={{ width: "15%" }}>
                        <StyledLabel text="City  " isMandatory={true} />
                    </StackItem>
                    <StackItem style={{ marginTop: "10px" }}>
                        <TextField
                            styles={inlineInputStyle}
                            value={networkCompanyObj?.city}
                            onChange={(e: any) => {
                                let value = e.target.value;
                                value = value.replace(/[^A-Za-z\s]/gi, "");
                                onInput("city", value);
                            }}
                            onGetErrorMessage={(value: string) => {
                                if (value.trim().length === 0) {
                                    return "Required";
                                } else {
                                    return "";
                                }
                            }}
                            validateOnFocusOut
                            validateOnLoad={false}
                        />
                    </StackItem>
                </Stack>
                <Stack horizontal>
                    <StackItem style={{ width: "15%" }}>
                        <StyledLabel text="State  " isMandatory={true} />
                    </StackItem>
                    <StackItem style={{ marginTop: "10px" }}>
                        <TextField
                            styles={inlineInputStyle}
                            value={networkCompanyObj?.state}
                            onChange={(e: any) => {
                                let value = e.target.value;
                                value = value.replace(/[^A-Za-z\s]/gi, "");
                                onInput("state", value);
                            }}
                            onGetErrorMessage={(value: string) => {
                                if (value.trim().length === 0) {
                                    return "Required";
                                } else {
                                    return "";
                                }
                            }}
                            validateOnFocusOut
                            validateOnLoad={false}
                        />
                    </StackItem>
                </Stack>
                <Stack horizontal>
                    <StackItem style={{ width: "15%" }}>
                        <StyledLabel text="Country  " isMandatory={true} />
                    </StackItem>
                    <StackItem style={{ marginTop: "10px" }}>
                        <TextField
                            styles={inlineInputStyle}
                            value={networkCompanyObj?.country}
                            onChange={(e: any) => {
                                let value = e.target.value;
                                value = value.replace(/[^A-Za-z\s]/gi, "");
                                onInput("country", value);
                            }}
                            onGetErrorMessage={(value: string) => {
                                if (value.trim().length === 0) {
                                    return "Required";
                                } else {
                                    return "";
                                }
                            }}
                            validateOnFocusOut
                            validateOnLoad={false}
                        />
                    </StackItem>
                </Stack>
                <Stack horizontal>
                    <StackItem style={{ width: "15%" }}>
                        <StyledLabel
                            text="Contact Number  "
                            isMandatory={true}
                        />
                    </StackItem>
                    <StackItem style={{ marginTop: "10px" }}>
                        <TextField
                            styles={inlineInputStyle}
                            value={networkCompanyObj?.contactNumber}
                            maxLength={10}
                            onChange={(e: any) => {
                                let value = e.target.value;
                                value = value.replace(/[^0-9]/gi, "");
                                onInput("contactNumber", value);
                            }}
                            onGetErrorMessage={validateContactNumber}
                            validateOnFocusOut
                            validateOnLoad={false}
                        />
                    </StackItem>
                </Stack>
                <Stack horizontal>
                    <StackItem style={{ width: "15%", marginTop: "6px" }}>
                        <StyledLabel text="Is Primary?  " isMandatory={false} />
                    </StackItem>
                    <StackItem
                        style={{ marginTop: "25px", marginLeft: "20px" }}
                    >
                        <Toggle
                            onText="Yes"
                            offText="No"
                            checked={networkCompanyObj?.isPrimary}
                            onChange={_onChange}
                        />
                    </StackItem>
                </Stack>
            </Stack>
            <StyleModalFooter>
                <Stack horizontalAlign="start">
                    {networkCompanySelected?.companyName?.trim().length > 0 && (
                        <IconButton
                            styles={deleteIconStyles}
                            iconProps={deleteIcon}
                            ariaLabel="Delete"
                            onClick={deleteNetworkCompany}
                            title="delete request"
                        />
                    )}
                </Stack>
                <Stack horizontal horizontalAlign="end">
                    <Stack horizontal>
                        <DefaultButton
                            styles={buttonStyles}
                            onClick={() => onCloseModal(false, "")}
                            text="Cancel"
                        />
                        <PrimaryButton
                            onClick={() => submitData()}
                            text="Submit"
                            disabled={isLoading || validateInput() || !isEdited}
                        />
                    </Stack>
                </Stack>
            </StyleModalFooter>
        </StyledModal>
    );
};
export default NetworkCompanyModal;

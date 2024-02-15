import { useEffect, useState } from "react";

import {
    Checkbox,
    DefaultButton,
    IIconProps,
    IconButton,
    PrimaryButton,
    Stack,
    StackItem,
    TextField,
} from "@fluentui/react";

import {
    AddManufacturer,
    DeleteManufacturer,
    UpdateManufacturer,
} from "../../services/manufacturerService";

import StyledModal, {
    ModalSize,
    StyleModalFooter,
} from "../common/StyledModal";
import StyledLabel from "../common/StyledLabel";

import { IManufacturer } from "../../types/Manufacturer";
import { Action } from "../../pages/Master Data/ManufacturersPage";
import { theme } from "../asset-requests/ViewAssetStyle";

interface modalProps {
    isModalOpen: boolean;
    dismissModal: (action?: string) => void;
    selectedManufacturer: IManufacturer | undefined;
}

const defaultManufacturer: IManufacturer = {
    manufacturerName: "",
    preferredManufacturer: false,
    active: true,
};

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

const specialCharacterRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/;

const ManufacturerModal = (props: modalProps) => {
    const { isModalOpen, dismissModal, selectedManufacturer } = props;

    const [errorMessage, setErrorMessage] = useState<string>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [manufacturer, setManufacturer] =
        useState<IManufacturer>(defaultManufacturer);

    const modalTitle = manufacturer.manfacturerId
        ? "Edit Manufacturer"
        : "New Manufacturer";
    const buttonStyles = { root: { marginRight: 10 } };

    const changeHandler = (
        field: string,
        value: boolean | string | undefined
    ) => {
        const newValue: any = { ...manufacturer, [field]: value };
        setManufacturer(newValue);
    };

    const submitData = async () => {
        if (specialCharacterRegex.test(manufacturer.manufacturerName)) {
            return false;
        }
        setIsLoading(true);
        let data: IManufacturer = {
            ...manufacturer,
            manufacturerName: manufacturer.manufacturerName
                .trim()
                .replace(/\s+/g, " "),
        };

        if (manufacturer.manfacturerId) {
            const response = await UpdateManufacturer(data);
            if (response?.data === true) {
                dismissModal(Action.UPDATE);
            } else {
                setErrorMessage(response);
            }
        } else {
            const response = await AddManufacturer(data);
            if (response?.data === true) {
                dismissModal(Action.ADD);
            } else {
                setErrorMessage(response);
            }
        }
        setIsLoading(false);
    };

    useEffect(() => {
        selectedManufacturer && setManufacturer(selectedManufacturer);
    }, [selectedManufacturer]);

    const deleteManufacturer = async () => {
        setIsLoading(true);
        try {
            var response = await DeleteManufacturer(
                manufacturer?.manfacturerId as string
            );

            if (response.data) {
                dismissModal(Action.DELETE);
                setIsLoading(false);
            } else {
                dismissModal(Action.DELETEEXISTING);
                setIsLoading(false);
            }
        } catch (e) {
            setErrorMessage(e as string);
            setIsLoading(false);
        }
    };

    return (
        <StyledModal
            isOpen={isModalOpen}
            onDismiss={() => dismissModal()}
            title={modalTitle}
            size={ModalSize.Small}
            errorMessageBar={errorMessage}
            setErrorMessageBar={() => setErrorMessage("")}
        >
            <Stack horizontal>
                <StackItem style={{ width: "25%" }}>
                    <StyledLabel
                        text={"Manufacturer Name : "}
                        isMandatory={true}
                    />
                </StackItem>
                <StackItem style={{ marginTop: "15px", width: "40%" }}>
                    <TextField
                        value={manufacturer?.manufacturerName}
                        maxLength={40}
                        onChange={(e, value) =>
                            changeHandler("manufacturerName", value)
                        }
                        onGetErrorMessage={(value: string) => {
                            if (value.trim().length === 0) {
                                return "Required";
                            } else if (specialCharacterRegex.test(value)) {
                                return "Invalid characters";
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
                <StackItem style={{ width: "25%" }}>
                    <StyledLabel
                        text={"Preferred Manufacturer : "}
                        isMandatory={false}
                    />
                </StackItem>
                <StackItem style={{ marginTop: "20px" }}>
                    <Checkbox
                        checked={manufacturer.preferredManufacturer}
                        onChange={(e, value) =>
                            changeHandler("preferredManufacturer", value)
                        }
                    />
                </StackItem>
            </Stack>
            <Stack horizontal>
                <StackItem style={{ width: "25%" }}>
                    <StyledLabel text={"Active : "} isMandatory={false} />
                </StackItem>
                <StackItem style={{ marginTop: "20px" }}>
                    <Checkbox
                        checked={manufacturer.active}
                        onChange={(e, value) => changeHandler("active", value)}
                    />
                </StackItem>
            </Stack>
            <StyleModalFooter>
                <Stack horizontal horizontalAlign="space-between">
                    <Stack horizontalAlign="start">
                        {manufacturer.manfacturerId ? (
                            <IconButton
                                styles={deleteIconStyles}
                                iconProps={deleteIcon}
                                ariaLabel="Delete"
                                onClick={deleteManufacturer}
                                title="Delete vendor"
                            />
                        ) : null}
                    </Stack>
                    <Stack horizontal horizontalAlign="end">
                        <DefaultButton
                            text="Cancel"
                            styles={buttonStyles}
                            onClick={() => dismissModal()}
                        />
                        <PrimaryButton
                            text="Submit"
                            disabled={
                                manufacturer
                                    ? manufacturer.manufacturerName.trim() ===
                                          "" ||
                                      isLoading ||
                                      JSON.stringify(manufacturer) ===
                                          JSON.stringify(selectedManufacturer)
                                    : true
                            }
                            onClick={submitData}
                        />
                    </Stack>
                </Stack>
            </StyleModalFooter>
        </StyledModal>
    );
};

export default ManufacturerModal;

import * as React from "react";
import { useState, useEffect } from "react";
import StyledModal, {
    ModalSize,
    StyleModalFooter,
} from "../common/StyledModal";
import { ICategory, ICategoryModal } from "../../types/Category";
import {
    AddCategory,
    UpdateCategory,
    DeleteCategory,
} from "../../services/categoryService";
import {
    Checkbox,
    StackItem,
    Stack,
    TextField,
    DefaultButton,
    PrimaryButton,
    IconButton,
    IIconProps,
    getTheme,
} from "@fluentui/react";

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

const checkBoxStyle = {
    root: {
        label: {
            span: { fontSize: "14px", fontWeight: "600" },
            display: "flex",
            flexDirection: "column-reverse",
            justifyContent: "space-between",
            alignItems: "center",
            height: "52px",
            paddingTop: "5px",
        },
    },
};

const buttonStyles = { root: { marginRight: 10 } };

const CategoryModal: React.FunctionComponent<ICategoryModal> = (props) => {
    const { categorySelected, dismissPanel } = props;

    const [categoryObj, setCategoryObj] = useState<ICategory>();
    const [isLoading, setIsLoading] = useState(false);
    const [isEdited, setIsEdited] = useState(false);
    const [failure, setFailure] = useState<string>();

    useEffect(() => {
        setCategoryObj(categorySelected);
        if (JSON.stringify(categorySelected) === "{}") {
            let tempObj: any = categorySelected;
            tempObj = { ...tempObj, active: true };
            setCategoryObj(tempObj);
        }
    }, [categorySelected]);

    const onInput = (type: string, value: any) => {
        let tempObj: any = {};
        if (categoryObj) {
            tempObj = categoryObj;
        }
        tempObj = { ...tempObj, [type]: value };
        setCategoryObj(tempObj);
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

        if (categoryObj?.categoryName) {
            categoryObj.categoryName = capitalizeText(
                categoryObj?.categoryName.trim()
            );
        }

        if (Object.keys(categorySelected).length === 0) {
            try {
                let response = await AddCategory(categoryObj);
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
                let response = await UpdateCategory(categoryObj);
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

    const deleteCategoryDetails = async () => {
        try {
            let response = await DeleteCategory(categoryObj?.categoryId);
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
    };

    return (
        <StyledModal
            title={categoryObj?.categoryId ? "Edit Category" : "New Category"}
            size={ModalSize.Line}
            isOpen={true}
            onDismiss={() => onCloseModal(false, "")}
            errorMessageBar={failure}
            setErrorMessageBar={setFailure}
        >
            <Stack horizontal horizontalAlign="space-between">
                <StackItem>
                    <TextField
                        label="Category"
                        required
                        value={categoryObj?.categoryName}
                        maxLength={20}
                        onChange={(e: any) => {
                            onInput("categoryName", e?.target.value);
                        }}
                        onGetErrorMessage={(value: string) => {
                            var categoryRegex = /^[a-zA-Z0-9 _-]*$/;
                            if (value.trim().length === 0) {
                                return "Required";
                            } else {
                                if (categoryRegex.test(value)) {
                                    return "";
                                } else {
                                    return "Invalid Category Name";
                                }
                            }
                        }}
                        validateOnFocusOut
                        validateOnLoad={false}
                    />
                </StackItem>
                <StackItem>
                    <Checkbox
                        styles={checkBoxStyle}
                        label="Issuable"
                        checked={categoryObj?.issuable}
                        onChange={(e: any) => {
                            onInput("issuable", e?.target.checked);
                        }}
                    />
                </StackItem>
                <StackItem>
                    <Checkbox
                        styles={checkBoxStyle}
                        label="Asset Tag Required"
                        checked={categoryObj?.assetTagRequired}
                        onChange={(e: any) => {
                            onInput("assetTagRequired", e?.target.checked);
                        }}
                    />
                </StackItem>
                <StackItem>
                    <Checkbox
                        styles={checkBoxStyle}
                        label="Serial Number Required"
                        checked={categoryObj?.serialNumberRequired}
                        onChange={(e: any) => {
                            onInput("serialNumberRequired", e?.target.checked);
                        }}
                    />
                </StackItem>
                <StackItem>
                    <Checkbox
                        styles={checkBoxStyle}
                        label="Warranty Date Required"
                        checked={categoryObj?.warrantyRequired}
                        onChange={(e: any) => {
                            onInput("warrantyRequired", e?.target.checked);
                        }}
                    />
                </StackItem>

                <StackItem>
                    <TextField
                        label="Unit of Measurement"
                        value={categoryObj?.unitOfMeasurement}
                        maxLength={20}
                        onChange={(e: any) => {
                            let value = e.target.value;
                            value = value.replace(/[^A-Za-z]/gi, "");
                            onInput("unitOfMeasurement", value);
                        }}
                        required
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
                <StackItem>
                    <Checkbox
                        styles={checkBoxStyle}
                        label="Active"
                        checked={categoryObj?.active}
                        onChange={(e: any) => {
                            onInput("active", e?.target.checked);
                        }}
                    />
                </StackItem>
            </Stack>
            <StyleModalFooter>
                <Stack horizontalAlign="start">
                    {categorySelected?.categoryName?.trim().length > 0 && (
                        <IconButton
                            styles={deleteIconStyles}
                            iconProps={deleteIcon}
                            ariaLabel="Delete"
                            onClick={deleteCategoryDetails}
                            title="delete request"
                        />
                    )}
                </Stack>
                <Stack horizontal horizontalAlign="end">
                    <DefaultButton
                        styles={buttonStyles}
                        onClick={() => onCloseModal(false, "")}
                        text="Cancel"
                    />
                    <PrimaryButton
                        onClick={() => submitData()}
                        text="Submit"
                        disabled={
                            isLoading ||
                            !(
                                categoryObj &&
                                categoryObj?.categoryName?.trim().length > 0 &&
                                categoryObj?.unitOfMeasurement?.trim().length >
                                    0 &&
                                /^[a-zA-Z0-9 _-]*$/.test(
                                    categoryObj.categoryName
                                )
                            ) ||
                            !isEdited
                        }
                    />
                </Stack>
            </StyleModalFooter>
        </StyledModal>
    );
};

export default CategoryModal;

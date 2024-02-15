import * as React from "react";
import { useState, useEffect } from "react";
import StyledModal, {
    ModalSize,
    StyleModalFooter,
} from "../common/StyledModal";
import { ISource, ISourceModal } from "../../types/Source";
import {
    AddSource,
    UpdateSource,
    DeleteSource,
} from "../../services/sourceService";
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
import StyledLabel from "../common/StyledLabel";

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
        margin: "2px 0px 0px 20px",
        height: "52px",
        paddingTop: "8px",
    },
};

const buttonStyles = { root: { marginRight: 10 } };

const inlineInputStyle = {
    root: {
        margin: "2px 0px 0px 20px",
        width: "400px",
    },
};

const SourceModal: React.FunctionComponent<ISourceModal> = (props) => {
    const { sourceSelected, dismissPanel } = props;

    const [sourceObj, setSourceObj] = useState<ISource>();
    const [isLoading, setIsLoading] = useState(false);
    const [isEdited, setIsEdited] = useState(false);
    const [failure, setFailure] = useState<string>();

    useEffect(() => {
        setSourceObj(sourceSelected);
        if (JSON.stringify(sourceSelected) === "{}") {
            let tempObj: any = sourceSelected;
            tempObj = { ...tempObj, active: true };
            setSourceObj(tempObj);
        }
    }, [sourceSelected]);

    const onInput = (type: string, value: any) => {
        let tempObj: any = {};
        if (sourceObj) {
            tempObj = sourceObj;
        }
        tempObj = { ...tempObj, [type]: value };
        setSourceObj(tempObj);
        setIsEdited(true);
    };

    const submitData = async () => {
        setIsLoading(true);
        if (sourceObj?.sourceName.trim().length === 0) {
            setFailure("Source Name field cannot be empty");
        } else {
            if (Object.keys(sourceSelected).length === 0) {
                try {
                    let response = await AddSource(sourceObj);
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
                    let response = await UpdateSource(sourceObj);
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
        }
    };

    const onCloseModal = (isSuccess: boolean, message: string) => {
        dismissPanel(isSuccess, message);
        setIsLoading(false);
    };

    const deleteSourceDetails = async () => {
        try {
            let response = await DeleteSource(sourceObj?.sourceId);
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
            title={sourceObj?.sourceId ? "Edit Source" : "New Source"}
            size={ModalSize.Small}
            isOpen={true}
            onDismiss={() => onCloseModal(false, "")}
            errorMessageBar={failure}
            setErrorMessageBar={setFailure}
        >
            <Stack>
                <Stack horizontal>
                    <StackItem style={{ width: "20%" }}>
                        <StyledLabel text="Source Name  :" isMandatory={true} />
                    </StackItem>
                    <StackItem style={{ marginTop: "10px" }}>
                        <TextField
                            styles={inlineInputStyle}
                            value={sourceObj?.sourceName}
                            maxLength={40}
                            onChange={(e: any) => {
                                let value = e.target.value;
                                value = value.replace(/[^a-zA-Z0-9 ]/gi, "");
                                onInput("sourceName", value);
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
                    <StackItem style={{ width: "20%" }}>
                        <StyledLabel text="Active?  :" isMandatory={false} />
                    </StackItem>
                    <StackItem style={{ marginTop: "10px" }}>
                        <Checkbox
                            styles={checkBoxStyle}
                            checked={sourceObj?.active}
                            onChange={(e: any) => {
                                onInput("active", e?.target.checked);
                            }}
                        />
                    </StackItem>
                </Stack>
            </Stack>
            <StyleModalFooter>
                <Stack horizontalAlign="start">
                    {sourceSelected?.sourceName?.trim().length > 0 && (
                        <IconButton
                            styles={deleteIconStyles}
                            iconProps={deleteIcon}
                            ariaLabel="Delete"
                            onClick={deleteSourceDetails}
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
                                sourceObj &&
                                sourceObj?.sourceName?.trim().length > 0
                            ) ||
                            !isEdited ||
                            JSON.stringify(sourceObj) ===
                                JSON.stringify(sourceSelected)
                        }
                    />
                </Stack>
            </StyleModalFooter>
        </StyledModal>
    );
};

export default SourceModal;

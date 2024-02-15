import {
    DefaultButton,
    IconButton,
    IIconProps,
    PrimaryButton,
    Stack,
    TextField,
} from "@fluentui/react";
import { useBoolean, useId } from "@fluentui/react-hooks";
import { Dispatch, SetStateAction, useState } from "react";

import StyledCallout from "../../../components/common/StyledCallout";

import { ProcurementStatus } from "../../../constants/ProcurementStatus";

import { IQuoteVendors } from "../../../types/Procurement";
import { UpdateRequestStatus } from "../../../services/procurementService";

interface IProcurementModalFooterProps {
    toggleDeleteDialog: () => void;
    toggleRequestDialog: () => void;
    submitData: (action?: boolean) => void;
    isReadOnly: boolean;
    needsRefresh?: boolean;
    vendorQuoteUploadDetails?: IQuoteVendors[];
}

interface IApprovalFooterProps {
    selectedProcurementStatus?: string;
    procurementRequestId?: string;
    comments?: string;
    closeRefresh: (string: string) => void;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
    setIsModalVisible: () => void;
    setFailure: (message: string) => void;
    onModalClose?: () => void;
}

const infoIcon: IIconProps = { iconName: "Info" };

export const ProcuremenModalFooter = (
    props: IApprovalFooterProps & IProcurementModalFooterProps
) => {
    const {
        selectedProcurementStatus,
        procurementRequestId,
        isReadOnly,
        needsRefresh,
        closeRefresh,
        setIsModalVisible,
        submitData,
        toggleDeleteDialog,
        toggleRequestDialog,
        onModalClose,
    } = props;

    const [isCalloutVisible, { toggle: toggleIsCalloutVisible }] =
        useBoolean(false);
    const buttonId = useId("callout-button");

    let requestForQuoteApproval = "";
    let calloutContent = "";
    if (
        selectedProcurementStatus === ProcurementStatus.Submitted ||
        !selectedProcurementStatus
    ) {
        requestForQuoteApproval = "Request for quote";
        calloutContent =
            "After saving data, system will send an email to vendors for quote with above requirements";
    } else if (selectedProcurementStatus === ProcurementStatus.Generated) {
        requestForQuoteApproval = "Request for approval";
        calloutContent =
            "Seek approval from approver group for the selected vendors and their quote";
    }

    const cancelHandler = () => {
        if (needsRefresh) {
            closeRefresh("");
        } else {
            setIsModalVisible();
        }
    };

    const requestHandler = () => {
        if (
            !selectedProcurementStatus ||
            selectedProcurementStatus === ProcurementStatus.Submitted
        )
            toggleRequestDialog();
        else if (selectedProcurementStatus === ProcurementStatus.Generated)
            submitData(true);
    };

    if (isReadOnly) {
        return (
            <Stack>
                <Stack.Item align="end">
                    <DefaultButton
                        text="Back"
                        onClick={() => {
                            setIsModalVisible();
                            onModalClose && onModalClose();
                        }}
                    />
                </Stack.Item>
            </Stack>
        );
    }

    return (
        <Stack horizontal horizontalAlign="space-between">
            <Stack.Item>
                {requestForQuoteApproval?.length > 0 && (
                    <>
                        <IconButton
                            iconProps={infoIcon}
                            id={buttonId}
                            onClick={toggleIsCalloutVisible}
                        />
                        <PrimaryButton
                            text={requestForQuoteApproval}
                            onClick={requestHandler}
                        />
                        <StyledCallout
                            buttonId={buttonId}
                            isCalloutVisible={isCalloutVisible}
                            toggleIsCalloutVisible={toggleIsCalloutVisible}
                            title={requestForQuoteApproval}
                        >
                            {calloutContent}
                        </StyledCallout>
                    </>
                )}
            </Stack.Item>
            <Stack tokens={{ childrenGap: 10 }} horizontal>
                {procurementRequestId && (
                    <DefaultButton
                        iconProps={{
                            iconName: "delete",
                            styles: { root: { color: "red" } },
                        }}
                        text="Delete"
                        onClick={toggleDeleteDialog}
                    />
                )}
                <DefaultButton
                    text="Cancel"
                    onClick={() => {
                        cancelHandler();
                        onModalClose && onModalClose();
                    }}
                />
                <PrimaryButton text="Submit" onClick={() => submitData()} />
            </Stack>
        </Stack>
    );
};

const inlineInputStyleFooter = {
    root: {
        label: { whiteSpace: "nowrap", padding: "16px 16px 16px 0" },
    },
    fieldGroup: { width: "80%" },
    wrapper: { display: "flex" },
};

export const ApprovaFooter = (props: IApprovalFooterProps) => {
    const {
        selectedProcurementStatus,
        procurementRequestId,
        comments,
        setIsModalVisible,
        closeRefresh,
        setIsLoading,
        setFailure,
    } = props;

    const [commentNote, setCommentNote] = useState<string | undefined>(
        comments
    );

    const isApprovalRequired =
        selectedProcurementStatus === ProcurementStatus["Pending Approval"];

    const approveRejectHandler = async (isApproved: boolean) => {
        if (procurementRequestId) {
            setIsLoading((prevState: boolean) => true);
            await UpdateRequestStatus(
                procurementRequestId,
                undefined,
                isApproved,
                commentNote ? commentNote : ""
            )
                .then((res) => {
                    if (res === true) {
                        closeRefresh(
                            `Succesfully ${
                                isApproved ? "approved" : "rejected"
                            }`
                        );
                    } else {
                        setFailure("Something went wrong");
                    }
                })
                .catch((err) => setFailure(err));
            setIsLoading((prevState: boolean) => false);
        }
    };

    return (
        <Stack horizontal horizontalAlign="space-between">
            <Stack.Item style={{ width: "50%" }}>
                <TextField
                    label="Comments"
                    styles={inlineInputStyleFooter}
                    multiline
                    resizable={false}
                    value={commentNote}
                    onChange={(e, value?: string) => {
                        setCommentNote(value);
                    }}
                    description={
                        isApprovalRequired
                            ? "Comments required on reject"
                            : undefined
                    }
                    readOnly={!isApprovalRequired}
                />
            </Stack.Item>
            <Stack
                horizontal
                tokens={{ childrenGap: 10 }}
                verticalAlign="center"
            >
                {isApprovalRequired ? (
                    <>
                        <DefaultButton
                            text="Reject"
                            onClick={() => approveRejectHandler(false)}
                            disabled={
                                !commentNote || commentNote.trim().length === 0
                            }
                        />
                        <PrimaryButton
                            text="Approve"
                            onClick={() => approveRejectHandler(true)}
                        />
                    </>
                ) : (
                    <Stack.Item align="end">
                        <DefaultButton
                            text="Back"
                            onClick={setIsModalVisible}
                        />
                    </Stack.Item>
                )}
            </Stack>
        </Stack>
    );
};

//React
import * as React from "react";
import { useEffect, useState } from "react";

//UI
import {
    DefaultButton,
    PrimaryButton,
    Stack,
    StackItem,
    TextField,
} from "@fluentui/react";

import { reviewAssetRequest } from "../../services/requestService";
import { GetAllNetworkCompanies } from "../../services/networkCompanyService";

import { AssetPriority } from "../../constants/AssetPriority";
import StyledModal, {
    ModalSize,
    StyleModalFooter,
} from "../../components/common/StyledModal";
import SearchableSelect, { Option } from "../common/searchableSelect";

import { buttonStyles, contentStyles, textFieldStyle } from "./ViewAssetStyle";

import {
    NetworkCompanyOption,
    NetworkCompanyOptionTwo,
} from "../../types/NetworkCompany";
import { AssetRequestStatus } from "../../constants/AssetRequestStatus";
import { UserRequest } from "../../pages/Approvals/UserRequestTypes";

type AssetRequestType = {
    selectedRequest: UserRequest | undefined;
    openModal: boolean;
    dismissModal: (isSuccess?: boolean, review?: boolean) => void;
};

const ViewAssetModal: React.FunctionComponent<AssetRequestType> = (props) => {
    const { selectedRequest, openModal, dismissModal } = props;

    const [networkCompany, setNetworkCompany] = useState<
        NetworkCompanyOptionTwo[] | null
    >();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [editedRequest, setEditedRequest] = useState<
        UserRequest | undefined
    >();
    const [isReadOnly, setIsReadOnly] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>();

    useEffect(() => {
        if (openModal) {
            AllNetworkCompanies();
            setIsReadOnly(
                selectedRequest?.status !== AssetRequestStatus.Submitted
            );
            setEditedRequest(selectedRequest);
        }
    }, [openModal, selectedRequest]);

    const closeModal = (isSuccess?: boolean, review?: boolean) => {
        setEditedRequest(selectedRequest);
        dismissModal(isSuccess, review);
    };

    const reviewRequest = async (
        review: boolean,
        editedRequest: UserRequest | undefined
    ) => {
        setIsLoading(true);
        try {
            let response =
                editedRequest &&
                (await reviewAssetRequest(
                    editedRequest?.purchaseRequestNumber,
                    review,
                    editedRequest
                ));

            if (response) {
                setIsLoading(false);
                closeModal(true, review);
            }
        } catch (err: any) {
            setIsLoading(false);
            setErrorMessage(err);
        }
    };

    const AllNetworkCompanies = React.useCallback(async () => {
        setIsLoading(true);
        await GetAllNetworkCompanies()
            .then((res) => {
                setIsLoading(false);
                const mappedOptions = res.map((e: NetworkCompanyOption) => ({
                    label: e.text,
                    value: e.key,
                }));
                setNetworkCompany(mappedOptions);
            })
            .catch((err) => {
                setNetworkCompany([]);
                setIsLoading(false);
            });
    }, []);

    const handleNetworkCompanyChange = (item: Option | null): void => {
        item &&
            setEditedRequest(
                (prevState: UserRequest | undefined) =>
                    prevState && {
                        ...prevState,
                        networkCompanyId: item.value,
                        networkCompanyName: item.label,
                    }
            );
    };

    const HandlePriorityChange = (item: Option | null): void => {
        item &&
            setEditedRequest(
                (preState: UserRequest | undefined) =>
                    preState && { ...preState, priority: item.value }
            );
    };
    const HandleCommentChange = (
        e: React.FormEvent<HTMLTextAreaElement | HTMLInputElement>,
        value: string | any
    ) => {
        setEditedRequest(
            (preState: UserRequest | undefined) =>
                preState && { ...preState, comments: value }
        );
    };

    return (
        <StyledModal
            title={
                selectedRequest?.purchaseRequestNumber
                    ? "Asset Request : " +
                      selectedRequest?.purchaseRequestNumber
                    : ""
            }
            isOpen={openModal}
            onDismiss={closeModal}
            size={ModalSize.Medium}
            isLoading={isLoading}
            setErrorMessageBar={() => setErrorMessage(undefined)}
            errorMessageBar={errorMessage}
        >
            <div className={contentStyles.body}>
                <StackItem style={{ width: 220, marginTop: 5 }}>
                    <SearchableSelect
                        name="Network Company"
                        placeholder="Select Network Company"
                        options={networkCompany ?? []}
                        onChange={handleNetworkCompanyChange}
                        value={
                            (editedRequest && {
                                value: editedRequest.networkCompanyId,
                                label: editedRequest.networkCompanyName,
                            }) ??
                            null
                        }
                        errorMessage={
                            !editedRequest?.networkCompanyId
                                ? "Network Company is required"
                                : ""
                        }
                        isRequired={!isReadOnly}
                        isDisabled={isReadOnly}
                    />
                </StackItem>
                <Stack.Item></Stack.Item>
                <StackItem style={{ width: 220, marginTop: 5 }}>
                    <SearchableSelect
                        name="Priority"
                        placeholder="Select Priority"
                        options={AssetPriority}
                        onChange={HandlePriorityChange}
                        value={
                            (editedRequest && {
                                value: editedRequest?.priority,
                                label: editedRequest?.priority,
                            }) ??
                            null
                        }
                        errorMessage={
                            !editedRequest?.priority
                                ? "Priority is required"
                                : ""
                        }
                        isRequired={!isReadOnly}
                        isDisabled={isReadOnly}
                    />
                </StackItem>
                <Stack.Item>
                    <TextField
                        label="Category"
                        value={selectedRequest?.categoryName}
                        readOnly={true}
                        styles={textFieldStyle}
                    />
                </Stack.Item>
                <StackItem>
                    <TextField
                        label="Justification / Purpose"
                        multiline
                        rows={3}
                        maxLength={2500}
                        readOnly={true}
                        value={selectedRequest?.purpose}
                    />
                </StackItem>
                <StackItem>
                    <TextField
                        label="Comments"
                        multiline
                        rows={3}
                        maxLength={2000}
                        required={!isReadOnly}
                        readOnly={isReadOnly}
                        onGetErrorMessage={(value: string) => {
                            if (value.trim().length === 0) {
                                return "Comments are required";
                            } else {
                                return "";
                            }
                        }}
                        validateOnFocusOut={!isReadOnly}
                        validateOnLoad={false}
                        value={editedRequest?.comments ?? ""}
                        onChange={HandleCommentChange}
                    />
                </StackItem>
            </div>
            <div>
                <StyleModalFooter>
                    <Stack horizontal>
                        <Stack
                            horizontal
                            styles={{
                                root: {
                                    marginBottom: 30,
                                    justifyContent: "flex-end",
                                    paddingRight: 20,
                                    width: "100%",
                                },
                            }}
                        >
                            {!isReadOnly && (
                                <>
                                    <DefaultButton
                                        styles={buttonStyles}
                                        onClick={() =>
                                            reviewRequest(false, editedRequest)
                                        }
                                        text="Reject"
                                        disabled={
                                            !(
                                                editedRequest?.comments ?? ""
                                            ).trim()
                                        }
                                    />
                                    <PrimaryButton
                                        styles={buttonStyles}
                                        onClick={() =>
                                            reviewRequest(true, editedRequest)
                                        }
                                        text="Approve"
                                        disabled={
                                            !(
                                                editedRequest?.comments ?? ""
                                            ).trim()
                                        }
                                    />
                                </>
                            )}
                            {isReadOnly && (
                                <>
                                    <DefaultButton
                                        styles={buttonStyles}
                                        onClick={() => closeModal()}
                                        text="Back"
                                    />
                                </>
                            )}
                        </Stack>
                    </Stack>
                </StyleModalFooter>
            </div>
        </StyledModal>
    );
};

export default ViewAssetModal;

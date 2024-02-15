//React
import * as React from "react";
import { FormEvent, useEffect, useState } from "react";

//UI Styles
import {
    DefaultButton,
    IconButton,
    IIconProps,
    PrimaryButton,
    Stack,
    StackItem,
    TextField,
} from "@fluentui/react";

//Services
import {
    createNewAssetRequest,
    deleteNewAssetRequest,
    updateNewAssetRequest,
} from "../../services/requestService";

//Components
import DashboardStyle from "./DashboardStyles";
import { GetAllCategoriesForListing } from "../../services/categoryService";
import { AssetPriority } from "../../constants/AssetPriority";
import { AssetRequestStatus } from "../../constants/AssetRequestStatus";
import StyledModal, {
    ModalSize,
    StyleModalFooter,
} from "../../components/common/StyledModal";
import SearchableSelect, {
    Option,
} from "../../components/common/searchableSelect";
import {
    NetworkCompanyOption,
    NetworkCompanyOptionTwo,
} from "../../types/NetworkCompany";
import { GetAllNetworkCompanies } from "../../services/networkCompanyService";

const deleteIcon: IIconProps = { iconName: "Delete" };

type UserRequestType = {
    setSuccessMessage: React.Dispatch<React.SetStateAction<string | undefined>>;
    requestNumber: string;
    isReadOnlyRequest: boolean;
    purpose: string | undefined;
    priority: string | number | undefined;
    category: string | undefined;
    networkCompanyId: string | null;
    comment: string;
    status: string | undefined;
    openModal: boolean;
    dismissModal: (value: boolean) => void;
};

const DashboardModal: React.FunctionComponent<UserRequestType> = (props) => {
    const {
        setSuccessMessage,
        requestNumber,
        isReadOnlyRequest,
        purpose,
        priority,
        category,
        networkCompanyId,
        comment,
        status,
        openModal,
        dismissModal,
    } = props;

    const [requestPurpose, setRequestPurpose] = useState<string | undefined>();
    const [selectedStatus, setSelectedStatus] = useState<string>();
    const [selectedRequestNumber, setSelectedRequestNumber] = useState<any>("");
    const [selectedComments, setSelectedComments] = useState<string>("");
    const [isEnableSubmit, setIsEnableSubmit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<any>();
    const [networkCompany, setNetworkCompany] = useState<
        NetworkCompanyOptionTwo[] | null
    >();
    const [selectedNetworkCompany, setSelectedNetworkCompany] =
        useState<NetworkCompanyOptionTwo | null>();
    const [selectedPriority, setSelectedPriority] = useState<any>();
    const [selectedCategory, setSelectedCategory] = useState<any>();
    const [errorMessage, setErrorMessage] = useState<string>();

    useEffect(() => {
        setSelectedRequestNumber(requestNumber);
        setRequestPurpose(purpose);
        setSelectedPriority(getSelectedPriority(priority));

        setSelectedComments(comment);
        setSelectedStatus(status);
        if (openModal === true) {
            GetAllCategoriesForListing()
                .then((res) => {
                    setCategories(res);
                    setSelectedCategory(getSelectedCategory(category, res));
                })
                .catch((err) => setCategories([]));
        }
    }, [
        category,
        comment,
        priority,
        purpose,
        requestNumber,
        status,
        openModal,
    ]);
    useEffect(() => {
        if (openModal) {
            AllNetworkCompanies();
        }
    }, [openModal]);

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
                const networkCompany = getSelectedNetworkCompany(
                    networkCompanyId,
                    mappedOptions
                );
                setSelectedNetworkCompany(networkCompany);
            })
            .catch((err) => {
                setNetworkCompany([]);
                setIsLoading(false);
            });
    }, [networkCompanyId]);

    const getSelectedCategory = (value: any, categories: Option[]) => {
        let selectedCategoryOption = categories.filter(
            (item: Option) => item.value === value
        );
        return selectedCategoryOption.length > 0
            ? selectedCategoryOption[0]
            : null;
    };

    const getSelectedPriority = (value: any) => {
        let selectedPriorityOption = AssetPriority.filter(
            (item: Option) => item.value === value
        );
        return selectedPriorityOption.length > 0
            ? selectedPriorityOption[0]
            : null;
    };

    const getSelectedNetworkCompany = (
        value: any,
        networkCompanies: Option[]
    ) => {
        let selectedNetworkCompanyOption = networkCompanies.find(
            (item) => item.value === value
        );
        return selectedNetworkCompanyOption ?? null;
    };

    const submitRequest = async () => {
        if (
            requestPurpose !== "" &&
            selectedPriority &&
            selectedCategory &&
            selectedNetworkCompany
        ) {
            if (selectedRequestNumber === "") {
                let obj = {
                    networkCompanyId: selectedNetworkCompany?.value,
                    priority: selectedPriority.value,
                    categoryId: selectedCategory.value,
                    purpose: requestPurpose,
                };
                try {
                    setIsLoading(true);
                    let response = await createNewAssetRequest(obj);
                    if (response) {
                        setIsLoading(false);
                        setIsEnableSubmit(false);
                        dismissModal(false);
                        setSuccessMessage("Saved successfully");
                        onCloseAssetRequest();
                    }
                } catch (err: any) {
                    setIsEnableSubmit(true);
                    setErrorMessage(err);
                    setIsLoading(false);
                }
            } else {
                let obj = {
                    networkCompanyID: selectedNetworkCompany?.value,
                    priority: selectedPriority.value,
                    categoryId: selectedCategory.value,
                    purpose: requestPurpose,
                    status: selectedStatus,
                };
                try {
                    setIsLoading(true);
                    let response = await updateNewAssetRequest(
                        selectedRequestNumber,
                        obj
                    );

                    if (response) {
                        setIsLoading(false);
                        setIsEnableSubmit(false);
                        setSuccessMessage("Saved successfully");
                        dismissModal(false);
                        onCloseAssetRequest();
                    }
                } catch (err: any) {
                    setIsEnableSubmit(true);
                    setErrorMessage(err);
                    setIsLoading(false);
                }
            }
        }
    };

    const handlePriorityChange = (item: Option | null): void => {
        setSelectedPriority(item);
        if (
            item &&
            requestPurpose &&
            selectedCategory &&
            selectedNetworkCompany
        ) {
            if (selectedRequestNumber !== "" && selectedPriority === item) {
                setIsEnableSubmit(false);
            } else {
                setIsEnableSubmit(true);
            }
        } else {
            setIsEnableSubmit(false);
        }
        item && setSelectedPriority(item);
    };

    const handleNetworkCompanyChange = (item: Option | null): void => {
        setSelectedNetworkCompany(item);
        if (item && requestPurpose && selectedPriority && selectedCategory) {
            if (
                selectedRequestNumber !== "" &&
                selectedNetworkCompany === item
            ) {
                setIsEnableSubmit(false);
            } else {
                setIsEnableSubmit(true);
            }
        } else {
            setIsEnableSubmit(false);
        }
        item && setSelectedNetworkCompany(item);
    };

    const handleCategoryChange = (item: Option | null): void => {
        if (
            item &&
            requestPurpose &&
            selectedPriority &&
            selectedNetworkCompany
        ) {
            if (selectedRequestNumber !== "" && selectedCategory === item) {
                setIsEnableSubmit(false);
            } else {
                setIsEnableSubmit(true);
            }
        } else {
            setIsEnableSubmit(false);
        }
        item && setSelectedCategory(item);
    };

    const handlePurposeChange = (
        e: FormEvent<HTMLTextAreaElement | HTMLInputElement>,
        value: string | undefined
    ) => {
        if (
            value &&
            value.length > 0 &&
            selectedCategory &&
            selectedPriority &&
            selectedNetworkCompany
        ) {
            if (
                selectedRequestNumber !== "" &&
                requestPurpose === value.trim()
            ) {
                setIsEnableSubmit(false);
            } else {
                setIsEnableSubmit(true);
            }
        } else {
            setIsEnableSubmit(false);
        }
        setRequestPurpose(value);
    };

    const deleteRequest = async () => {
        try {
            await deleteNewAssetRequest(selectedRequestNumber);
            setSuccessMessage("Request deleted");
            dismissModal(false);
            onCloseAssetRequest();
        } catch (err: any) {
            setErrorMessage(err);
        }
    };

    const onCloseAssetRequest = () => {
        setRequestPurpose(purpose);
        setSelectedCategory(category);
        setSelectedPriority(priority);
        setSelectedNetworkCompany(null);
        setIsEnableSubmit(false);
        setSelectedRequestNumber(requestNumber);
        setSelectedComments(comment);
        setIsLoading(false);
        setIsLoading(false);
        setErrorMessage("");
    };

    const onCloseModal = () => {
        dismissModal(true);
        onCloseAssetRequest();
    };

    return (
        <StyledModal
            title={
                selectedRequestNumber === ""
                    ? "New Asset Request"
                    : isReadOnlyRequest
                    ? "Asset Request : " + selectedRequestNumber
                    : "Edit Asset Request : " + selectedRequestNumber
            }
            isOpen={openModal}
            onDismiss={onCloseModal}
            isLoading={isLoading}
            size={ModalSize.Medium}
            setErrorMessageBar={() => setErrorMessage(undefined)}
            errorMessageBar={errorMessage}
        >
            <div className={DashboardStyle.contentStyles.body}>
                <StackItem style={{ width: 220, marginTop: 5 }}>
                    <SearchableSelect
                        name="Network Company"
                        placeholder="Network Company"
                        options={networkCompany ?? []}
                        onChange={handleNetworkCompanyChange}
                        errorMessage="Network Company is required"
                        value={selectedNetworkCompany ?? null}
                        isRequired={!isReadOnlyRequest}
                        isDisabled={isReadOnlyRequest}
                    />
                </StackItem>
                <StackItem style={{ width: 220, marginTop: 5 }}>
                    <SearchableSelect
                        name="Priority"
                        placeholder="Select Priority"
                        options={AssetPriority}
                        onChange={handlePriorityChange}
                        value={selectedPriority}
                        errorMessage="Priority is required"
                        isRequired={!isReadOnlyRequest}
                        isDisabled={isReadOnlyRequest}
                    />
                </StackItem>
                <StackItem style={{ width: 220, marginTop: 5 }}>
                    <SearchableSelect
                        name="Category"
                        placeholder="Select Category"
                        options={categories}
                        onChange={handleCategoryChange}
                        errorMessage="Category is required"
                        value={selectedCategory}
                        isRequired={!isReadOnlyRequest}
                        isDisabled={isReadOnlyRequest}
                    />
                </StackItem>
                <StackItem>
                    <TextField
                        label="Justification / Purpose"
                        multiline
                        rows={5}
                        maxLength={2500}
                        resizable={false}
                        required={!isReadOnlyRequest}
                        readOnly={isReadOnlyRequest}
                        onGetErrorMessage={(value: string) => {
                            if (value.trim().length === 0) {
                                return "The justification / purpose can not be empty";
                            } else {
                                return "";
                            }
                        }}
                        validateOnFocusOut
                        validateOnLoad={false}
                        value={requestPurpose}
                        onChange={handlePurposeChange}
                    />
                </StackItem>
                {isReadOnlyRequest && status !== AssetRequestStatus.Withdrawn && (
                    <StackItem>
                        <TextField
                            label="Comments"
                            multiline
                            value={selectedComments}
                            readOnly={true}
                            rows={5}
                            maxLength={2000}
                        />
                    </StackItem>
                )}
            </div>
            <div>
                <StyleModalFooter>
                    <Stack horizontal>
                        <Stack
                            horizontal
                            styles={{
                                root: {
                                    marginBottom: 30,
                                    justifyContent: "flex-start",
                                    paddingLeft: 20,
                                },
                            }}
                        >
                            {selectedRequestNumber !== "" &&
                                !isReadOnlyRequest && (
                                    <IconButton
                                        styles={DashboardStyle.deleteIconStyles}
                                        iconProps={deleteIcon}
                                        ariaLabel="Delete"
                                        onClick={deleteRequest}
                                        title="delete request"
                                    />
                                )}
                        </Stack>
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
                            {!isReadOnlyRequest && (
                                <>
                                    <DefaultButton
                                        styles={DashboardStyle.buttonStyles}
                                        onClick={onCloseModal}
                                        text="Cancel"
                                    />
                                    <PrimaryButton
                                        styles={DashboardStyle.buttonStyles}
                                        onClick={() => submitRequest()}
                                        text={"Submit"}
                                        disabled={
                                            !isEnableSubmit ||
                                            isLoading ||
                                            requestPurpose?.trim()?.length === 0
                                        }
                                    />
                                </>
                            )}
                            {isReadOnlyRequest && (
                                <>
                                    <DefaultButton
                                        styles={DashboardStyle.buttonStyles}
                                        onClick={onCloseModal}
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

export default DashboardModal;

import { useEffect, useState } from "react";

import {
    ChoiceGroup,
    DefaultButton,
    Dropdown,
    IChoiceGroupOption,
    IColumn,
    PrimaryButton,
    Separator,
    Stack,
    StackItem,
    TextField,
} from "@fluentui/react";
import StyledModal, {
    StyleModalFooter,
} from "../../components/common/StyledModal";
import DashboardStyle from "./DashboardStyles";
import StyledLabel from "../../components/common/StyledLabel";
import { validateContactNumber } from "../../Other/InputValidation";
import {
    IMaintenanceRequest,
    INewRequest,
} from "../../types/maintenanceRequest";
import { getIssuedAssetByUser } from "../../services/assetService";
import { convertDateToddMMMYYYFormat } from "../../Other/DateFormat";
import StyledDetailsList from "../../components/common/StyledDetailsList";
import React from "react";
import { createNewMaintenanceRequest } from "../../services/maintenanceRequestService";

interface IMaintenanceRequestInterface {
    isModalVisible: boolean;
    setIsModalVisible: () => void;
    closeRefresh: (string: string) => void;
}

const PRIORITY_OPTIONS = {
    Low: "Low",
    Medium: "Medium",
    High: "High",
};

const radioStyle = {
    label: {
        display: "inline",
        padding: "0 20px 0px 0px",
    },
    flexContainer: {
        columnGap: "1em",
        display: "inline-flex",
        flexDirection: "row",
        flexWrap: "wrap",
    },
};

const MaintenanceRequestModal = (props: IMaintenanceRequestInterface) => {
    const { isModalVisible, setIsModalVisible, closeRefresh } = props;

    const [assets, setAssets] = useState<IMaintenanceRequest[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [request, setRequest] = useState<INewRequest | any>();
    const [selectedItem, setSelectedItem] = useState("");
    const [failure, setFailure] = useState<string>();

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        setIsLoading(true);
        await getIssuedAssetByUser()
            .then((res) => {
                setAssets(res);
            })
            .catch((err) => setAssets([]));
        setIsLoading(false);
    };

    const changeHandler = React.useCallback(
        (field: string, value: any) => {
            setRequest((prevState: INewRequest) => ({
                ...prevState,
                [field]: value,
            }));
        },
        [setRequest]
    );

    const submitData = async () => {
        setIsLoading(true);
        try {
            let response = await createNewMaintenanceRequest(request);
            if (response) {
                closeRefresh("Submitted successfully");
            }
        } catch (err: any) {
            setFailure(err);
        }
        setIsLoading(false);
    };

    const validateInput = () => {
        if (
            request &&
            request?.priority &&
            request?.inventoryId &&
            request?.description?.length > 0 &&
            request?.address?.length > 0 &&
            !validateContactNumber(request?.phoneNumber)
        )
            return false;
        else {
            return true;
        }
    };

    const _columns: IColumn[] = [
        {
            key: "selectassets",
            name: "Select",
            fieldName: "selectassets",
            minWidth: 100,
            isResizable: true,
            onRender: (item: IMaintenanceRequest) => {
                const options: IChoiceGroupOption[] = [
                    { key: item.inventoryId, text: "" },
                ];
                return (
                    <ChoiceGroup
                        disabled={false}
                        options={options}
                        selectedKey={
                            selectedItem === item.inventoryId
                                ? item.inventoryId
                                : null
                        }
                        styles={radioStyle}
                        onChange={(e: any, option?: IChoiceGroupOption) => {
                            if (option && e?.target.checked) {
                                changeHandler("inventoryId", option.key);
                                setSelectedItem(option.key);
                            } else {
                                setSelectedItem("");
                            }
                        }}
                    />
                );
            },
        },
        {
            key: "categoryName",
            name: "Category",
            fieldName: "categoryName",
            minWidth: 100,
            isResizable: true,
        },
        {
            key: "manufacturerName",
            name: "Manufacturer",
            fieldName: "manufacturerName",
            minWidth: 100,
            isResizable: true,
        },
        {
            key: "assetTagNumber",
            name: "Asset Tag",
            fieldName: "assetTagNumber",
            minWidth: 100,
            isResizable: true,
        },
        {
            key: "serialNumber",
            name: "Serial Number",
            fieldName: "serialNumber",
            minWidth: 100,
            isResizable: true,
        },
        {
            key: "modelNumber",
            name: "Model Number",
            fieldName: "modelNumber",
            minWidth: 100,
            isResizable: true,
        },
        {
            key: "issuedDate",
            name: "Issued Date",
            fieldName: "issuedDate",
            minWidth: 100,
            isResizable: true,
            onRender: (item: IMaintenanceRequest) =>
                convertDateToddMMMYYYFormat(item.issuedDate),
        },
    ];

    return (
        <StyledModal
            title="New Request"
            isOpen={isModalVisible}
            onDismiss={setIsModalVisible}
            isLoading={isLoading}
            errorMessageBar={failure}
            setErrorMessageBar={setFailure}
        >
            <Stack tokens={{ childrenGap: 3 }} style={{ minHeight: "600px" }}>
                <Stack horizontal>
                    <StackItem style={{ width: "15.1%" }}>
                        <StyledLabel text="Priority" isMandatory={true} />
                    </StackItem>
                    <StackItem style={{ marginTop: "10px", width: "12%" }}>
                        <Dropdown
                            placeholder="Select Priority"
                            options={Object.keys(PRIORITY_OPTIONS).map(
                                (option) => ({
                                    key: option,
                                    text: option,
                                })
                            )}
                            onChange={(e, item) =>
                                changeHandler("priority", item?.text)
                            }
                        />
                    </StackItem>
                </Stack>
                <Separator />
                <StackItem
                    styles={{
                        root: {
                            minHeight: 100,
                            maxHeight: 180,
                            overflowY: "auto",
                            overflowX: "hidden",
                        },
                    }}
                >
                    {assets && (
                        <StyledDetailsList
                            data={assets}
                            columns={_columns}
                            emptymessage="No issued assets found"
                        />
                    )}
                </StackItem>
                <Separator />
                <Stack horizontal>
                    <StackItem style={{ width: "18%" }}>
                        <StyledLabel
                            text="Problem Description"
                            isMandatory={true}
                        />
                    </StackItem>
                    <StackItem style={{ marginTop: "10px", width: "100%" }}>
                        <TextField
                            multiline
                            rows={3}
                            maxLength={1000}
                            resizable={false}
                            onGetErrorMessage={(value: string) => {
                                if (value.trim().length === 0) {
                                    return "Problem description cannot be empty";
                                } else {
                                    return "";
                                }
                            }}
                            onChange={(e, item) => {
                                if (item && item?.trim().length <= 1000) {
                                    changeHandler("description", item?.trim());
                                }
                            }}
                            validateOnFocusOut
                            validateOnLoad={false}
                        />
                    </StackItem>
                </Stack>
                <Stack horizontal>
                    <StackItem style={{ width: "18%" }}>
                        <StyledLabel
                            text="Communication Address"
                            isMandatory={true}
                        />
                    </StackItem>
                    <StackItem style={{ marginTop: "10px", width: "100%" }}>
                        <TextField
                            multiline
                            rows={3}
                            maxLength={500}
                            resizable={false}
                            onGetErrorMessage={(value: string) => {
                                if (value.trim().length === 0) {
                                    return "Communication address cannot be empty";
                                } else {
                                    return "";
                                }
                            }}
                            onChange={(e, item) => {
                                if (item && item.trim().length <= 500) {
                                    changeHandler("address", item?.trim());
                                }
                            }}
                            validateOnFocusOut
                            validateOnLoad={false}
                        />
                    </StackItem>
                </Stack>
                <Stack horizontal>
                    <StackItem style={{ width: "15.1%" }}>
                        <StyledLabel text="Contact Number" isMandatory={true} />
                    </StackItem>
                    <StackItem style={{ marginTop: "10px", width: "12%" }}>
                        <TextField
                            maxLength={10}
                            onChange={(e: any) => {
                                let value = e.target.value;
                                value = value.replace(/[^0-9]/gi, "");
                                changeHandler("phoneNumber", value);
                            }}
                            onGetErrorMessage={validateContactNumber}
                            validateOnFocusOut
                            validateOnLoad={false}
                        />
                    </StackItem>
                </Stack>
            </Stack>
            <StyleModalFooter>
                <Stack horizontal horizontalAlign="end">
                    <>
                        <DefaultButton
                            styles={DashboardStyle.buttonStyles}
                            onClick={setIsModalVisible}
                            text="Cancel"
                        />
                        <PrimaryButton
                            styles={DashboardStyle.buttonStyles}
                            onClick={() => submitData()}
                            disabled={validateInput()}
                            text="Submit"
                        />
                    </>
                </Stack>
            </StyleModalFooter>
        </StyledModal>
    );
};

export default MaintenanceRequestModal;

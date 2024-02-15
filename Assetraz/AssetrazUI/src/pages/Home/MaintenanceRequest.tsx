//React
import * as React from "react";
import { useCallback, useEffect, useState } from "react";

//UI Styles
import { IColumn } from "@fluentui/react/lib/DetailsList";
import { PrimaryButton, Stack } from "@fluentui/react";
import { useBoolean } from "@fluentui/react-hooks";

//Services
import { getMaintenanceRequestByUser } from "../../services/maintenanceRequestService";

//Components
import PageTemplate from "../../components/common/PageTemplate";
import StyledDetailsList from "../../components/common/StyledDetailsList";
import { convertDateToddMMMYYYFormat } from "../../Other/DateFormat";
import { IMaintenanceRequest } from "../../types/maintenanceRequest";
import MaintenanceRequestModal from "./MaintenanceRequestModal";

export const MaintenanceRequest = () => {
    const [data, setData] = useState<IMaintenanceRequest[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState<string | undefined>();
    const [isModalVisible, { toggle: setIsModalVisible }] = useBoolean(false);

    const NewRequestButton = useCallback(
        () => (
            <PrimaryButton
                text="Create New Request"
                onClick={setIsModalVisible}
                styles={{
                    root: {
                        marginRight: 16,
                    },
                }}
            />
        ),
        [setIsModalVisible]
    );

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        setIsLoading(true);
        await getMaintenanceRequestByUser()
            .then((res) => {
                setData(res);
            })
            .catch((err) => setData([]));
        setIsLoading(false);
    };

    const closeRefresh = (message: string) => {
        setSuccess(message);
        getData();
        setIsModalVisible();
    };

    const _columns: IColumn[] = [
        {
            key: "maintenanceRequestNumber",
            name: "Request Number",
            fieldName: "maintenanceRequestNumber",
            minWidth: 150,
            isResizable: true,
        },
        {
            key: "categoryName",
            name: "Category",
            fieldName: "categoryName",
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
            key: "status",
            name: "Status",
            fieldName: "status",
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
        {
            key: "submittedDate",
            name: "Request Date",
            fieldName: "submittedDate",
            minWidth: 100,
            isResizable: true,
            onRender: (item: IMaintenanceRequest) =>
                convertDateToddMMMYYYFormat(item.submittedDate),
        },
    ];

    return (
        <Stack>
            <PageTemplate
                heading=""
                isLoading={isLoading}
                successMessageBar={success}
                setSuccessMessageBar={setSuccess}
                errorOccured={data === null}
                headerElementRight={<NewRequestButton />}
            >
                {data && (
                    <StyledDetailsList
                        data={data}
                        columns={_columns}
                        emptymessage="No requests found"
                    />
                )}
                {isModalVisible && (
                    <MaintenanceRequestModal
                        isModalVisible={isModalVisible}
                        setIsModalVisible={setIsModalVisible}
                        closeRefresh={closeRefresh}
                    />
                )}
            </PageTemplate>
        </Stack>
    );
};

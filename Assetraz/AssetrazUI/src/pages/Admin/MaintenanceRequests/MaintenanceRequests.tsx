//React
import * as React from "react";
import { useEffect, useState } from "react";

//UI Styles
import { IColumn } from "@fluentui/react/lib/DetailsList";

//Services
import { getAllMaintenanceRequests } from "../../../services/maintenanceRequestService";

//Components
import PageTemplate from "../../../components/common/PageTemplate";
import StyledDetailsList from "../../../components/common/StyledDetailsList";
import { convertDateToddMMMYYYFormat } from "../../../Other/DateFormat";
import { IMaintenanceRequest } from "../../../types/maintenanceRequest";
import { Link, Stack } from "@fluentui/react";

export const AssetMaintenance = () => {
    const [data, setData] = useState<IMaintenanceRequest[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        setIsLoading(true);
        await getAllMaintenanceRequests()
            .then((res) => {
                setData(res);
            })
            .catch((err) => setData([]));
        setIsLoading(false);
    };

    const _columns: IColumn[] = [
        {
            key: "maintenanceRequestNumber",
            name: "Request Number",
            fieldName: "maintenanceRequestNumber",
            minWidth: 150,
            isResizable: true,
            onRender: (item: IMaintenanceRequest) => {
                return <Link>{item?.maintenanceRequestNumber}</Link>;
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
            key: "subStatus",
            name: "Stage",
            fieldName: "subStatus",
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
        {
            key: "resolvedDate",
            name: "Resolved Date",
            fieldName: "resolvedDate",
            minWidth: 100,
            isResizable: true,
            onRender: (item: IMaintenanceRequest) =>
                convertDateToddMMMYYYFormat(item.resolvedDate),
        },
    ];

    return (
        <Stack>
            <PageTemplate
                heading="Maintenance Requests"
                isLoading={isLoading}
                errorOccured={data === null}
            >
                {data && (
                    <StyledDetailsList
                        data={data}
                        columns={_columns}
                        emptymessage="No requests found"
                    />
                )}
            </PageTemplate>
        </Stack>
    );
};

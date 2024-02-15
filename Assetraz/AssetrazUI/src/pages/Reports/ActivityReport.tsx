import { IColumn } from "@fluentui/react";
import { FC } from "react";
import { AssetStatus } from "../../constants/AssetStatus";
import { convertDateToddMMMYYYFormat } from "../../Other/DateFormat";
import { getActivityReport } from "../../services/assetService";
import {
    FilterComponent,
    IFilterProps,
    ReportPageTemplate,
} from "./ReportComponents";

const ALL_COLUMNS: IColumn[] = [
    {
        key: "issuedOrReturnedDate",
        name: "Date",
        fieldName: "issuedOrReturnedDate",
        minWidth: 100,
        isResizable: true,
        onRender: (item) =>
            convertDateToddMMMYYYFormat(item.issuedOrReturnedDate),
    },
    {
        key: "updatedBy",
        name: "Admin",
        fieldName: "updatedBy",
        minWidth: 150,
        isResizable: true,
    },
    {
        key: "activityStatus",
        name: "Action",
        fieldName: "activityStatus",
        minWidth: 100,
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
        key: "modelNumber",
        name: "Model",
        fieldName: "modelNumber",
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
        key: "issuedTo",
        name: "Assigned To / Returned From",
        fieldName: "issuedTo",
        minWidth: 200,
        isResizable: true,
    },
    {
        key: "remarks",
        name: "Note",
        fieldName: "remarks",
        minWidth: 100,
        isResizable: true,
        onRender: (item) => {
            if (item.activityStatus !== AssetStatus.Issued) {
                return item.remarks;
            }
        },
    },
];

const INITIAL_COLUMNS = {
    issuedOrReturnedDate: "issuedOrReturnedDate",
    updatedBy: "updatedBy",
    activityStatus: "activityStatus",
    categoryName: "categoryName",
    modelNumber: "modelNumber",
    assetTagNumber: "assetTagNumber",
    serialNumber: "serialNumber",
    issuedTo: "issuedTo",
    remarks: "remarks",
};

const ActivityReportFilter: FC = () => {
    const filterDropDown: IFilterProps[] = [
        {
            id: INITIAL_COLUMNS.issuedOrReturnedDate,
            label: "Date",
            placeholder: "Select Date",
        },
        {
            id: INITIAL_COLUMNS.activityStatus,
            label: "Action",
            placeholder: "Select Action",
        },
        {
            id: INITIAL_COLUMNS.categoryName,
            label: "Category",
            placeholder: "Select Category",
        },
        {
            id: INITIAL_COLUMNS.issuedTo,
            label: "Assigned To / Returned From",
            placeholder: "Select Name",
        },
    ];
    const defaultDateFilter = true;
    const noFutureDate = true;

    return (
        <FilterComponent
            filteredColumns={filterDropDown}
            defaultDateFilter={defaultDateFilter}
            noFutureDate={noFutureDate}
        />
    );
};

const ActivityReportPage: FC = () => {
    return (
        <ReportPageTemplate
            allColumns={ALL_COLUMNS}
            intialColumns={Object.keys(INITIAL_COLUMNS)}
            reportService={getActivityReport}
        >
            <ActivityReportFilter />
        </ReportPageTemplate>
    );
};

export default ActivityReportPage;

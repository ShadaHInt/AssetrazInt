import { IColumn } from "@fluentui/react";
import { FC } from "react";
import { getAssetsReport } from "../../services/assetService";
import {
    convertDateToddMMMYYYFormat,
    convertUTCDateToLocalDate,
} from "../../Other/DateFormat";
import {
    FilterComponent,
    IFilterProps,
    ReportPageTemplate,
} from "./ReportComponents";

const ALL_COLUMNS: IColumn[] = [
    {
        key: "categoryName",
        name: "Category",
        fieldName: "categoryName",
        minWidth: 90,
        isResizable: true,
    },
    {
        key: "assetTagNumber",
        name: "Asset Tag",
        fieldName: "assetTagNumber",
        minWidth: 60,
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
        name: "Model",
        fieldName: "modelNumber",
        minWidth: 90,
        isResizable: true,
    },
    {
        key: "networkCompany",
        name: "Network Company",
        fieldName: "networkCompany",
        minWidth: 120,
        isResizable: true,
    },
    {
        key: "assetStatus",
        name: "Asset Status",
        fieldName: "assetStatus",
        minWidth: 80,
        isResizable: true,
    },
    {
        key: "issuedTo",
        name: "Issued To",
        fieldName: "issuedTo",
        minWidth: 100,
        isResizable: true,
    },
    {
        key: "warrentyStatus",
        name: "Warranty Status",
        fieldName: "warrentyStatus",
        minWidth: 120,
        isResizable: true,
    },
    {
        key: "invoiceNumber",
        name: "Invoice Number",
        fieldName: "invoiceNumber",
        minWidth: 110,
        isResizable: true,
    },
    {
        key: "invoiceDate",
        name: "Invoice Date",
        fieldName: "invoiceDate",
        minWidth: 90,
        isResizable: true,
        onRender: (item) => {
            return item.invoiceDate
                ? convertDateToddMMMYYYFormat(
                      convertUTCDateToLocalDate(item.invoiceDate)
                  )
                : "";
        },
    },
    {
        key: "issuedDate",
        name: "Issued Date",
        fieldName: "issuedDate",
        minWidth: 90,
        isResizable: true,
        onRender: (item) => convertDateToddMMMYYYFormat(item.issuedDate),
    },
    {
        key: "vendor",
        name: "Vendor",
        fieldName: "vendor",
        minWidth: 90,
        isResizable: true,
    },
    {
        key: "warrentyDate",
        name: "Warranty Date",
        fieldName: "warrentyDate",
        minWidth: 100,
        isResizable: true,
        onRender: (item) => {
            return item.warrentyDate
                ? convertDateToddMMMYYYFormat(
                      convertUTCDateToLocalDate(item.warrentyDate)
                  )
                : "";
        },
    },
    {
        key: "isIssuable",
        name: "Issuable",
        fieldName: "isIssuable",
        minWidth: 90,
        isResizable: true,
    },
];

const INITIAL_COLUMNS = {
    categoryName: "categoryName",
    assetTagNumber: "assetTagNumber",
    serialNumber: "serialNumber",
    modelNumber: "modelNumber",
    networkCompany: "networkCompany",
    assetStatus: "assetStatus",
    issuedTo: "issuedTo",
    warrentyStatus: "warrentyStatus",
};

const AssetsReportFilter: FC = () => {
    const filterDropDown: IFilterProps[] = [
        {
            id: INITIAL_COLUMNS.categoryName,
            label: "Categories",
            placeholder: "Select categories",
        },
        {
            id: INITIAL_COLUMNS.networkCompany,
            label: "Network Company",
            placeholder: "Select network company",
        },
        {
            id: INITIAL_COLUMNS.assetStatus,
            label: "Asset Status",
            placeholder: "Select asset status",
        },
        {
            id: INITIAL_COLUMNS.warrentyStatus,
            label: "Warranty Status",
            placeholder: "Select warranty status",
        },
        {
            id: "vendor",
            label: "Vendor",
            placeholder: "Select vendor",
        },
        {
            id: "warrentyDate",
            label: "Warranty Date",
            placeholder: "warrantyDate",
        },
        {
            id: "invoiceDate",
            label: "Invoice Date",
            placeholder: "invoiceDate",
            noFutureDate: true,
        },
        {
            id: "issuedDate",
            label: "Issued Date",
            placeholder: "issuedDate",
            noFutureDate: true,
        },
        {
            id: "isIssuable",
            label: "Issuable",
            placeholder: "Select Issuable",
        },
    ];

    return <FilterComponent filteredColumns={filterDropDown} />;
};

const AssetReportPage: FC = () => {
    return (
        <ReportPageTemplate
            allColumns={ALL_COLUMNS}
            intialColumns={Object.keys(INITIAL_COLUMNS)}
            reportService={getAssetsReport}
        >
            <AssetsReportFilter />
        </ReportPageTemplate>
    );
};

export default AssetReportPage;

import { IColumn, TooltipHost } from "@fluentui/react";
import { FC } from "react";
import { getProcurementsReport } from "../../services/purchaseOrderServices";
import { convertDateToddMMMYYYFormat } from "../../Other/DateFormat";
import {
    FilterComponent,
    IFilterProps,
    ReportPageTemplate,
} from "./ReportComponents";

const ALL_COLUMNS: IColumn[] = [
    {
        key: "procurementRequestNumber",
        name: "Procurement Number",
        fieldName: "procurementRequestNumber",
        minWidth: 150,
        isResizable: true,
    },
    {
        key: "requestRaisedOn",
        name: "Procurement Request Date",
        fieldName: "requestRaisedOn",
        minWidth: 180,
        isResizable: true,
        onRender: (item) => convertDateToddMMMYYYFormat(item.requestRaisedOn),
    },
    {
        key: "requestRaisedBy",
        name: "Procurement Requested By",
        fieldName: "requestRaisedBy",
        minWidth: 180,
        isResizable: true,
    },
    {
        key: "purchaseOrderNumber",
        name: "PO Number",
        fieldName: "purchaseOrderNumber",
        minWidth: 90,
        isResizable: true,
    },
    {
        key: "pogeneratedOn",
        name: "PO Date",
        fieldName: "pogeneratedOn",
        minWidth: 80,
        isResizable: true,
        onRender: (item) => convertDateToddMMMYYYFormat(item.pogeneratedOn),
    },
    {
        key: "categoryName",
        name: "Category",
        fieldName: "categoryName",
        minWidth: 100,
        isResizable: true,
    },
    {
        key: "specifications",
        name: "Specification",
        fieldName: "specifications",
        minWidth: 120,
        isResizable: true,
        onRender: (item) => {
            return (
                <TooltipHost
                    content={
                        item?.specifications &&
                        item?.specifications?.length > 0 ? (
                            <table
                                style={{
                                    borderCollapse: "collapse",
                                    width: "100%",
                                }}
                            >
                                <tbody>
                                    {item?.specifications
                                        ?.split(/[,/]/)
                                        .map((spec: string, index: any) => (
                                            <tr key={index}>
                                                <td
                                                    style={{
                                                        border: "1px solid #ccc",
                                                        padding: "8px",
                                                        whiteSpace: "normal",
                                                        wordWrap: "break-word",
                                                        maxWidth: "200px",
                                                    }}
                                                >
                                                    {spec.trim()}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        ) : (
                            ""
                        )
                    }
                >
                    {item.specifications}
                </TooltipHost>
            );
        },
    },
    {
        key: "quantity",
        name: "Quantity",
        fieldName: "quantity",
        minWidth: 110,
        isResizable: true,
    },
    {
        key: "ratePerQuantity",
        name: "Price",
        fieldName: "ratePerQuantity",
        minWidth: 90,
        isResizable: true,
    },
    {
        key: "vendorName",
        name: "Vendor",
        fieldName: "vendorName",
        minWidth: 100,
        isResizable: true,
    },
    {
        key: "invoiceNumber",
        name: "Invoice Number",
        fieldName: "invoiceNumber",
        minWidth: 150,
        isResizable: true,
    },
];

const INITIAL_COLUMNS = {
    procurementRequestNumber: "procurementRequestNumber",
    requestRaisedOn: "requestRaisedOn",
    requestRaisedBy: "requestRaisedBy",
    purchaseOrderNumber: "purchaseOrderNumber",
    pogeneratedOn: "pogeneratedOn",
    categoryName: "categoryName",
    specifications: "specifications",
    quantity: "quantity",
    ratePerQuantity: "ratePerQuantity",
    vendorName: "vendorName",
    invoiceNumber: "invoiceNumber",
};

const ProcurementsReportFilter: FC = () => {
    const filterDropDown: IFilterProps[] = [
        {
            id: INITIAL_COLUMNS.requestRaisedOn,
            label: "Procurement Request Date",
            placeholder: "Select Request Date",
            noFutureDate: true,
        },
        {
            id: INITIAL_COLUMNS.pogeneratedOn,
            label: "PO Date",
            placeholder: "Select PO Date",
            noFutureDate: true,
        },
        {
            id: INITIAL_COLUMNS.categoryName,
            label: "Category",
            placeholder: "Select Category",
        },
        {
            id: INITIAL_COLUMNS.vendorName,
            label: "Vendor",
            placeholder: "Select Vendor",
        },
    ];

    return <FilterComponent filteredColumns={filterDropDown} />;
};

const ProcurementReportPage: FC = () => {
    return (
        <ReportPageTemplate
            allColumns={ALL_COLUMNS}
            intialColumns={Object.keys(INITIAL_COLUMNS)}
            reportService={getProcurementsReport}
        >
            <ProcurementsReportFilter />
        </ReportPageTemplate>
    );
};

export default ProcurementReportPage;

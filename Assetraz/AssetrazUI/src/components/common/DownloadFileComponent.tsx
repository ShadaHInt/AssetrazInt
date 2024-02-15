import React, { useCallback, useMemo } from "react";
import {
    ActionButton,
    ContextualMenuItemType,
    IColumn,
    IContextualMenuProps,
    IIconProps,
} from "@fluentui/react";
import { BookType, utils, write } from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface DownLoadFileProps {
    data: any[];
    columns: IColumn[];
}
interface TableData {
    [key: string]: any;
}
interface TableColumn {
    fieldName: string;
}

const downloadIcon: IIconProps = { iconName: "Installation" };

export const DownLoadFileComponent: React.FC<DownLoadFileProps> = (
    props: any
) => {
    const generatePdf = useCallback(
        (fileType: "pdf") => {
            if (fileType === "pdf") {
                const columnWidths: number[] = props.columns.map(
                    (column: TableColumn) => column.fieldName.length * 6
                );

                const selectedData = props.data.map((asset: TableData) => {
                    const selectedColumns: TableData = {};
                    props.columns.forEach((column: TableColumn) => {
                        selectedColumns[column.fieldName] =
                            asset[column.fieldName];
                    });
                    return selectedColumns;
                });

                const keys = Object.keys(selectedData[0]);
                const columnHeaders = keys.map((key) => {
                    const formattedTitle = key
                        .split(".")
                        .map(
                            (part) =>
                                part.charAt(0).toUpperCase() + part.slice(1)
                        )
                        .join(" ")
                        .replace(/([a-z])([A-Z])/g, "$1 $2"); // Add space between camelCase words

                    return formattedTitle;
                });

                const totalColumnWidth = columnWidths.reduce(
                    (sum, width) => sum + width,
                    0
                );

                const a4Width = 210;
                const a4Height = 297;

                const pdfWidth =
                    totalColumnWidth > a4Height ? totalColumnWidth : a4Width;
                const pdfHeight =
                    totalColumnWidth > a4Height ? a4Height : totalColumnWidth;

                const doc = new jsPDF({
                    orientation:
                        pdfWidth > pdfHeight ? "landscape" : "portrait",
                    unit: "mm",
                    format: [pdfWidth, pdfHeight],
                });

                autoTable(doc, {
                    head: [columnHeaders],
                    body: selectedData.map((row: any) =>
                        keys.map((key) => row[key])
                    ),
                    theme: "grid",
                    headStyles: {
                        fillColor: [0, 120, 215],
                    },
                    styles: {
                        cellWidth: "wrap",
                        cellPadding: 2,
                        overflow: "linebreak",
                    },
                });

                doc.save("table.pdf");
            }
        },
        [props.columns, props.data]
    );

    const handleDownloadClick = useCallback(
        (fileType: BookType | "pdf"): (() => void) => {
            return () => {
                if (props?.data && props?.columns) {
                    if (fileType === ("pdf" as BookType)) {
                        generatePdf("pdf");
                    } else {
                        const selectedData = props.data.map((asset: any) => {
                            const selectedColumns: any = {};
                            props.columns.forEach((column: any) => {
                                selectedColumns[column.fieldName!] =
                                    asset[
                                        column.fieldName as keyof typeof asset
                                    ];
                            });
                            return selectedColumns;
                        });

                        const ws = utils.json_to_sheet(selectedData);
                        const keys = Object.keys(selectedData[0]);

                        const columnHeaders = keys.map((key) => {
                            const formattedTitle = key
                                .split(".")
                                .map(
                                    (part) =>
                                        part.charAt(0).toUpperCase() +
                                        part.slice(1)
                                )
                                .join(" ")
                                .replace(/([a-z])([A-Z])/g, "$1 $2"); // Add space between camelCase words

                            return formattedTitle;
                        });

                        utils.sheet_add_aoa(ws, [columnHeaders], {
                            origin: "A1",
                        });
                        ws["!cols"] = keys.map(() => ({ wch: 20 }));
                        const wb = utils.book_new();
                        utils.book_append_sheet(wb, ws, "Data");

                        const fileBuffer: any = write(wb, {
                            bookType: fileType as BookType,
                            type: "array",
                        });

                        const blob = new Blob([fileBuffer]);
                        const fileDownloadUrl = URL.createObjectURL(blob);
                        var link = document.createElement("a");

                        const now = new Date();
                        const dateFormat =
                            now.getFullYear() +
                            "-" +
                            now.getMonth() +
                            1 +
                            "-" +
                            now.getDate() +
                            " " +
                            now.getHours() +
                            ":" +
                            now.getMinutes() +
                            ":" +
                            now.getSeconds();

                        link.download =
                            "requests " + dateFormat + `.${fileType}`;
                        link.href = fileDownloadUrl;
                        link.click();
                    }
                }
            };
        },
        [generatePdf, props.columns, props.data]
    );

    const menuProps: IContextualMenuProps = useMemo(
        () => ({
            shouldFocusOnMount: true,
            items: [
                {
                    key: "fileType",
                    itemType: ContextualMenuItemType.Header,
                    text: "Choose File type",
                    itemProps: { lang: "en-us" },
                },
                {
                    key: "pdf",
                    text: "Pdf",
                    onClick: handleDownloadClick("pdf"),
                    iconProps: {
                        iconName: "PDF",
                    },
                },
                {
                    key: "csv",
                    text: "CSV",
                    onClick: handleDownloadClick("csv" as BookType),
                    iconProps: {
                        iconName: "AnalyticsView",
                    },
                },
                {
                    key: "excel",
                    text: "Excel",
                    onClick: handleDownloadClick("xlsx" as BookType),
                    iconProps: {
                        iconName: "ExcelDocument",
                    },
                },
            ],
        }),
        [handleDownloadClick]
    );
    return (
        <>
            <ActionButton
                iconProps={downloadIcon}
                text="Export Report"
                menuProps={menuProps}
            />
        </>
    );
};

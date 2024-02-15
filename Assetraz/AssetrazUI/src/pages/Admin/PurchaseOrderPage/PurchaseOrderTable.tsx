import { IColumn, TextField, TooltipHost } from "@fluentui/react";
import { useBoolean } from "@fluentui/react-hooks";
import React, {
    Dispatch,
    FC,
    SetStateAction,
    useCallback,
    useMemo,
} from "react";
import StyledDetailsList from "../../../components/common/StyledDetailsList";
import { PurchaseItemsDetails } from "../../../types/PurchaseOrder";

interface POListInputs {
    data: any;
    isPoCreated?: boolean;
    isReadOnly: boolean;
    setPO: Dispatch<SetStateAction<PurchaseItemsDetails[]>>;
    prevData: PurchaseItemsDetails[];
    isError: boolean;
}

const PurchaseOrderTable: FC<POListInputs> = (props: any) => {
    const { data, setPO, isError, isPoCreated, isReadOnly, prevData } = props;

    const [multiline, { toggle: toggleMultiline }] = useBoolean(false);
    const getErrorMessage = useCallback(
        (
            value: string | undefined,
            type?: string,
            field?: string,
            purchaseOrderDetailsId?: string
        ): string => {
            if (type === "number") {
                var space = /\s/;
                if (!(value && parseFloat(value))) return "Required";
                else {
                    let prevDetails: PurchaseItemsDetails | undefined;
                    prevDetails = prevData.find(
                        (obj: PurchaseItemsDetails) =>
                            obj.purchaseOrderDetailsId ===
                            purchaseOrderDetailsId
                    );
                    if (
                        field === "ratePerQuantity" &&
                        prevDetails &&
                        Number(value) > prevDetails.ratePerQuantity
                    ) {
                        return "Invalid";
                    }
                    if (
                        (field === "ratePerQuantity" &&
                            prevDetails &&
                            space.test(value)) ||
                        !/^[0-9]*(\.[0-9]{1,2})?$/.test(value.toString())
                    ) {
                        return "Invalid";
                    }
                    if (
                        field === "quantity" &&
                        prevDetails &&
                        Number(value) > prevDetails.quantity
                    ) {
                        return "Invalid";
                    }
                    if (
                        field === "quantity" &&
                        prevDetails &&
                        space.test(value)
                    ) {
                        return "Invalid";
                    }

                    if (
                        field === "quantityReceived" &&
                        prevDetails &&
                        Number(value) > prevDetails.quantity
                    ) {
                        return "Invalid";
                    }
                }
            }
            return value && value.length > 0 ? "" : "Required";
        },
        [prevData]
    );

    const changeHandler = React.useCallback(
        (field: string, value: any, id?: number | string) => {
            if (id !== null) {
                setPO((prevState: PurchaseItemsDetails[]) =>
                    prevState.map((element) =>
                        element.purchaseOrderDetailsId === id
                            ? Object.assign({}, element, { [field]: value })
                            : element
                    )
                );
            }
        },
        [setPO]
    );

    const _columns: IColumn[] = useMemo(
        () => [
            {
                key: "categoryName",
                name: "Category",
                fieldName: "categoryName",
                minWidth: 130,
                isResizable: true,
            },
            {
                key: "manufacturerName",
                name: "Manufacturer",
                fieldName: "manufacturerName",
                minWidth: 120,
                isResizable: true,
            },
            {
                key: "modelNumber",
                name: "Model Number",
                fieldName: "modelNumber",
                minWidth: 150,
                isResizable: true,
            },
            {
                key: "specifications",
                name: "Specifications",
                fieldName: "specifications",
                minWidth: 150,
                isResizable: true,
                onRender: (item: PurchaseItemsDetails) => {
                    if (isReadOnly || isPoCreated) {
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
                                                    .map(
                                                        (
                                                            spec: string,
                                                            index: any
                                                        ) => (
                                                            <tr key={index}>
                                                                <td
                                                                    style={{
                                                                        border: "1px solid #ccc",
                                                                        padding:
                                                                            "8px",
                                                                        whiteSpace:
                                                                            "normal",
                                                                        wordWrap:
                                                                            "break-word",
                                                                        maxWidth:
                                                                            "200px",
                                                                    }}
                                                                >
                                                                    {spec.trim()}
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
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
                    }

                    return (
                        <TextField
                            value={item?.specifications.toString()}
                            onClick={() => {
                                const newMultiline =
                                    item?.specifications &&
                                    item?.specifications.length > 40;
                                if (newMultiline !== multiline) {
                                    toggleMultiline();
                                }
                            }}
                            onChange={(e, newValue?: string) => {
                                const newMultiline =
                                    newValue && newValue.length > 40;
                                if (newMultiline !== multiline) {
                                    toggleMultiline();
                                }
                                changeHandler(
                                    "specifications",
                                    newValue,
                                    item?.purchaseOrderDetailsId
                                );
                            }}
                            multiline={multiline}
                            errorMessage={
                                isError &&
                                getErrorMessage(
                                    item.specifications
                                        ? item?.specifications.toString()
                                        : "",
                                    "string",
                                    item?.purchaseOrderDetailsId
                                )
                            }
                        />
                    );
                },
            },
            {
                key: "quantity",
                name: "Quantity",
                fieldName: "quantity",
                minWidth: 80,
                isResizable: true,
                onRender: (item: PurchaseItemsDetails) => {
                    if (isReadOnly || isPoCreated) {
                        return item.quantity;
                    }

                    return (
                        <TextField
                            value={item?.quantity.toString()}
                            onChange={(e, newValue?: string) =>
                                changeHandler(
                                    "quantity",
                                    newValue,
                                    item?.purchaseOrderDetailsId
                                )
                            }
                            errorMessage={
                                isError &&
                                getErrorMessage(
                                    item.quantity
                                        ? item?.quantity.toString()
                                        : "",
                                    "number",
                                    "quantity",
                                    item?.purchaseOrderDetailsId
                                )
                            }
                        />
                    );
                },
            },
            {
                key: "ratePerQuantity",
                name: "Rate Per Quantity",
                fieldName: "ratePerQuantity",
                minWidth: 120,
                isResizable: true,
                onRender: (item: PurchaseItemsDetails) => {
                    if (isReadOnly || isPoCreated) {
                        return item.ratePerQuantity;
                    }
                    return (
                        <TextField
                            value={item?.ratePerQuantity.toString()}
                            onChange={(e, newValue?: string) =>
                                changeHandler(
                                    "ratePerQuantity",
                                    newValue,
                                    item?.purchaseOrderDetailsId
                                )
                            }
                            errorMessage={
                                isError &&
                                getErrorMessage(
                                    item.ratePerQuantity
                                        ? item?.ratePerQuantity.toString()
                                        : "",
                                    "number",
                                    "ratePerQuantity",
                                    item?.purchaseOrderDetailsId
                                )
                            }
                        />
                    );
                },
            },
            {
                key: "amount",
                name: "Amount",
                fieldName: "amount",
                minWidth: 100,
                isResizable: true,
                onRender: (item: PurchaseItemsDetails) =>
                    isNaN(item?.quantity * item?.ratePerQuantity)
                        ? 0
                        : item?.quantity * item?.ratePerQuantity,
            },
            isPoCreated && {
                key: "quantityReceived",
                name: "Quantity Received",
                fieldName: "quantityReceived",
                minWidth: 120,
                isResizable: true,
                onRender: (item: PurchaseItemsDetails) => {
                    if (isReadOnly) {
                        return item.quantityReceived
                            ? item.quantityReceived
                            : 0;
                    }
                    return (
                        isPoCreated && (
                            <TextField
                                value={
                                    item.quantityReceived
                                        ? item.quantityReceived.toString()
                                        : ""
                                }
                                onChange={(e, newValue?: string) =>
                                    changeHandler(
                                        "quantityReceived",
                                        newValue,
                                        item?.purchaseOrderDetailsId
                                    )
                                }
                                errorMessage={
                                    isError &&
                                    getErrorMessage(
                                        item.quantityReceived
                                            ? item.quantityReceived.toString()
                                            : "",
                                        "number",
                                        "quantityReceived",
                                        item?.purchaseOrderDetailsId
                                    )
                                }
                                validateOnFocusOut
                                validateOnLoad={false}
                            />
                        )
                    );
                },
            },
        ],
        [
            isPoCreated,
            isReadOnly,
            multiline,
            isError,
            getErrorMessage,
            toggleMultiline,
            changeHandler,
        ]
    );

    return (
        <>
            {{ data } && (
                <StyledDetailsList
                    data={data}
                    columns={_columns}
                    emptymessage="No details found"
                />
            )}
        </>
    );
};

export default PurchaseOrderTable;

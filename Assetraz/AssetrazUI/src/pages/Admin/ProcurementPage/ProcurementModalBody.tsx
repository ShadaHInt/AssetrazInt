import { Dispatch, FC, SetStateAction, useCallback, useMemo } from "react";
import {
    DirectionalHint,
    Dropdown,
    IDropdownOption,
    Stack,
    TextField,
    TooltipHost,
} from "@fluentui/react";
import { useBoolean } from "@fluentui/react-hooks";
import StyledDetailsList from "../../../components/common/StyledDetailsList";
import { ProcurementStatus } from "../../../constants/ProcurementStatus";
import getErrorMessage, {
    VALIDATION_TYPE,
} from "../../../Other/InputValidation";
import { Category } from "../../../types/Category";
import { Manufacturer } from "../../../types/Manufacturer";
import { ProcurementProps } from "../../../types/Procurement";
import { Vendor } from "../../../types/Vendor";
import ProcurementLineItem from "./ProcurementDetailsLineItem";
import { SearchableDropdown } from "../../../components/common/SearchableDropdown";
import { updateQuoteDropdownStyle } from "./ProcurementPage.styles";

interface ProcurementModalProps {
    categories?: IDropdownOption<Category>[];
    manfacturer?: IDropdownOption<Manufacturer>[];
    vendors?: IDropdownOption<Vendor>[];
    request: ProcurementProps[];
    status?: string;
    showLineErrorMessage: boolean;
    isReadOnly: boolean;
    setRequest: Dispatch<SetStateAction<ProcurementProps[]>>;
}

const ProcurementModalBody: FC<ProcurementModalProps> = (props) => {
    const {
        categories,
        manfacturer,
        vendors,
        request,
        status,
        showLineErrorMessage,
        isReadOnly,
        setRequest,
    } = props;

    const [multiline, { toggle: toggleMultiline }] = useBoolean(false);

    const isStatusGenerated = status === ProcurementStatus.Generated;

    const removeRequest = (id: string) => {
        if (request.length > 1) {
            setRequest((prevState: ProcurementProps[]) =>
                prevState?.filter((r: ProcurementProps) => r.id !== id)
            );
        }
    };

    const changeHandler = useCallback(
        (field: string, value: any, id?: number | string) => {
            if (id !== null) {
                setRequest((prevState: ProcurementProps[]) =>
                    prevState.map((element) =>
                        element.id === id
                            ? Object.assign({}, element, { [field]: value })
                            : element
                    )
                );
            }
        },
        [setRequest]
    );

    const getVendorErrorMessage = useCallback(
        (vendorId: string): string => {
            let message = "";
            if (showLineErrorMessage) {
                return getErrorMessage(vendorId);
            }
            if (
                isReadOnly ||
                (vendors && vendors.map((v) => v.key).includes(vendorId)) ||
                !vendorId
            ) {
                message = "";
            } else {
                message = "Select a vendor";
            }

            return message;
        },
        [isReadOnly, showLineErrorMessage, vendors]
    );

    const _quoteRequestColumns = useMemo(
        () => [
            {
                key: "vendorId",
                name: "Vendor",
                fieldName: "vendorId",
                minWidth: 120,
                isResizable: true,
                onRender: (item: ProcurementProps) => {
                    if (isReadOnly) {
                        return item?.vendorName
                            ? item?.vendorName
                            : "Not selected";
                    }

                    return (
                        <Dropdown
                            options={vendors ? vendors : []}
                            selectedKey={item?.vendorId}
                            disabled={isReadOnly}
                            onChange={(e, option) =>
                                changeHandler("vendorId", option?.key, item?.id)
                            }
                            errorMessage={getVendorErrorMessage(
                                item?.vendorId as string
                            )}
                        />
                    );
                },
            },
            {
                key: "categoryId",
                name: "Category",
                fieldName: "categoryId",
                minWidth: 100,
                isResizable: true,
                onRender: (item: ProcurementProps) => item?.categoryName,
            },
            {
                key: "manfacturerId",
                name: "Manufacturer",
                fieldName: "manfacturerId",
                minWidth: 150,
                isResizable: true,
                onRender: (item: ProcurementProps) => {
                    if (isReadOnly) return item?.manufacturerName;
                    return (
                        <SearchableDropdown
                            options={manfacturer ?? []}
                            placeholder="Manufacturer"
                            selectedKey={item.manfacturerId}
                            onChange={(e, option) =>
                                changeHandler(
                                    "manfacturerId",
                                    option?.key,
                                    item?.id
                                )
                            }
                            errorMessage={
                                showLineErrorMessage
                                    ? getErrorMessage(item.manfacturerId)
                                    : ""
                            }
                            disabled={isReadOnly}
                            styles={updateQuoteDropdownStyle}
                        />
                    );
                },
            },
            {
                key: "modelNumber",
                name: "Model Number",
                fieldName: "modelNumber",
                minWidth: 130,
                isResizable: true,
                onRender: (item: ProcurementProps) => {
                    if (isReadOnly) return item?.modelNumber;
                    return (
                        <TextField
                            placeholder="Model number"
                            defaultValue={item.modelNumber}
                            onChange={(e, value) =>
                                changeHandler("modelNumber", value, item.id)
                            }
                            validateOnLoad={false}
                            validateOnFocusOut={true}
                            errorMessage={
                                showLineErrorMessage
                                    ? getErrorMessage(item?.modelNumber)
                                    : ""
                            }
                            readOnly={isReadOnly}
                        />
                    );
                },
            },
            {
                key: "specifications",
                name: "Specifications",
                fieldName: "specifications",
                minWidth: 130,
                isResizable: true,
                onRender: (item: ProcurementProps) => {
                    if (isReadOnly)
                        return (
                            <TooltipHost
                                directionalHint={DirectionalHint.leftCenter}
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
                    else {
                        return (
                            <TextField
                                placeholder="Specifications"
                                defaultValue={item.specifications}
                                onClick={() => {
                                    const newMultiline =
                                        item.specifications &&
                                        item.specifications.length > 40;
                                    if (newMultiline != multiline) {
                                        toggleMultiline();
                                    }
                                }}
                                onChange={(e, value) => {
                                    const newMultiline =
                                        value && value.length > 40;
                                    if (newMultiline !== multiline) {
                                        toggleMultiline();
                                    }
                                    changeHandler(
                                        "specifications",
                                        value,
                                        item.id
                                    );
                                }}
                                multiline={multiline}
                                validateOnLoad={false}
                                errorMessage={
                                    showLineErrorMessage
                                        ? getErrorMessage(item.specifications)
                                        : ""
                                }
                                readOnly={isReadOnly}
                            />
                        );
                    }
                },
            },
            {
                key: "quantity",
                name: "Quantity",
                fieldName: "quantity",
                minWidth: 100,
                isResizable: true,
                onRender: (item: ProcurementProps) => {
                    if (isReadOnly) return item?.quantity;

                    return (
                        <TextField
                            placeholder="Quantity"
                            defaultValue={item.quantity}
                            onChange={(e, value) => {
                                changeHandler("quantity", value, item.id);
                            }}
                            validateOnLoad={false}
                            errorMessage={
                                showLineErrorMessage
                                    ? getErrorMessage(
                                          item.quantity,
                                          VALIDATION_TYPE.NUMBER
                                      )
                                    : ""
                            }
                            readOnly={isReadOnly}
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
                onRender: (item: ProcurementProps) => {
                    if (isReadOnly) {
                        return parseFloat(item?.ratePerQuantity) >= 0
                            ? item?.ratePerQuantity
                            : 0;
                    }

                    return (
                        <TextField
                            value={item.ratePerQuantity}
                            onChange={(e, newValue?: string) =>
                                changeHandler(
                                    "ratePerQuantity",
                                    newValue,
                                    item?.id
                                )
                            }
                            errorMessage={
                                showLineErrorMessage
                                    ? getErrorMessage(
                                          item?.ratePerQuantity,
                                          VALIDATION_TYPE.NUMBER
                                      )
                                    : /^[0-9]*(\.[0-9]{1,2})?$/.test(
                                          item.ratePerQuantity
                                      )
                                    ? ""
                                    : "invalid"
                            }
                        />
                    );
                },
            },
            {
                key: "amount",
                name: "Amount",
                fieldName: "amount",
                isResizable: true,
                minWidth: 90,
                onRender: (item: ProcurementProps) => {
                    const amount =
                        parseFloat(item?.quantity) *
                        parseFloat(item?.ratePerQuantity);
                    return isNaN(amount) ? "" : amount;
                },
            },
        ],
        [
            isReadOnly,
            vendors,
            getVendorErrorMessage,
            changeHandler,
            manfacturer,
            showLineErrorMessage,
            multiline,
            toggleMultiline,
        ]
    );

    return (
        <Stack
            styles={{
                root: {
                    maxHeight: 475,
                    overflowY: "auto",
                    overflowX: "hidden",
                    marginBottom: 40,
                },
            }}
        >
            {isStatusGenerated || isReadOnly ? (
                <StyledDetailsList
                    data={request}
                    columns={_quoteRequestColumns}
                />
            ) : (
                categories &&
                manfacturer &&
                request.map((req: ProcurementProps) => (
                    <ProcurementLineItem
                        key={req.id}
                        categories={categories}
                        manfacturer={manfacturer}
                        data={req}
                        showLineErrorMessage={showLineErrorMessage}
                        minus={removeRequest}
                        changeHandler={changeHandler}
                        isReadOnly={isReadOnly}
                    />
                ))
            )}
        </Stack>
    );
};

export default ProcurementModalBody;

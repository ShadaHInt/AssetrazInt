import {
    ActionButton,
    DatePicker,
    defaultDatePickerStrings,
    Dropdown,
    IconButton,
    IDropdownOption,
    IIconProps,
    Stack,
    TextField,
    TooltipHost,
} from "@fluentui/react";
import getErrorMessage, {
    IsStringValid,
    VALIDATION_TYPE,
} from "../../../Other/InputValidation";
import { useBoolean } from "@fluentui/react-hooks";
import { OtherSourceInventoryProps } from "../../../types/OtherSourceInventory";
import { FC } from "react";
import { ICategory } from "../../../types/Category";
import { convertUTCDateToLocalDate } from "../../../Other/DateFormat";
import {
    actionButtonStyle,
    iconStyle,
    textFieldStyleOtherSource,
} from "../../../components/common/DatePickerWithClearStyle";
import { assetTagRegex } from "../InvoiceRegister/AddAssetsModal";

interface IOtherSourceInventoryLineItemProps {
    index: number;
    categories: any;
    manufacturers: IDropdownOption[] | null;
    data: OtherSourceInventoryProps;
    isReadOnly: boolean;
    allCategories: any;
    showLineErrorMessage: boolean;
    minus: (value: number) => void;
    addRequest: (data: OtherSourceInventoryProps) => void;
    changeHandler: (field: string, value: any, index: number) => void;
    categoryFieldRequired: (
        categoryName: string,
        categories: ICategory[],
        column: string
    ) => any;
}

const clearIcon: IIconProps = { iconName: "Clear" };

const OtherSourceInventoryModalBody: FC<IOtherSourceInventoryLineItemProps> = (
    props: any
) => {
    const {
        index,
        categories,
        manufacturers,
        data,
        minus,
        isReadOnly,
        changeHandler,
        showLineErrorMessage,
        allCategories,
        categoryFieldRequired,
        addRequest,
    } = props;

    const [multiline, { toggle: toggleMultiline }] = useBoolean(false);
    const specialCharacterRegex = /^[^a-zA-Z0-9]/;

    const validateInput = (value: string, regex: RegExp, required: boolean) => {
        if (required && !IsStringValid(value)) {
            return "Required";
        }
        if (regex.test(value)) {
            return "Invalid Input";
        }
        return "";
    };

    return (
        <Stack
            horizontal
            horizontalAlign="space-between"
            styles={{
                root: {
                    padding: "10px 0",
                },
            }}
            //wrap
        >
            <Stack style={{ width: "95%" }}>
                <Stack horizontal tokens={{ childrenGap: "1.1%" }}>
                    <Stack.Item style={{ width: "20%" }}>
                        <Dropdown
                            options={categories}
                            placeholder="Category"
                            selectedKey={data.categoryId}
                            required
                            onChange={(e, item) =>
                                changeHandler("categoryId", item?.key, index)
                            }
                            errorMessage={
                                showLineErrorMessage &&
                                getErrorMessage(data.categoryId)
                            }
                            disabled={false}
                        />
                    </Stack.Item>
                    <Stack.Item style={{ width: "20%" }}>
                        <Dropdown
                            options={manufacturers}
                            placeholder="Manufacturer"
                            selectedKey={data.manufacturerId}
                            required
                            onChange={(e, item) =>
                                changeHandler(
                                    "manufacturerId",
                                    item?.key,
                                    index
                                )
                            }
                            errorMessage={
                                showLineErrorMessage &&
                                getErrorMessage(data.manufacturerId)
                            }
                            disabled={false}
                        />
                    </Stack.Item>
                    <Stack.Item style={{ width: "20%" }}>
                        <TextField
                            placeholder="Model number"
                            value={data.modelNumber}
                            onChange={(e, value) =>
                                changeHandler("modelNumber", value, index)
                            }
                            readOnly={false}
                        />
                    </Stack.Item>
                    <Stack.Item style={{ width: "27%" }}>
                        <DatePicker
                            placeholder="Warranty Date"
                            value={
                                (data.warrantyDate ||
                                    data.warrantyDate?.length > 0) &&
                                convertUTCDateToLocalDate(
                                    new Date(data.warrantyDate)
                                )
                            }
                            minDate={new Date(Date.now())}
                            onSelectDate={(value: Date | null | undefined) =>
                                changeHandler("warrantyDate", value, index)
                            }
                            strings={defaultDatePickerStrings}
                            style={{ width: "100%" }}
                            isRequired={categoryFieldRequired(
                                data.categoryId,
                                allCategories,
                                "Warranty"
                            )}
                            textField={{
                                onRenderSuffix: () => {
                                    if (
                                        !categoryFieldRequired(
                                            data.categoryId,
                                            allCategories,
                                            "Warranty"
                                        ) &&
                                        data.warrantyDate
                                    ) {
                                        return (
                                            <ActionButton
                                                iconProps={{
                                                    iconName:
                                                        clearIcon.iconName,
                                                }}
                                                allowDisabledFocus
                                                checked={true}
                                                onClick={() =>
                                                    changeHandler(
                                                        "warrantyDate",
                                                        undefined,
                                                        index
                                                    )
                                                }
                                                styles={actionButtonStyle}
                                            />
                                        );
                                    }
                                    return null;
                                },
                                styles: textFieldStyleOtherSource,
                            }}
                            styles={iconStyle}
                        />
                    </Stack.Item>
                    <Stack.Item style={{ width: "20%" }}>
                        <TextField
                            placeholder="Serial Number"
                            value={data.serialNumber}
                            onChange={(e, value) =>
                                changeHandler("serialNumber", value, index)
                            }
                            required={categoryFieldRequired(
                                data.categoryId,
                                allCategories,
                                "SerialNumber"
                            )}
                            errorMessage={
                                categoryFieldRequired(
                                    data.categoryId,
                                    allCategories,
                                    "SerialNumber"
                                )
                                    ? validateInput(
                                          data.serialNumber,
                                          specialCharacterRegex,
                                          true
                                      )
                                    : validateInput(
                                          data.serialNumber,
                                          specialCharacterRegex,
                                          false
                                      )
                            }
                            validateOnLoad={false}
                            validateOnFocusOut
                            readOnly={false}
                        />
                    </Stack.Item>
                    <Stack.Item style={{ width: "20%" }}>
                        <TooltipHost
                            content={
                                data?.specifications &&
                                data?.specifications?.length > 0 ? (
                                    <table
                                        style={{
                                            borderCollapse: "collapse",
                                            width: "100%",
                                        }}
                                    >
                                        <tbody>
                                            {data?.specifications
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
                            <TextField
                                placeholder="Specifications"
                                value={data.specifications}
                                onChange={(e, value) => {
                                    const newMultiline =
                                        value && value.length > 40;
                                    if (newMultiline !== multiline) {
                                        toggleMultiline();
                                    }
                                    changeHandler(
                                        "specifications",
                                        value,
                                        index
                                    );
                                }}
                                multiline={multiline}
                                validateOnLoad={false}
                                validateOnFocusOut
                                readOnly={false}
                            />
                        </TooltipHost>
                    </Stack.Item>
                    <Stack.Item style={{ width: "20%" }}>
                        <TextField
                            placeholder="Asset Tag Number"
                            value={data.assetTagNumber}
                            onChange={(e, value) =>
                                changeHandler("assetTagNumber", value, index)
                            }
                            required={categoryFieldRequired(
                                data.categoryId,
                                allCategories,
                                "AssetTagNumber"
                            )}
                            errorMessage={
                                categoryFieldRequired(
                                    data.categoryId,
                                    allCategories,
                                    "AssetTagNumber"
                                )
                                    ? validateInput(
                                          data.assetTagNumber,
                                          assetTagRegex,
                                          true
                                      )
                                    : validateInput(
                                          data.assetTagNumber,
                                          assetTagRegex,
                                          false
                                      )
                            }
                            validateOnLoad={false}
                            validateOnFocusOut
                            readOnly={false}
                        />
                    </Stack.Item>
                    <Stack.Item style={{ width: "20%" }}>
                        <TextField
                            placeholder="Asset Value"
                            value={data.assetValue?.toString()}
                            required
                            onChange={(e, value) => {
                                if (value?.toString() !== "0")
                                    changeHandler("assetValue", value, index);
                            }}
                            errorMessage={
                                showLineErrorMessage &&
                                getErrorMessage(
                                    data.assetValue,
                                    VALIDATION_TYPE.INT
                                )
                            }
                            validateOnLoad={false}
                            validateOnFocusOut
                            readOnly={false}
                        />
                    </Stack.Item>
                </Stack>
            </Stack>

            {!isReadOnly && (
                <Stack horizontal>
                    <IconButton
                        iconProps={{
                            iconName: "SkypeCircleMinus",
                            style: { color: "red" },
                        }}
                        onClick={() => minus(index)}
                    />
                    <IconButton
                        iconProps={{
                            iconName: "Copy",
                        }}
                        onClick={() => addRequest(data)}
                    />
                </Stack>
            )}
        </Stack>
    );
};

export default OtherSourceInventoryModalBody;

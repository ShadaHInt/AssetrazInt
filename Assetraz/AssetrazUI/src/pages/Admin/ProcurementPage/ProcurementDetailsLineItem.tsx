import { IconButton, IDropdownOption, Stack, TextField } from "@fluentui/react";
import { useBoolean } from "@fluentui/react-hooks";
import { FC } from "react";
import getErrorMessage, {
    VALIDATION_TYPE,
} from "../../../Other/InputValidation";
import { ProcurementProps } from "../../../types/Procurement";
import {
    IProcurementRequestContextValues,
    useProcurementRequestContext,
} from "../../../Contexts/ProcurementRequestContext";
import { SearchableDropdown } from "../../../components/common/SearchableDropdown";
import { dropdownStyles } from "./ProcurementPage.styles";

interface IProcurementLineItemProps {
    categories: IDropdownOption[];
    manfacturer: IDropdownOption[];
    data: ProcurementProps;
    showLineErrorMessage: boolean;
    isReadOnly: boolean;
    minus: (value: string) => void;
    changeHandler: (
        editingField: string,
        newValue: any,
        id?: number | string
    ) => void;
}

const ProcurementLineItem: FC<IProcurementLineItemProps> = (props: any) => {
    const {
        categories,
        manfacturer,
        data,
        showLineErrorMessage,
        minus,
        isReadOnly,
        changeHandler,
    } = props;

    const { hasUserRequest } =
        useProcurementRequestContext() as IProcurementRequestContextValues;

    const [multiline, { toggle: toggleMultiline }] = useBoolean(false);

    return (
        <Stack
            horizontal
            horizontalAlign="space-between"
            styles={{
                root: {
                    padding: "10px 0",
                },
            }}
            wrap
        >
            <Stack style={{ width: "95%" }}>
                <Stack horizontal tokens={{ childrenGap: "1%" }}>
                    <Stack.Item style={{ width: "19%" }}>
                        <SearchableDropdown
                            options={categories}
                            placeholder="Category"
                            selectedKey={data.categoryId}
                            required
                            onChange={(e, item) =>
                                changeHandler("categoryId", item?.key, data.id)
                            }
                            errorMessage={
                                showLineErrorMessage &&
                                getErrorMessage(data.categoryId)
                            }
                            disabled={isReadOnly || hasUserRequest}
                            styles={dropdownStyles}
                        />
                    </Stack.Item>
                    <Stack.Item style={{ width: "19%" }}>
                        <SearchableDropdown
                            options={manfacturer}
                            placeholder="Manufacturer"
                            selectedKey={data.manfacturerId}
                            required
                            onChange={(e, item) =>
                                changeHandler(
                                    "manfacturerId",
                                    item?.key,
                                    data.id
                                )
                            }
                            errorMessage={
                                showLineErrorMessage &&
                                getErrorMessage(data.manfacturerId)
                            }
                            disabled={isReadOnly}
                            styles={dropdownStyles}
                        />
                    </Stack.Item>
                    <Stack.Item style={{ width: "19%" }}>
                        <TextField
                            placeholder="Model number"
                            defaultValue={data.modelNumber}
                            onChange={(e, value) =>
                                changeHandler("modelNumber", value, data.id)
                            }
                            onGetErrorMessage={getErrorMessage}
                            validateOnLoad={false}
                            validateOnFocusOut={true}
                            errorMessage={
                                showLineErrorMessage &&
                                getErrorMessage(data.modelNumber)
                            }
                            readOnly={isReadOnly}
                        />
                    </Stack.Item>
                    <Stack.Item style={{ width: "19%" }}>
                        <TextField
                            placeholder="Specifications"
                            defaultValue={data.specifications}
                            onClick={() => {
                                const newMultiline =
                                    data.specifications &&
                                    data.specifications.length > 40;
                                if (newMultiline != multiline) {
                                    toggleMultiline();
                                }
                            }}
                            onChange={(e, value) => {
                                const newMultiline = value && value.length > 40;
                                if (newMultiline !== multiline) {
                                    toggleMultiline();
                                }
                                changeHandler("specifications", value, data.id);
                            }}
                            multiline={multiline}
                            onGetErrorMessage={getErrorMessage}
                            validateOnLoad={false}
                            errorMessage={
                                showLineErrorMessage &&
                                getErrorMessage(data.specifications)
                            }
                            readOnly={isReadOnly}
                        />
                    </Stack.Item>
                    <Stack.Item style={{ width: "19%" }}>
                        <TextField
                            placeholder="Quantity"
                            defaultValue={data.quantity}
                            onChange={(e, value) => {
                                changeHandler("quantity", value, data.id);
                            }}
                            validateOnLoad={false}
                            errorMessage={
                                showLineErrorMessage &&
                                getErrorMessage(
                                    data.quantity,
                                    VALIDATION_TYPE.INT
                                )
                            }
                            validateOnFocusOut
                            readOnly={isReadOnly}
                        />
                    </Stack.Item>
                </Stack>
            </Stack>

            {!isReadOnly && !hasUserRequest && (
                <Stack.Item style={{ width: "5%", textAlign: "center" }}>
                    <IconButton
                        iconProps={{
                            iconName: "SkypeCircleMinus",
                            style: { color: "red" },
                        }}
                        onClick={() => minus(data.id)}
                    />
                </Stack.Item>
            )}
        </Stack>
    );
};

export default ProcurementLineItem;

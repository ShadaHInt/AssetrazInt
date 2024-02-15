import { Dispatch, FC, SetStateAction, useState } from "react";
import { AssetDetails } from "../../../types/Asset";
import {
    CategoryFieldRequired,
    validateInput,
} from "../../Inventory/InvoiceRegister/helperFunctions";
import {
    ActionButton,
    DatePicker,
    IIconProps,
    Stack,
    StackItem,
    TextField,
    defaultDatePickerStrings,
} from "@fluentui/react";
import { convertUTCDateToLocalDate } from "../../../Other/DateFormat";
import {
    actionButtonStyle,
    iconStyle,
    textFieldStyleOtherSource,
} from "../../../components/common/DatePickerWithClearStyle";
import { assetTagRegex, specialCharacterRegex } from "./UpdateAssetConstants";

interface modaBodyProps {
    updateddAsset: AssetDetails | undefined;
    setUpdateddAsset: Dispatch<SetStateAction<AssetDetails | undefined>>;
    categories: any[];
}

//styles
const input50 = {
    root: { marginRight: "4%", width: "40%", marginBottom: "3%" },
};
export const UpdateAssetModalBody: FC<modaBodyProps> = ({
    updateddAsset,
    setUpdateddAsset,
    categories,
}) => {
    const clearIcon: IIconProps = { iconName: "Clear" };
    const [editedAsset, setEditedAsset] = useState<AssetDetails | undefined>(
        updateddAsset
    );

    const changeHandler = (
        field: string,
        value: string | undefined | Date | null
    ) => {
        let tempObj: any = {};
        tempObj = {
            ...editedAsset,
            [field]: value,
        };
        setEditedAsset({
            ...tempObj,
        });
        setUpdateddAsset({ ...tempObj });
    };

    return (
        <>
            <Stack horizontal horizontalAlign="space-between">
                <StackItem styles={input50}>
                    <TextField
                        label="Serial Number"
                        placeholder="Serial Number"
                        required={
                            editedAsset &&
                            CategoryFieldRequired(
                                editedAsset.categoryName,
                                categories,
                                "SerialNumber"
                            )
                        }
                        onChange={(e, newValue) => {
                            changeHandler("serialNumber", newValue);
                        }}
                        defaultValue={editedAsset?.serialNumber}
                        validateOnFocusOut
                        validateOnLoad={false}
                        onGetErrorMessage={(value: string) =>
                            editedAsset &&
                            CategoryFieldRequired(
                                editedAsset.categoryName,
                                categories,
                                "SerialNumber"
                            )
                                ? validateInput(
                                      editedAsset.serialNumber ?? "",
                                      specialCharacterRegex,
                                      true
                                  )
                                : validateInput(
                                      editedAsset?.serialNumber ?? "",
                                      specialCharacterRegex,
                                      false
                                  )
                        }
                    />
                </StackItem>
                <StackItem styles={input50}>
                    <TextField
                        label="Model Number"
                        placeholder="Model Number"
                        onChange={(e, newValue) => {
                            changeHandler("modelNumber", newValue);
                        }}
                        defaultValue={editedAsset?.modelNumber}
                        validateOnFocusOut
                        validateOnLoad={false}
                        onGetErrorMessage={(value: string) =>
                            validateInput(
                                editedAsset?.modelNumber ?? "",
                                specialCharacterRegex,
                                false
                            )
                        }
                    />
                </StackItem>
            </Stack>
            <Stack horizontal horizontalAlign="space-between">
                <StackItem styles={input50}>
                    <DatePicker
                        label="Warranty Date"
                        placeholder="Warranty Date"
                        isRequired={
                            editedAsset &&
                            CategoryFieldRequired(
                                editedAsset.categoryName,
                                categories,
                                "Warranty"
                            )
                        }
                        value={
                            editedAsset?.warrantyDate &&
                            convertUTCDateToLocalDate(
                                new Date(editedAsset?.warrantyDate)
                            )
                        }
                        minDate={new Date(Date.now())}
                        onSelectDate={(value) => {
                            changeHandler("warrantyDate", value);
                        }}
                        strings={defaultDatePickerStrings}
                        style={{ width: "100%" }}
                        textField={{
                            onRenderSuffix: () => {
                                if (
                                    editedAsset &&
                                    !CategoryFieldRequired(
                                        editedAsset.categoryName,
                                        categories,
                                        "Warranty"
                                    ) &&
                                    editedAsset?.warrantyDate
                                ) {
                                    return (
                                        <ActionButton
                                            iconProps={{
                                                iconName: clearIcon.iconName,
                                            }}
                                            allowDisabledFocus
                                            checked={true}
                                            onClick={() => {
                                                changeHandler(
                                                    "warrantyDate",
                                                    undefined
                                                );
                                            }}
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
                </StackItem>
                <StackItem styles={input50}>
                    <TextField
                        label="Asset Tag Number"
                        placeholder="Asset Tag Number"
                        required={
                            editedAsset
                                ? CategoryFieldRequired(
                                      editedAsset.categoryName,
                                      categories,
                                      "AssetTagNumber"
                                  )
                                : false
                        }
                        onChange={(e, newValue) => {
                            changeHandler("assetTagNumber", newValue);
                        }}
                        defaultValue={editedAsset?.assetTagNumber}
                        validateOnFocusOut
                        validateOnLoad={false}
                        onGetErrorMessage={(value: string) =>
                            editedAsset &&
                            CategoryFieldRequired(
                                editedAsset.categoryName,
                                categories,
                                "AssetTagNumber"
                            )
                                ? validateInput(
                                      editedAsset.assetTagNumber ?? "",
                                      assetTagRegex,
                                      true
                                  )
                                : validateInput(
                                      editedAsset?.assetTagNumber ?? "",
                                      assetTagRegex,
                                      false
                                  )
                        }
                    />
                </StackItem>
            </Stack>
        </>
    );
};

import * as React from "react";

//Fluent & other 3rd party components
import { IColumn, TextField, TooltipHost } from "@fluentui/react";

//Components
import StyledDetailsList from "../../../components/common/StyledDetailsList";
import SingleDatePickerWithClearButton from "../../../components/common/DatePickerWithClear";
import { Tooltip } from "../../../components/common/Tooltip";

//Helper functions
import {
    convertDateToddMMMYYYFormat,
    convertUTCDateToLocalDate,
} from "../../../Other/DateFormat";
import { validateInput, CategoryFieldRequired } from "./helperFunctions";

//Types
import IAsset from "../../../types/Asset";
import { assetTagRegex } from "./AddAssetsModal";

//Regex & const
const specialCharacterRegex = /^[^a-zA-Z0-9]/;

const AddAssetsModalBody = (props: any) => {
    const {
        assets,
        setAssets,
        prevAssets,
        setEditedList,
        editedList,
        isRegistered,
        categories,
    } = props;

    const changeHandler = (id: string, fieldName: string, value: any) => {
        let editList = assets;
        let updateIndex = editList.findIndex(
            (e: IAsset) => e.inventoryId === id
        );
        let updateValue = { ...editList[updateIndex], [fieldName]: value };

        updateValue["AssetTagRequired"] = CategoryFieldRequired(
            updateValue.categoryName,
            categories,
            "AssetTagNumber"
        );

        updateValue["SerialNumberRequired"] = CategoryFieldRequired(
            updateValue.categoryName,
            categories,
            "SerialNumber"
        );

        updateValue["WarrantyRequired"] = CategoryFieldRequired(
            updateValue.categoryName,
            categories,
            "Warranty"
        );

        updateValue["Issuable"] = CategoryFieldRequired(
            updateValue.categoryName,
            categories,
            "Issuable"
        );

        editList[updateIndex] = updateValue;

        setAssets((preState: IAsset[]) =>
            preState.map((element) =>
                element.inventoryId === id
                    ? Object.assign({}, element, {
                          ...updateValue,
                          [fieldName]: value,
                      })
                    : element
            )
        );

        setEditedList((preState: IAsset[]) => {
            if (!preState.map((t: IAsset) => t.inventoryId).includes(id)) {
                let temp = preState;
                temp.push(updateValue);
                return temp;
            } else {
                return preState.map((element) =>
                    element.inventoryId === id
                        ? Object.assign({}, element, { ...updateValue })
                        : element
                );
            }
        });
    };

    const _columns: IColumn[] = [
        {
            key: "categoryName",
            name: "Category",
            fieldName: "categoryName",
            minWidth: 100,
            isResizable: true,
            onRender: (item) => (
                <Tooltip content={item.categoryName}>
                    {item.categoryName}
                </Tooltip>
            ),
        },
        {
            key: "specifications",
            name: "Specifications",
            fieldName: "specifications",
            minWidth: 100,
            isResizable: true,
            onRender: (item) => (
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
            ),
        },
        {
            key: "manufacturerName",
            name: "Manufacturer",
            fieldName: "manufacturerName",
            minWidth: 100,
            isResizable: true,
        },
        {
            key: "modelNumber",
            name: "Model Number",
            fieldName: "modelNumber",
            minWidth: 130,
            isResizable: true,
        },
        {
            key: "warrentyDate",
            name: (<>Warranty Date</>) as any,
            fieldName: "warrentyDate",
            minWidth: 170,
            isResizable: true,
            onRender: (item: IAsset) => {
                let isRequire = false;
                let isItemEdited = editedList.find(
                    (e: IAsset) => e.inventoryId === item.inventoryId
                );

                if (item.warrentyDate || isItemEdited) {
                    isRequire = true;
                }

                let categoryRequired = CategoryFieldRequired(
                    item.categoryName,
                    categories,
                    "Warranty"
                );

                if (isRegistered)
                    return item.warrentyDate
                        ? convertDateToddMMMYYYFormat(
                              convertUTCDateToLocalDate(item.warrentyDate)
                          )
                        : "";

                return (
                    <SingleDatePickerWithClearButton
                        item={item}
                        value={
                            item.warrentyDate &&
                            convertUTCDateToLocalDate(
                                new Date(item.warrentyDate)
                            )
                        }
                        isRegistered={isRegistered}
                        changeHandler={changeHandler}
                        isRequire={isRequire}
                        categoryRequired={categoryRequired}
                    />
                );
            },
        },
        {
            key: "serialNumber",
            name: (<>Serial Number</>) as any,
            fieldName: "serialNumber",
            minWidth: 150,
            isResizable: true,
            onRender: (item: IAsset) => {
                if (isRegistered) return item.serialNumber;

                return (
                    <TextField
                        onChange={(e, value) => {
                            changeHandler(
                                item.inventoryId,
                                "serialNumber",
                                value
                            );
                        }}
                        defaultValue={item.serialNumber}
                        validateOnFocusOut
                        validateOnLoad={false}
                        readOnly={isRegistered}
                        disabled={isRegistered}
                        required={CategoryFieldRequired(
                            item.categoryName,
                            categories,
                            "SerialNumber"
                        )}
                        onGetErrorMessage={(value) =>
                            CategoryFieldRequired(
                                item.categoryName,
                                categories,
                                "SerialNumber"
                            )
                                ? validateInput(
                                      item.serialNumber,
                                      specialCharacterRegex,
                                      true
                                  )
                                : validateInput(
                                      item.serialNumber,
                                      specialCharacterRegex,
                                      false
                                  )
                        }
                    />
                );
            },
        },
        {
            key: "assetTagNumber",
            name: (<>Asset Tag Number</>) as any,
            fieldName: "assetTagNumber",
            minWidth: 150,
            isResizable: true,
            onRender: (item: IAsset) => {
                if (isRegistered) return item.assetTagNumber;
                return (
                    <TextField
                        onChange={(e, value) => {
                            changeHandler(
                                item.inventoryId,
                                "assetTagNumber",
                                value
                            );
                        }}
                        defaultValue={item.assetTagNumber}
                        validateOnFocusOut
                        validateOnLoad={false}
                        readOnly={isRegistered}
                        disabled={isRegistered}
                        required={CategoryFieldRequired(
                            item.categoryName,
                            categories,
                            "AssetTagNumber"
                        )}
                        onGetErrorMessage={(value: string) =>
                            CategoryFieldRequired(
                                item.categoryName,
                                categories,
                                "AssetTagNumber"
                            )
                                ? validateInput(
                                      item.assetTagNumber,
                                      assetTagRegex,
                                      true
                                  )
                                : validateInput(
                                      item.assetTagNumber,
                                      assetTagRegex,
                                      false
                                  )
                        }
                    />
                );
            },
        },

        {
            key: "assetValue",
            name: (<>Asset Value </>) as any,
            fieldName: "assetValue",
            minWidth: 100,
            isResizable: true,
            onRender: (item: IAsset) => {
                if (isRegistered) return item.assetValue;

                return (
                    <TextField
                        onChange={(e, value) => {
                            changeHandler(
                                item.inventoryId,
                                "assetValue",
                                value
                            );
                        }}
                        defaultValue={
                            item.assetValue.toString() === "0"
                                ? ""
                                : item.assetValue.toString()
                        }
                        validateOnFocusOut
                        validateOnLoad={false}
                        readOnly={isRegistered}
                        onGetErrorMessage={(value) => {
                            let editedRecordAssetValue = prevAssets.find(
                                (p: IAsset) =>
                                    p.inventoryId === item.inventoryId
                            ).assetValue;
                            if (
                                Number(value) > Number(editedRecordAssetValue)
                            ) {
                                return "value is greater";
                            } else {
                                return "";
                            }
                        }}
                    />
                );
            },
        },
    ];

    return (
        assets && (
            <StyledDetailsList
                data={assets}
                columns={_columns}
                emptymessage="No assets found"
            />
        )
    );
};

export default AddAssetsModalBody;

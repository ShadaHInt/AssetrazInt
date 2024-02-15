import { Dispatch, FC, SetStateAction, useCallback } from "react";
import { IColumn, Stack, TextField } from "@fluentui/react";
import StyledDetailsList from "../../../components/common/StyledDetailsList";
import { reOrderLevel } from "../../../types/ReOrderLevel";
import { stackItemStyles } from "./ReorderLevelStyles";
import { fields, numericRegex } from "./ReOrderLevelConstants";

interface IReOrderLevelProps {
    editedROList: reOrderLevel[];
    setEditedROList: Dispatch<SetStateAction<reOrderLevel[]>>;
    isError: boolean;
}

const ReOrderLevelDetailsList: FC<IReOrderLevelProps> = ({
    editedROList,
    setEditedROList,
    isError,
}) => {
    const getErrorMessage = useCallback(
        (field: string, editedItem: reOrderLevel): string => {
            let editedValue: string | undefined;
            if (
                Number(editedItem?.reOrderLevel) === 0 &&
                Number(editedItem?.warningLevel) === 0 &&
                Number(editedItem?.criticalLevel) === 0
            ) {
                return "";
            }
            switch (field) {
                case fields.ReOrderLevel:
                    editedValue = editedItem.reOrderLevel.toString();

                    if (editedValue === "") return "";
                    else if (!numericRegex.test(editedValue)) {
                        return "Invalid";
                    } else if (
                        Number(editedValue) <=
                            Number(editedItem.criticalLevel) ||
                        Number(editedValue) <= Number(editedItem.warningLevel)
                    )
                        return "Invalid";
                    break;

                case fields.WarningLevel:
                    editedValue = editedItem.warningLevel.toString();

                    if (editedValue === "") return "";
                    else if (
                        Number(editedValue) === 0 &&
                        Number(editedItem.criticalLevel) === 0
                    )
                        return "";
                    else if (!numericRegex.test(editedValue)) {
                        return "Invalid";
                    } else if (
                        Number(editedValue) >=
                            Number(editedItem.reOrderLevel) ||
                        Number(editedValue) <= Number(editedItem.criticalLevel)
                    )
                        return "Invalid";
                    break;

                case fields.CriticalLevel:
                    editedValue = editedItem.criticalLevel.toString();

                    if (editedValue === "") return "";
                    else if (
                        Number(editedValue) === 0 &&
                        Number(editedItem.warningLevel) === 0
                    )
                        return "";
                    else if (!numericRegex.test(editedValue)) {
                        return "Invalid";
                    } else if (
                        Number(editedValue) >= Number(editedItem.warningLevel)
                    )
                        return "Invalid";
                    break;
            }
            return "";
        },
        []
    );

    const changeHandler = useCallback(
        (
            field: string,
            value: string | undefined,
            reOrderLevel: reOrderLevel
        ) => {
            setEditedROList((prevState: reOrderLevel[]) =>
                prevState.map((element) =>
                    element.categoryId === reOrderLevel.categoryId &&
                    element.networkCompanyId === reOrderLevel.networkCompanyId
                        ? Object.assign({}, element, {
                              [field]: value,
                          })
                        : element
                )
            );
        },
        [setEditedROList]
    );

    const _columns: IColumn[] = [
        {
            key: "categoryName",
            name: "Category",
            fieldName: "categoryName",
            minWidth: 250,
            isResizable: true,
        },
        {
            key: "reOrderLevel",
            name: "Re-Order Level",
            fieldName: "reOrderLevel",
            minWidth: 100,
            isResizable: true,
            onRender: (item: reOrderLevel) => {
                return (
                    <TextField
                        id={item.reOrderId}
                        value={item.reOrderLevel.toString()}
                        onChange={(e, newValue) =>
                            changeHandler(
                                "reOrderLevel",
                                newValue?.trim(),
                                item
                            )
                        }
                        errorMessage={
                            isError
                                ? getErrorMessage(fields.ReOrderLevel, item)
                                : ""
                        }
                        validateOnLoad={false}
                    />
                );
            },
        },
        {
            key: "warningLevel",
            name: "Warning Level",
            fieldName: "warningLevel",
            minWidth: 150,
            isResizable: true,
            onRender: (item: reOrderLevel) => {
                return (
                    <TextField
                        id={item.reOrderId}
                        value={item.warningLevel.toString()}
                        onChange={(e, newValue) =>
                            changeHandler(
                                "warningLevel",
                                newValue?.trim(),
                                item
                            )
                        }
                        errorMessage={
                            isError
                                ? getErrorMessage(fields.WarningLevel, item)
                                : ""
                        }
                        validateOnLoad={false}
                    />
                );
            },
        },
        {
            key: "criticalLevel",
            name: "Critical Level",
            fieldName: "criticalLevel",
            minWidth: 150,
            isResizable: true,
            onRender: (item: reOrderLevel) => {
                return (
                    <TextField
                        id={item.reOrderId}
                        value={item.criticalLevel.toString()}
                        onChange={(e, newValue) =>
                            changeHandler(
                                "criticalLevel",
                                newValue?.trim(),
                                item
                            )
                        }
                        errorMessage={
                            isError
                                ? getErrorMessage(fields.CriticalLevel, item)
                                : ""
                        }
                        validateOnLoad={false}
                    />
                );
            },
        },
    ];

    return (
        <Stack
            horizontal
            styles={stackItemStyles}
            horizontalAlign="space-between"
        >
            <StyledDetailsList
                data={editedROList}
                columns={_columns}
                emptymessage="Please select a network company"
            />
        </Stack>
    );
};

export default ReOrderLevelDetailsList;

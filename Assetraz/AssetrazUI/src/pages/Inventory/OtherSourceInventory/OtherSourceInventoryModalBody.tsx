//React
import { FC, useCallback } from "react";

//UI Styles
import { IColumn, IDropdownOption, Stack, TooltipHost } from "@fluentui/react";

//Components
import { OtherSourceInventoryProps } from "../../../types/OtherSourceInventory";
import StyledDetailsList from "../../../components/common/StyledDetailsList";
import OtherSourceInventoryLineItem from "./OtherSourceInventoryLineItem";
import {
    convertDateToddMMMYYYFormat,
    convertUTCDateToLocalDate,
} from "../../../Other/DateFormat";
import { ICategory } from "../../../types/Category";
import {
    IOtherSourceModalContext,
    useOtherSourceModalContext,
} from "../../../Contexts/OtherSourceModalContext";

interface IOtherSourceInventoryBodyProps {
    categories: any;
    manufacturers: IDropdownOption[] | null;
    isReadOnly: boolean;
    allCategories: any;
    showLineErrorMessage: boolean;
    categoryFieldRequired: (
        categoryId: string,
        categories: ICategory[],
        column: string
    ) => any;
}

const OtherSourceInventoryModalBody: FC<IOtherSourceInventoryBodyProps> = (
    props: any
) => {
    const {
        categories,
        manufacturers,
        isReadOnly,
        allCategories,
        showLineErrorMessage,
        categoryFieldRequired,
    } = props;

    const { otherSourceDetail: request, setOtherSourceDetail: setRequest } =
        useOtherSourceModalContext() as IOtherSourceModalContext;

    const removeRequest = (index: number) => {
        if (request && request.length > 1) {
            setRequest((prevState: OtherSourceInventoryProps[]) =>
                prevState?.filter(
                    (o: OtherSourceInventoryProps, i: number) => i !== index
                )
            );
        }
    };

    const addRequest = (data: OtherSourceInventoryProps) => {
        if (request) {
            const newLineitem: OtherSourceInventoryProps = {
                ...data,
                inventoryId: undefined,
            };
            setRequest((prevState: any) => [...prevState, newLineitem]);
        }
    };

    const changeHandler = useCallback(
        (field: string, value: any, index: number) => {
            setRequest((prevState: OtherSourceInventoryProps[]) =>
                prevState.map((element, i) => {
                    if (i === index) {
                        const updatedElement = {
                            ...element,
                            [field]: value,
                            AssetTagRequired: categoryFieldRequired(
                                element.categoryId,
                                allCategories,
                                "AssetTagNumber"
                            ),
                            SerialNumberRequired: categoryFieldRequired(
                                element.categoryId,
                                allCategories,
                                "SerialNumber"
                            ),
                            WarrantyRequired: categoryFieldRequired(
                                element.categoryId,
                                allCategories,
                                "Warranty"
                            ),
                            Issuable: categoryFieldRequired(
                                element.categoryId,
                                allCategories,
                                "Issuable"
                            ),
                        };
                        return updatedElement;
                    }
                    return element;
                })
            );
        },
        [categoryFieldRequired, allCategories, setRequest]
    );

    const _columns: IColumn[] = [
        {
            key: "categoryName",
            name: "Category Name",
            fieldName: "categoryName",
            minWidth: 100,
            maxWidth: 130,
            isResizable: true,
        },
        {
            key: "manufacturerName",
            name: "Manufacturer Name",
            fieldName: "manufacturerName",
            minWidth: 100,
            maxWidth: 130,
            isResizable: true,
        },
        {
            key: "modelNumber",
            name: "Model Number",
            fieldName: "modelNumber",
            minWidth: 100,
            maxWidth: 130,
            isResizable: true,
        },
        {
            key: "warrantyDate",
            name: "Warranty Date",
            fieldName: "warrantyDate",
            minWidth: 100,
            maxWidth: 130,
            isResizable: true,
            onRender: (item: OtherSourceInventoryProps) =>
                item.warrantyDate &&
                convertDateToddMMMYYYFormat(
                    convertUTCDateToLocalDate(item.warrantyDate)
                ),
        },
        {
            key: "serialNumber",
            name: "Serial Number",
            fieldName: "serialNumber",
            minWidth: 100,
            maxWidth: 130,
            isResizable: true,
        },
        {
            key: "specifications",
            name: "Specifications",
            fieldName: "specifications",
            minWidth: 100,
            maxWidth: 130,
            isResizable: true,
            onRender: (item: OtherSourceInventoryProps) => {
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
                                                            whiteSpace:
                                                                "normal",
                                                            wordWrap:
                                                                "break-word",
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
            key: "assetTagNumber",
            name: "Asset Tag Number",
            fieldName: "assetTagNumber",
            minWidth: 100,
            maxWidth: 130,
            isResizable: true,
        },
        {
            key: "assetValue",
            name: "Asset Value",
            fieldName: "assetValue",
            minWidth: 100,
            maxWidth: 130,
            isResizable: true,
        },
    ];

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
            {isReadOnly ? (
                <StyledDetailsList data={request ?? []} columns={_columns} />
            ) : (
                categories &&
                manufacturers &&
                request?.map(
                    (req: OtherSourceInventoryProps, index: number) => (
                        <OtherSourceInventoryLineItem
                            key={index}
                            index={index}
                            categories={categories}
                            manufacturers={manufacturers}
                            data={req}
                            showLineErrorMessage={showLineErrorMessage}
                            allCategories={allCategories}
                            minus={removeRequest}
                            addRequest={addRequest}
                            changeHandler={changeHandler}
                            categoryFieldRequired={categoryFieldRequired}
                            isReadOnly={isReadOnly}
                        />
                    )
                )
            )}
        </Stack>
    );
};

export default OtherSourceInventoryModalBody;

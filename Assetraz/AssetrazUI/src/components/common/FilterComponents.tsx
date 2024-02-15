import React, { FC, useCallback, useState } from "react";
import {
    Callout,
    DefaultButton,
    Dropdown,
    IDropdownOption,
    IDropdownStyles,
    Label,
    Stack,
    StackItem,
} from "@fluentui/react";
import { DateRangePicker, Range } from "react-date-range";

const DROPDOWNSTYLES: Partial<IDropdownStyles> = {
    dropdown: { width: 200, border: "none", marginRight: "20px" },
};

export interface IFilterPropsDashboard {
    type: "search" | "dropdown" | "date";
    label: string;
    placeholder: string;
    options?: IDropdownOption[];
    onChange?: (event?: any, item?: IDropdownOption<any> | undefined) => void;
    defaultSelectedKey?: string | number | undefined;
    selectedKey?: string | number;
    selectedRange?: Range | undefined;
    text?: string;
    dateRangeAnchorId?: string | undefined;
}

interface IFilterComponentProps {
    filterProps?: IFilterPropsDashboard[];
}

const FilterComponents: FC<IFilterComponentProps> = ({
    filterProps = [],
    children,
}) => {
    const [isDateRangePickerVisible, setIsDateRangePickerVisible] = useState(
        Array(filterProps.length).fill(false)
    );

    const handleDropdownChange = useCallback(
        (
            index: number,
            event: React.FormEvent<HTMLDivElement>,
            item: IDropdownOption<any> | undefined
        ): void => {
            const filter = filterProps[index];
            if (filter.onChange) {
                filter.onChange(event, item);
            }
        },
        [filterProps]
    );

    const toggleIsDateRangePickerVisible = (index: any) => {
        setIsDateRangePickerVisible((prevVisibility) => {
            const updatedVisibility = [...prevVisibility];
            updatedVisibility[index] = !updatedVisibility[index];
            return updatedVisibility;
        });
    };

    return (
        <Stack
            style={{
                width: "100%",
                backgroundColor: "#fff",
                alignItems: "center",
                marginBottom: 16,
                padding: 16,
            }}
            horizontal
            horizontalAlign="space-between"
        >
            <StackItem
                style={{
                    marginTop: "25px",
                }}
            >
                {children}
            </StackItem>
            <StackItem
                style={{
                    marginLeft: "auto",
                    marginRight: "20px",
                    display: "flex",
                }}
            >
                {filterProps.map((filter, index) => {
                    return (
                        filter.type === "date" && (
                            <Stack
                                key={index}
                                style={{
                                    width: 200,
                                    marginBottom: "1em",
                                    minWidth: "175px",
                                    marginRight: "20px",
                                }}
                            >
                                <Label>{filter.label}</Label>
                                <DefaultButton
                                    styles={{
                                        label: {
                                            fontWeight: 400,
                                            color: "#666666",
                                        },
                                    }}
                                    id={filter.dateRangeAnchorId}
                                    onClick={() =>
                                        toggleIsDateRangePickerVisible(index)
                                    }
                                    text={filter.text}
                                    placeholder={filter.placeholder}
                                />
                                {isDateRangePickerVisible[index] && (
                                    <Callout
                                        role="dialog"
                                        target={`#${filter.dateRangeAnchorId}`}
                                        onDismiss={() =>
                                            toggleIsDateRangePickerVisible(
                                                index
                                            )
                                        }
                                        setInitialFocus
                                    >
                                        <DateRangePicker
                                            key={filter.dateRangeAnchorId}
                                            onChange={filter.onChange}
                                            moveRangeOnFirstSelection={false}
                                            months={2}
                                            ranges={
                                                filter.selectedRange
                                                    ? [filter.selectedRange]
                                                    : []
                                            }
                                            direction="horizontal"
                                        />
                                    </Callout>
                                )}
                            </Stack>
                        )
                    );
                })}

                {filterProps.map(
                    (filter, index) =>
                        filter.type === "dropdown" && (
                            <Dropdown
                                key={index}
                                placeholder={filter.placeholder}
                                label={filter.label}
                                selectedKey={filter.selectedKey ?? ""}
                                options={filter.options ?? []}
                                onChange={(event, item) =>
                                    handleDropdownChange(index, event, item)
                                }
                                styles={DROPDOWNSTYLES}
                            />
                        )
                )}
            </StackItem>
        </Stack>
    );
};

export default FilterComponents;

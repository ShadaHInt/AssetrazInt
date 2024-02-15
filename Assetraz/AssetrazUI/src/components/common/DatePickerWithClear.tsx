import {
    DatePicker,
    ActionButton,
    defaultDatePickerStrings,
    IIconProps,
} from "@fluentui/react";
import {
    actionButtonStyle,
    iconStyle,
    textFieldStyle,
} from "./DatePickerWithClearStyle";

const clearIcon: IIconProps = { iconName: "Clear" };

const SingleDatePickerWithClearButton = (props: {
    item: any;
    isRegistered: boolean;
    changeHandler: (id: string, field: string, value: any) => void;
    isRequire: boolean;
    categoryRequired: boolean;
    value: Date;
}) => {
    const {
        item,
        isRegistered,
        changeHandler,
        isRequire,
        categoryRequired,
        value,
    } = props;

    const onClearButtonClick = () => {
        changeHandler(item.inventoryId, "warrentyDate", undefined);
    };

    const onDateChange = (date: Date | null | undefined) => {
        changeHandler(item.inventoryId, "warrentyDate", date || undefined);
    };

    return (
        <DatePicker
            value={value}
            minDate={new Date(Date.now())}
            onSelectDate={onDateChange}
            strings={defaultDatePickerStrings}
            style={{ width: "100%" }}
            isRequired={isRequire && categoryRequired}
            disabled={isRegistered}
            textField={{
                onRenderSuffix: () => {
                    if (!categoryRequired && value) {
                        return (
                            <ActionButton
                                iconProps={{
                                    iconName: clearIcon.iconName,
                                }}
                                allowDisabledFocus
                                checked={true}
                                onClick={onClearButtonClick}
                                styles={actionButtonStyle}
                            />
                        );
                    }
                    return null;
                },
                styles: textFieldStyle,
            }}
            styles={iconStyle}
        />
    );
};

export default SingleDatePickerWithClearButton;

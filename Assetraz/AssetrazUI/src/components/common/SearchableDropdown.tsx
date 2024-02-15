import React, { useEffect, useState } from "react";
import {
    Dropdown,
    DropdownMenuItemType,
    IDropdownOption,
    IDropdownProps,
    IRenderFunction,
    SearchBox,
    Spinner,
    SpinnerSize,
    Stack,
} from "@fluentui/react";
import { spinnerStyle } from "./LoadingSpinner";

export const SearchableDropdown: React.FC<IDropdownProps> = (props) => {
    const [searchText, setSearchText] = React.useState<string>("");
    const [touched, setTouched] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (props.selectedKey || props.selectedKeys) {
            setError(false);
        } else {
            setError(true);
        }
    }, [props.selectedKey, props.selectedKeys]);

    const renderOption = (option: IDropdownOption) => {
        return option.itemType === DropdownMenuItemType.Header &&
            option.key === "FilterHeader" ? (
            <Stack
                style={{
                    position: "fixed",
                    backgroundColor: "white",
                    zIndex: 1,
                    width: "90%",
                }}
            >
                <SearchBox
                    onChange={(ev, newValue) =>
                        setSearchText(newValue as string)
                    }
                    underlined={true}
                    placeholder="Search options"
                />
            </Stack>
        ) : option.key === "loader" ? (
            <Spinner
                size={SpinnerSize.small}
                className={spinnerStyle.spinner}
            />
        ) : (
            <>{option.text}</>
        );
    };

    const filteredOptions = React.useMemo(() => {
        if (!props.options) {
            return [
                {
                    key: "loader",
                    text: "",
                    itemType: DropdownMenuItemType.Normal,
                },
            ];
        }
        const filtered = props.options.filter(
            (option) =>
                !option.disabled &&
                option?.text?.toLowerCase().includes(searchText?.toLowerCase())
        );

        const options = [
            {
                key: "FilterHeader",
                text: "-",
                itemType: DropdownMenuItemType.Header,
            },
            {
                key: "divider_filterHeader",
                text: "-",
                itemType: DropdownMenuItemType.Divider,
            },
            ...filtered,
        ];

        if (filtered.length === 0) {
            options.push({
                key: "emptyMessage",
                text: "No matching options",
                itemType: DropdownMenuItemType.Normal,
            });
        }

        return options;
    }, [props.options, searchText]);

    return (
        <Dropdown
            {...props}
            options={filteredOptions}
            calloutProps={{
                shouldRestoreFocus: false,
                setInitialFocus: false,
                calloutMaxHeight: 300,
            }}
            onRenderOption={renderOption as IRenderFunction<IDropdownOption>}
            onDismiss={() => setSearchText("")}
            onBlur={() => setTouched(true)}
            errorMessage={
                props.required && touched && error
                    ? props.errorMessage
                    : undefined
            }
        />
    );
};

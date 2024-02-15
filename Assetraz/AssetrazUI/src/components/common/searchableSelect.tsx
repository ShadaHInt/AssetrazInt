import React, { useState, useEffect } from "react";
import Select from "react-select";
import { mergeStyleSets } from "@fluentui/react";

export interface Option {
    label: string;
    value: string;
}

interface Props {
    options: Option[];
    onChange: (selectedOption: Option | null) => void;
    value: Option | null;
    name: string;
    isDisabled: boolean;
    placeholder: string;
    isRequired: boolean;
    errorMessage: string;
}

const contentStyles = mergeStyleSets({
    title: {
        fontSize: "14px",
        fontWeight: "600",
        color: "rgb(50, 49, 48)",
        boxSizing: "border-box",
        boxShadow: "none",
        margin: "0px",
        display: "block",
        overflowWrap: "break-word",
        position: "relative",
    },

    required: {
        "&::after": {
            // eslint-disable-next-line quotes
            content: '"  *"',
            color: "rgb(164, 38, 44)",
        },
    },
});

const customStyles = {
    control: (base: any, state: any) => ({
        ...base,
        borderRadius: "2px",
        minHeight: "32px",
        maxHeight: "32px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: state.isFocused ? "0 0 0 1px blue" : 0,
        borderColor:"black",
    }),
    option: (base: any, state: any) => ({
        ...base,
        backgroundColor: state.isSelected ? "rgb(237, 235, 233)" : "white",
        color: "black",
        "&:hover": {
            backgroundColor: "rgb(237, 235, 233)",
            color: "black",
        },
    }),
    dropdownIndicator: (base: any) => ({
        ...base,
        padding: "10px",
        "& svg": {
            width: "10px",
            height: "10px",
            fill: "#ccc",
        },
    }),
};

const IndicatorSeparator = () => null;

const SearchableSelect: React.FC<Props> = ({
    options,
    onChange,
    value,
    name,
    isDisabled = false,
    placeholder,
    isRequired = false,
    errorMessage = null,
}) => {
    const [selectedOption, setSelectedOption] = useState<Option | null>(value);
    const [touched, setTouched] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        setSelectedOption(value);
    }, [value]);

    const handleChange = (selected: Option | null) => {
        setSelectedOption(selected);
        setError(false);
        onChange(selected);
    };

    const handleBlur = () => {
        setTouched(true);
        if (!selectedOption?.label && !selectedOption?.value) {
            setError(true);
        }
    };

    const filterOption = (option: any, inputValue: string): boolean =>
        (
            option.label
                .toLocaleLowerCase()
                .toString()
                .match(inputValue.toLocaleLowerCase()) || []
        ).length > 0;

    return (
        <div>
            <label 
            id="SearchableSelectLabelId" 
            className={`${contentStyles.title} ${
                    isRequired ? contentStyles.required : ""
                }`}
                >
                {name}
            </label>
            <Select
                options={options}
                value={selectedOption}
                onChange={handleChange}
                className="basic-single margin-top4"
                classNamePrefix="select"
                styles={customStyles}
                placeholder={placeholder}
                components={{ IndicatorSeparator }}
                isDisabled={isDisabled}
                filterOption={filterOption}
                required={isRequired}
                onBlur={handleBlur}
            />
            {touched && error && isRequired && (
                <div className="errorMessage">{errorMessage}</div>
            )}
        </div>
    );
};

export default SearchableSelect;

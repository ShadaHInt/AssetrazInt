import { IDropdownOption } from "@fluentui/react";

export const statusOptions = {
    all: "All",
    true: "Taken to Stock",
    false: "Not Taken to Stock",
};

export const DEFAULT_NETWORK_COMPANY = "valorem";

export const DROPDOWN_INITIALOPTION = {
    key: "All Companies",
    text: "All Companies",
};

export const dropdownOptions: IDropdownOption<any>[] = Object.entries(
    statusOptions
).map(([key, text]) => ({
    key,
    text,
}));


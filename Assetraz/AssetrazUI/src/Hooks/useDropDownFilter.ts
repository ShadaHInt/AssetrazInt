import { IDropdownOption } from "@fluentui/react";
import { useState } from "react";

const useDropDownFilter = () => {
    const [selectedFilter, setSelectedFilter] = useState<string[]>([]);

    const onFilterChangeHandler = (e: any, item?: IDropdownOption) => {
        if (item) {
            setSelectedFilter((prevState) =>
                item.selected
                    ? [...prevState, item.key as string]
                    : prevState.filter((key) => key !== item.key)
            );
        }
    };

    return { selectedFilter, onFilterChangeHandler, setSelectedFilter };
};
export default useDropDownFilter;

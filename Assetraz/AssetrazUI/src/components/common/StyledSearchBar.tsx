import React from "react";
import { Stack } from "@fluentui/react";
import { SearchBox } from "@fluentui/react/lib/SearchBox";

type Props = {
    onFilterChange: (filterQuery: any) => void;
};

const StyledSearchBar: React.FC<Props> = ({ onFilterChange }) => {
    const handleFilterChange = (
        event: React.ChangeEvent<HTMLInputElement> | undefined,
        newValue?: string
    ) => {
        onFilterChange(newValue ?? "");
    };

    return (
        <Stack horizontal>
            <SearchBox
                placeholder="Search"
                underlined={true}
                onChange={handleFilterChange}
            />
        </Stack>
    );
};

export default StyledSearchBar;

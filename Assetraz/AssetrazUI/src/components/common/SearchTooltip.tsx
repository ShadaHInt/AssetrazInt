type ISearchTooltip = {
    filterColumns: string[];
};

const SearchTooltip = (props: ISearchTooltip) => {
    const { filterColumns } = props;

    return (
        <div>
            <strong>Search for a keyword in the columns : </strong>
            <div>
                {Object.values(filterColumns).map((value, index) => (
                    <span key={index}>
                        {value}
                        {index !== Object.values(filterColumns).length - 1 &&
                            ", "}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default SearchTooltip;

export const getDistinctDropDownOptions = (data: any[], column: string) => {
    var mappedData = [
        ...new Set(
            data && data.map((d) => d[column]).filter((d) => d && d.length > 0)
        ),
    ];

    return mappedData.map((m) => ({
        key: m,
        text: m,
    }));
};

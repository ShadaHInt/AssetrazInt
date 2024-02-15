import {
    DetailsList,
    DetailsListLayoutMode,
    IColumn,
    SelectionMode,
    Text,
    IGroup,
    Selection,
} from "@fluentui/react";
import { detailsListStyles, gridStyles } from "./DetailsListStyles";

export const sort = <T,>(
    data: T[],
    column: IColumn,
    columns: IColumn[]
): any => {
    const newColumns: IColumn[] = columns.slice();
    const currColumn: IColumn = newColumns.filter(
        (currCol) => column.key === currCol.key
    )[0];
    newColumns.forEach((newCol: IColumn) => {
        if (newCol === currColumn) {
            currColumn.isSortedDescending = !currColumn.isSortedDescending;
            currColumn.isSorted = true;
        } else {
            newCol.isSorted = false;
            newCol.isSortedDescending = true;
        }
    });
    const newItems = _copyAndSort(
        data,
        currColumn.fieldName!,
        currColumn.isSortedDescending
    );
    return { newItems, newColumns };
};

function _copyAndSort<T>(
    items: T[],
    columnKey: string,
    isSortedDescending?: boolean
): T[] {
    const key = columnKey as keyof T;
    return items.slice().sort((a: T, b: T) => {
        const aVal = a[key];
        const bVal = b[key];
        if (aVal === "" || aVal === null || aVal === undefined) {
            return bVal === "" || bVal === null || bVal === undefined ? 0 : 1;
        } else if (bVal === "" || bVal === null || bVal === undefined) {
            return -1;
        }
        return (isSortedDescending ? aVal < bVal : aVal > bVal) ? 1 : -1;
    });
}

interface DetailsListInputs {
    data: any[];
    columns: IColumn[];
    groups?: IGroup[];
    emptymessage?: string;
    selectionMode?: string;
    onActiveItemChanged?: (
        item?: any,
        index?: number,
        // eslint-disable-next-line no-undef
        ev?: React.FocusEvent<HTMLElement>
    ) => void;
    selection?: Selection;
}

const StyledDetailsList = (props: DetailsListInputs) => {
    const {
        data,
        columns,
        emptymessage,
        groups,
        selectionMode,
        onActiveItemChanged,
        selection,
    } = props;

    const classes = detailsListStyles();

    if (emptymessage && data.length === 0) {
        return <Text variant="small">{emptymessage}</Text>;
    }

    return (
        <div className={classes.root}>
            <DetailsList
                className={classes.table}
                columns={columns}
                groups={groups}
                items={data}
                selectionMode={
                    selectionMode === "single"
                        ? SelectionMode.single
                        : SelectionMode.none
                }
                layoutMode={DetailsListLayoutMode.fixedColumns}
                styles={gridStyles}
                flexMargin={0}
                onActiveItemChanged={onActiveItemChanged}
                selection={selection}
            />
        </div>
    );
};

export default StyledDetailsList;

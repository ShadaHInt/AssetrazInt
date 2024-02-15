import {
    ActionButton,
    Callout,
    DefaultButton,
    Dropdown,
    getFocusStyle,
    getTheme,
    IColumn,
    IconButton,
    IDropdownStyles,
    IIconProps,
    ITheme,
    Label,
    List,
    mergeStyleSets,
    Panel,
    Stack,
    Text,
} from "@fluentui/react";

import { DateRangePicker, Range, RangeKeyDict } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import {
    Dispatch,
    FC,
    ReactNode,
    SetStateAction,
    useCallback,
    useEffect,
    useState,
} from "react";
import { useId, useBoolean } from "@fluentui/react-hooks";

import useService from "../../Hooks/useService";
import useDropDownFilter from "../../Hooks/useDropDownFilter";

import PageTemplate from "../../components/common/PageTemplate";
import StyledDetailsList from "../../components/common/StyledDetailsList";
import {
    ReporFilterProvider,
    useReportContext,
} from "../../Contexts/ReportFilterContext";

import { getDistinctDropDownOptions } from "./Helper";
import { convertDateToGBFormat } from "../../Other/DateFormat";
import { DownLoadFileComponent } from "../../components/common/DownloadFileComponent";

const theme: ITheme = getTheme();
const { palette, semanticColors } = theme;

const classNames = mergeStyleSets({
    itemCell: [
        getFocusStyle(theme, { inset: -1 }),
        {
            padding: "5px 0px",
            margin: "0px 2px",
            boxSizing: "border-box",
            borderBottom: `1px solid ${semanticColors.bodyDivider}`,
            display: "flex",
            selectors: {
                "&:hover": { background: palette.neutralLight },
            },
        },
    ],
    columnLine: { width: "80%", fontWeight: 600 },
    dateRangeButtonStyle: {
        width: 200,
        marginBottom: "1em",
        minWidth: "175px",
    },
});
const filterContainerTokens = {
    childrenGap: 10,
    padding: "10px 0px",
};

const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: {
        width: 200,
        border: "none",
    },
};

const configureIcon: IIconProps = { iconName: "ColumnOptions" };
const clearIcon: IIconProps = { iconName: "ClearFilter" };
const redMinusIcon: IIconProps = {
    iconName: "SkypeCircleMinus",
    style: { color: "red" },
};
const bluePlusIcon: IIconProps = {
    iconName: "CirclePlus",
    style: { color: "0078D4" },
};
const syncIcon = {
    iconName: "Sync",
};

interface IColumnPanelProps {
    allColumns: IColumn[];
    columns: IColumn[];
    setColumns: Dispatch<SetStateAction<IColumn[]>>;
    setFilter: Dispatch<SetStateAction<IFilterType[]>>;
}

interface IReportBodyProps {
    data: any[];
    columns: IColumn[];
    openPanel: () => void;
    setFilter: Dispatch<SetStateAction<IFilterType[]>>;
    filter: IFilterType[];
}

interface IReportPageTemplateProps {
    intialColumns: string[];
    reportService: Function;
    allColumns: IColumn[];
}

export interface IFilterType {
    id: string;
    state: string[] | Range;
}
export interface IFilterProps {
    id: string;
    label: string;
    placeholder: string;
    defaultDateFilter?: boolean;
    noFutureDate?: boolean;
}

interface IFilterComponent {
    filteredColumns: IFilterProps[];
    defaultDateFilter?: boolean;
    noFutureDate?: boolean;
}

export const FilterComponent: FC<IFilterComponent> = (props) => {
    const { filteredColumns, defaultDateFilter } = props;
    const { columns: visibleColumns } = useReportContext();

    let columns = filteredColumns.filter((fc) =>
        visibleColumns.map((f: IColumn) => f.key).includes(fc.id)
    );

    // id with date will be treated as date filter
    let dateFilters = columns.filter(
        (c) => c.id.toLowerCase().includes("date") || c.id.endsWith("On")
    );

    // id with non-date will be treated as dropdown filter
    let dropDownFilter = columns.filter(
        (c) => !c.id.toLowerCase().includes("date") && !c.id.endsWith("On")
    );

    return (
        <Stack horizontal wrap tokens={{ childrenGap: 10 }}>
            {dropDownFilter.map((dropDown: IFilterProps) => (
                <FilterDropdown
                    key={dropDown.id}
                    id={dropDown.id}
                    label={dropDown.label}
                    placeholder={dropDown.placeholder}
                />
            ))}
            {dateFilters.map((date) => (
                <DateFilter
                    key={date.id}
                    label={date.label}
                    id={date.id}
                    placeholder={date.placeholder}
                    defaultDateFilter={defaultDateFilter}
                    noFutureDate={date.noFutureDate as boolean}
                />
            ))}
        </Stack>
    );
};

let lastDate = new Date();
lastDate.setDate(lastDate.getDate() - 7);

const DateFilter: FC<IFilterProps> = (props) => {
    const { label, id, placeholder, defaultDateFilter, noFutureDate } = props;
    const dateRangeAnchorId = useId(`date-range-anchor-${id}`);
    let DATE_RANGE = {
        startDate: defaultDateFilter ? lastDate : undefined,
        endDate: defaultDateFilter ? new Date() : undefined,
        key: "selection",
    };

    const today = new Date();
    const startDate = new Date();
    startDate.setMonth(today.getMonth() - 1);
    const warrantyEndDate = new Date();
    warrantyEndDate.setDate(today.getDate() + 30);

    const defaultDateRange = {
        startDate: id === "warrentyDate" ? new Date() : startDate,
        endDate: id === "warrentyDate" ? warrantyEndDate : today,
        key: "selection",
    };

    const { setFilter, clear, resetFilter } = useReportContext();
    const [selectedDateRange, setSelectedDateRange] = useState<Range>(
        id === "issuedOrReturnedDate" ? DATE_RANGE : defaultDateRange
    );
    const [
        isDateRangePickerVisible,
        { toggle: toggleIsDateRangePickerVisible },
    ] = useBoolean(false);

    const handleSelect = (ranges: RangeKeyDict) => {
        setSelectedDateRange(ranges.selection);
    };

    let text = "Select date range";
    if (selectedDateRange.startDate || selectedDateRange.endDate) {
        text = `${convertDateToGBFormat(
            selectedDateRange.startDate
        )} - ${convertDateToGBFormat(selectedDateRange.endDate)}`;
    }

    useEffect(() => {
        if (clear) {
            if (id === "warrentyDate") {
                setSelectedDateRange(defaultDateRange);
            }
            if (id === "issuedOrReturnedDate") {
                setSelectedDateRange(DATE_RANGE);
            } else {
                setSelectedDateRange(defaultDateRange);
            }
            resetFilter();
        }
    }, [clear, resetFilter, setSelectedDateRange]);

    useEffect(() => {
        setFilter((prevState: IFilterType[]) => {
            var updateItem = { id, state: selectedDateRange };
            var items = [...prevState];
            var updateIndex = items.findIndex((f) => f.id === id);
            if (updateIndex >= 0) {
                items[updateIndex] = updateItem;
            } else {
                items = prevState.concat([updateItem]);
            }
            return items;
        });
    }, [id, selectedDateRange, setFilter]);

    return (
        <Stack className={classNames.dateRangeButtonStyle}>
            <Label>{label}</Label>
            <DefaultButton
                styles={{
                    label: {
                        fontWeight: 400,
                        color: "#666666",
                    },
                }}
                id={dateRangeAnchorId}
                onClick={toggleIsDateRangePickerVisible}
                text={text}
                placeholder={placeholder}
            />
            {isDateRangePickerVisible && (
                <Callout
                    role="dialog"
                    target={`#${dateRangeAnchorId}`}
                    onDismiss={toggleIsDateRangePickerVisible}
                    setInitialFocus
                >
                    <DateRangePicker
                        onChange={handleSelect}
                        moveRangeOnFirstSelection={false}
                        maxDate={noFutureDate ? new Date() : undefined}
                        months={2}
                        ranges={[selectedDateRange]}
                        direction="horizontal"
                    />
                </Callout>
            )}
        </Stack>
    );
};

const FilterDropdown: FC<IFilterProps> = (props) => {
    const { id, label, placeholder } = props;

    const { data, setFilter, clear, resetFilter } = useReportContext();
    const options = getDistinctDropDownOptions(data, id);
    const { selectedFilter, onFilterChangeHandler, setSelectedFilter } =
        useDropDownFilter();

    useEffect(() => {
        if (clear) {
            setSelectedFilter([]);
            resetFilter();
        }
    }, [clear, resetFilter, setSelectedFilter]);

    useEffect(() => {
        setFilter((prevState: IFilterType[]) => {
            var updateItem = { id, state: selectedFilter };
            var items = [...prevState];
            var updateIndex = items.findIndex((f) => f.id === id);
            if (updateIndex >= 0) {
                items[updateIndex] = updateItem;
            } else {
                items = prevState.concat([updateItem]);
            }
            return items;
        });
    }, [id, selectedFilter, setFilter]);

    return (
        <Dropdown
            multiSelect
            id={id}
            label={label}
            options={options}
            placeholder={placeholder}
            styles={dropdownStyles}
            selectedKeys={selectedFilter}
            onChange={onFilterChangeHandler}
        />
    );
};

const ReportBody: FC<IReportBodyProps> = (props) => {
    const { data, columns, openPanel, children, setFilter, filter } = props;

    const [clear, { setTrue: clearFilter, setFalse: resetFilter }] =
        useBoolean(false);

    let filteredData = data;

    for (var i = 0; i < filter.length; ++i) {
        const { id, state } = filter[i];
        if (!id || !state) continue;
        if (id.toLowerCase().includes("date") || id.endsWith("On")) {
            const dateFilter = state as Range;
            if (dateFilter.startDate) {
                filteredData = filteredData.filter(
                    (d) =>
                        d[id] &&
                        (dateFilter.startDate as Date) <= new Date(d[id])
                );
            }
            if (dateFilter.endDate) {
                filteredData = filteredData.filter(
                    (d) =>
                        d[id] && (dateFilter.endDate as Date) >= new Date(d[id])
                );
            }
        } else {
            if ((state as string[]).length > 0) {
                filteredData = filteredData.filter((d) =>
                    (state as string[]).includes(d[id])
                );
            }
        }
    }

    const Filter = useCallback(
        ({ downLoadFileComponent }) => {
            return (
                <Stack tokens={filterContainerTokens} style={{ width: "100%" }}>
                    <Stack
                        horizontal
                        horizontalAlign="start"
                        tokens={{ childrenGap: 10 }}
                    >
                        {children}
                    </Stack>
                    <Stack horizontal horizontalAlign="end">
                        {downLoadFileComponent}
                        <ActionButton
                            iconProps={clearIcon}
                            text="Clear filter"
                            onClick={() => {
                                setFilter([]);
                                clearFilter();
                            }}
                        />
                        <ActionButton
                            iconProps={configureIcon}
                            text="Column Options"
                            onClick={openPanel}
                        />
                    </Stack>
                </Stack>
            );
        },
        [children, setFilter, openPanel, clearFilter]
    );

    return (
        <ReporFilterProvider
            value={{ data, clear, columns, setFilter, resetFilter }}
        >
            <Filter
                downLoadFileComponent={
                    <DownLoadFileComponent
                        data={filteredData}
                        columns={columns}
                    />
                }
            />
            <StyledDetailsList
                columns={columns}
                data={filteredData}
                emptymessage="No items found"
            />
        </ReporFilterProvider>
    );
};

const PanelContent: FC<IColumnPanelProps> = (props) => {
    const { columns, setColumns, allColumns, setFilter } = props;

    const [availableColumns, setAvailableColumns] =
        useState<IColumn[]>(columns);

    const handleRemoveFilterItem = (idToRemove: string) => {
        setFilter((prevState) => prevState.filter((f) => f.id !== idToRemove));
    };

    const onRenderCellDeleteCell = (
        item?: IColumn,
        index?: number | undefined
    ): ReactNode => {
        return (
            item && (
                <Stack
                    className={classNames.itemCell}
                    data-is-focusable={true}
                    horizontal
                    key={index}
                >
                    <Text className={classNames.columnLine}>{item.name}</Text>
                    <IconButton
                        iconProps={redMinusIcon}
                        onClick={() => {
                            setAvailableColumns((prevColumns) =>
                                prevColumns.filter((c) => c.key !== item.key)
                            );
                            handleRemoveFilterItem(item.key);
                        }}
                    />
                </Stack>
            )
        );
    };

    const onRenderCellAddCell = (
        item?: IColumn,
        index?: number | undefined
    ): ReactNode => {
        return (
            item && (
                <Stack
                    className={classNames.itemCell}
                    data-is-focusable={true}
                    horizontal
                    key={index}
                >
                    <Text className={classNames.columnLine}>{item.name}</Text>
                    <IconButton
                        iconProps={bluePlusIcon}
                        onClick={() =>
                            setAvailableColumns((prevColumns) =>
                                prevColumns.concat(item)
                            )
                        }
                    />
                </Stack>
            )
        );
    };

    return (
        <Stack>
            <List
                items={availableColumns}
                onRenderCell={onRenderCellDeleteCell}
            />
            <List
                items={allColumns.filter(
                    (c) => !availableColumns.map((ac) => ac.key).includes(c.key)
                )}
                onRenderCell={onRenderCellAddCell}
            />
            <DefaultButton
                iconProps={syncIcon}
                text="Update Columns"
                onClick={() => setColumns(availableColumns)}
            />
        </Stack>
    );
};

export const ReportPageTemplate: FC<IReportPageTemplateProps> = (props) => {
    const { children, intialColumns, reportService, allColumns } = props;

    const [filter, setFilter] = useState<IFilterType[]>([]);
    const { isLoading, data, errorOccured } = useService(reportService);
    const [isPanelOpen, { setTrue: openPanel, setFalse: dismissPanel }] =
        useBoolean(false);
    const [columns, setColumns] = useState<IColumn[]>(
        allColumns.filter((a) => intialColumns.includes(a.key))
    );

    return (
        <PageTemplate
            heading=""
            isLoading={isLoading}
            errorOccured={errorOccured}
        >
            {data && !isLoading && (
                <ReportBody
                    data={data}
                    columns={columns}
                    openPanel={openPanel}
                    setFilter={setFilter}
                    filter={filter}
                >
                    {children}
                </ReportBody>
            )}
            <Panel
                headerText="Column Options"
                isOpen={isPanelOpen}
                onDismiss={dismissPanel}
                closeButtonAriaLabel="Close"
            >
                <PanelContent
                    setFilter={setFilter}
                    columns={columns}
                    setColumns={(value) => {
                        setColumns(value);
                        dismissPanel();
                    }}
                    allColumns={allColumns}
                />
            </Panel>
        </PageTemplate>
    );
};

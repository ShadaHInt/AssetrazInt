import { useMemo } from "react";

import {
    DetailsList,
    DetailsListLayoutMode,
    DetailsRow,
    IColumn,
    SelectionMode,
    Stack,
} from "@fluentui/react";

import PageTemplate from "../common/PageTemplate";
import { reOrderLevel } from "../../types/ReOrderLevel";
import { rowStyle } from "./NotificationPanelStyle";
import { detailsListStyles, gridStyles } from "../common/DetailsListStyles";

interface panelProp {
    groupedByNetworkCompany: {
        [key: string]: reOrderLevel[];
    };
}

const NotificationPanelList = (prop: panelProp) => {
    const { groupedByNetworkCompany } = prop;
    const classes = detailsListStyles();

    const _columns: IColumn[] = useMemo(
        () => [
            {
                key: "category",
                name: "Category",
                fieldName: "categoryName",
                minWidth: 125,
                isResizable: true,
            },
            {
                key: "reorderLevel",
                name: "ReOrder Level",
                fieldName: "reOrderLevel",
                minWidth: 90,
                isResizable: true,
            },
            {
                key: "available",
                name: "Available",
                fieldName: "available",
                minWidth: 60,
                isResizable: true,
            },
        ],
        []
    );

    return (
        <>
            {Object.keys(groupedByNetworkCompany).map((key) => (
                <Stack
                    key={key}
                    styles={{
                        root: {
                            marginBottom: 0,
                        },
                    }}
                >
                    <PageTemplate
                        key={key}
                        heading={
                            groupedByNetworkCompany[key]
                                ? groupedByNetworkCompany[key][0]
                                      .networkCompanyName
                                : ""
                        }
                    >
                        <div className={classes.root}>
                            <DetailsList
                                className={classes.table}
                                key={key}
                                items={groupedByNetworkCompany[key] ?? []}
                                columns={_columns}
                                selectionMode={SelectionMode.none}
                                styles={gridStyles}
                                flexMargin={0}
                                layoutMode={DetailsListLayoutMode.fixedColumns}
                                onRenderRow={(props) => {
                                    const customStyles =
                                        props && props.item && rowStyle
                                            ? rowStyle(props.item)
                                            : undefined;
                                    return (
                                        <DetailsRow
                                            {...props}
                                            item={props?.item}
                                            itemIndex={0}
                                            styles={{
                                                ...props?.styles,
                                                ...customStyles,
                                            }}
                                        />
                                    );
                                }}
                            />
                        </div>
                    </PageTemplate>
                </Stack>
            ))}
        </>
    );
};
export default NotificationPanelList;

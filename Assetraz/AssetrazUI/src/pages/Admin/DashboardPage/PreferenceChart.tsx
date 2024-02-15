import React, { useState } from "react";
import {
    DocumentCard,
    DocumentCardStatus,
    DocumentCardTitle,
    IconButton,
    Spinner,
    Stack,
} from "@fluentui/react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { deleteDashboardPreferences } from "../../../services/DashboardPreferenceService";

import {
    alignCenterStyles,
    cardStyles,
    conversationTileClass,
    customStyles,
    emojiIcon,
} from "./PreferenceChartStyles";

import { COLORS, RADIAN, NO_GRAPH_MESSAGE } from "./PreferenceConstants";
import { PreferenceType } from "./PreferenceTypes";
interface PreferenceChartProps {
    dynamicData: PreferenceType;
    refetchData: () => void;
}

export const PreferenceChart: React.FC<PreferenceChartProps> = ({
    dynamicData,
    refetchData,
}) => {
    const { issued, available, returned } = dynamicData;
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    // Create the data array
    const chartData = [
        { name: "Issued", value: issued },
        { name: "Returned", value: returned },
        { name: "Available", value: available },
    ];

    const dynamicLabels: (keyof typeof dynamicData)[] = [
        "issued",
        "returned",
        "available",
    ];

    const dynamicValues = dynamicLabels.map((label) => dynamicData[label]);

    const deletePreference = async () => {
        try {
            setIsDeleting(true);
            var deletepreference = await deleteDashboardPreferences(
                dynamicData.preferenceId
            );
            if (deletepreference) {
                refetchData();
            }
        } catch (err) {
            console.log("🚀Error", err);
        } finally {
            setIsDeleting(false);
        }
    };

    const renderCustomizedLabel = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent,
        index,
    }: any) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
            >
                {`${(percent * 100).toFixed(0)}% (${chartData[index].value})`}
            </text>
        );
    };

    const Chart = () => {
        return (
            <PieChart width={300} height={300}>
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {chartData.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                        />
                    ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="top" />
            </PieChart>
        );
    };

    const PreferenceGraph = () => {
        const shouldDisplayGraph = dynamicValues.some((value) => value !== 0);
        return shouldDisplayGraph ? (
            <Chart />
        ) : (
            <p style={alignCenterStyles}>{NO_GRAPH_MESSAGE}</p>
        );
    };

    return (
        <DocumentCard styles={cardStyles}>
            <Stack className={conversationTileClass}>
                <Stack.Item
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <DocumentCardTitle
                        title={dynamicData?.networkCompanyName ?? ""}
                        styles={{
                            root: { padding: 5 },
                        }}
                    />
                    <IconButton
                        iconProps={emojiIcon}
                        title="Close"
                        ariaLabel="Close"
                        styles={customStyles}
                        onClick={deletePreference}
                        disabled={isDeleting}
                    />
                </Stack.Item>
                {!isDeleting ? (
                    <PreferenceGraph />
                ) : (
                    <Spinner style={alignCenterStyles} />
                )}

                <Stack.Item
                    styles={{
                        root: { marginTop: "10px" },
                    }}
                >
                    <DocumentCardStatus
                        statusIcon="VennDiagram"
                        status={dynamicData.categoryName ?? ""}
                    />
                </Stack.Item>
            </Stack>
        </DocumentCard>
    );
};

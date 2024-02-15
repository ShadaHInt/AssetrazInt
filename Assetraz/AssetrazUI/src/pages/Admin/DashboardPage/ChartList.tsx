import React from "react";
import { Stack } from "@fluentui/react";
import { PreferenceChart } from "./PreferenceChart";
import { PreferenceType } from "./PreferenceTypes";

interface ChartListProps {
    preferenceData: PreferenceType[];
    refetchData: () => void;
}

export const ChartList: React.FC<ChartListProps> = React.memo(
    ({ preferenceData, refetchData }) => {
        return (
            <>
                {preferenceData.map((item, index) => (
                    <Stack.Item
                        key={item.preferenceId}
                        style={index === 0 ? { marginLeft: 20 } : {}}
                    >
                        <PreferenceChart
                            dynamicData={item}
                            refetchData={refetchData}
                        />
                    </Stack.Item>
                ))}
            </>
        );
    }
);

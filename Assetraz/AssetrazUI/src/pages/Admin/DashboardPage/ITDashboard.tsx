import { useCallback, useEffect, useState } from "react";

import { Spinner, Stack, Text } from "@fluentui/react";

import { SetPreferenceHeader } from "./PreferenceDashboardHeader";
import PageTemplate from "../../../components/common/PageTemplate";
import { ChartList } from "./ChartList";

import { getDashboardPreferences } from "../../../services/DashboardPreferenceService";

import { chartWrapper } from "./PreferenceChartStyles";
import { PreferenceType } from "./PreferenceTypes";

const ITAdminDashboard = () => {
    const [preferenceData, setData] = useState<PreferenceType[] | undefined>();
    const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
    const [isDataRefetching, setIsDataRefetching] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string | undefined>(
        ""
    );

    useEffect(() => {
        const getData = async () => {
            try {
                setIsPageLoading(true);
                var result = await getDashboardPreferences();
                if (result) setData(result);
            } catch (err) {
                setErrorMessage(err as string);
            } finally {
                setIsPageLoading(false);
            }
        };

        getData();
    }, []);

    const refetchData = useCallback(async () => {
        try {
            setIsDataRefetching(true);
            var result = await getDashboardPreferences();
            if (result) setData(result);
        } catch (err) {
            setErrorMessage(err as string);
        } finally {
            setIsDataRefetching(false);
        }
    }, []);

    return (
        <PageTemplate
            heading="Dashboard"
            isLoading={isPageLoading}
            successMessageBar={successMessage}
            setSuccessMessageBar={setSuccessMessage}
            errorMessage={errorMessage}
            clearErrorMessage={() => setErrorMessage("")}
        >
            <Stack horizontalAlign="center" style={{ width: "100%" }}>
                <SetPreferenceHeader
                    setSuccessMessage={setSuccessMessage}
                    setErrorMessage={setErrorMessage}
                    getData={refetchData}
                    preferenceLength={
                        preferenceData ? preferenceData?.length : 0
                    }
                    data={preferenceData}
                />
                <Stack
                    horizontal
                    horizontalAlign="start"
                    tokens={{ childrenGap: 20 }}
                    styles={chartWrapper}
                >
                    {isDataRefetching ? (
                        <Spinner />
                    ) : preferenceData && preferenceData.length === 0 ? (
                        <Text>
                            No preferences to show. Set preferences to view
                            preferences chart.
                        </Text>
                    ) : (
                        preferenceData && (
                            <ChartList
                                preferenceData={preferenceData}
                                refetchData={refetchData}
                            />
                        )
                    )}
                </Stack>
            </Stack>
        </PageTemplate>
    );
};

export default ITAdminDashboard;

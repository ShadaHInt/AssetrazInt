import { Pivot, PivotItem } from "@fluentui/react";
import { FC, useEffect, useState } from "react";
import ActivityReportPage from "./ActivityReport";
import AssetReportPage from "./AssetsReport";
import ProcurementReportPage from "./ProcurementReport";
import { useNavigate } from "react-router-dom";
import { UserReportDashboard } from "../Admin/UserReport/UserReportDashboard";

const ReportsPage: FC = () => {
    const [selectedTab, setSelectedTab] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const tab = new URLSearchParams(window.location.search).get("tab");
        setSelectedTab(tab || "");
    }, []);

    return (
        <Pivot
            onLinkClick={(item?: PivotItem) => {
                if (item) {
                    navigate(`?tab=${item.props.itemKey}`);
                }
                setSelectedTab(item?.props.itemKey ?? null);
            }}
            selectedKey={selectedTab}
        >
            <PivotItem headerText="Assets" itemKey="assets">
                <AssetReportPage />
            </PivotItem>
            <PivotItem headerText="Activities" itemKey="activities">
                <ActivityReportPage />
            </PivotItem>
            <PivotItem headerText="Procurements" itemKey="procurements">
                <ProcurementReportPage />
            </PivotItem>
            <PivotItem headerText="User Report" itemKey="userReports">
                <UserReportDashboard />
            </PivotItem>
        </Pivot>
    );
};

export default ReportsPage;

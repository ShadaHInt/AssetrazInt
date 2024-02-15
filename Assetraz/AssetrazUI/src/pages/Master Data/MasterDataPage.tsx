import { Pivot, PivotItem } from "@fluentui/react";
import React, { useEffect, useState } from "react";
import CategoriesPage from "./CategoriesPage";
import ManufacturersPage from "./ManufacturersPage";
import NetworkCompaniesPage from "./NetworkCompaniesPage";
import VendorsPage from "./VendorsPage/VendorsPage";
import SourcesPage from "./SourcesPage";
import ReOrderlevelPage from "./ReorderLevelPage/ReOrderLevelPage";
import { useNavigate } from "react-router-dom";

export const MasterDataPage: React.FunctionComponent<any> = () => {
    const [selectedTab, setSelectedTab] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const tab = new URLSearchParams(window.location.search).get("tab");
        setSelectedTab(tab || "");
    }, []);
    return (
        <div>
            <Pivot
                onLinkClick={(item?: PivotItem) => {
                    if (item) {
                        navigate(`?tab=${item?.props.itemKey}`);
                    }
                    setSelectedTab(item?.props.itemKey ?? null);
                }}
                selectedKey={selectedTab}
            >
                <PivotItem headerText="Categories" itemKey="categories">
                    <CategoriesPage />
                </PivotItem>
                <PivotItem headerText="Vendors" itemKey="vendors">
                    <VendorsPage />
                </PivotItem>
                <PivotItem headerText="Manufacturers" itemKey="manufacturers">
                    <ManufacturersPage />
                </PivotItem>
                <PivotItem
                    headerText="Network Companies"
                    itemKey="network-companies"
                >
                    <NetworkCompaniesPage />
                </PivotItem>
                <PivotItem headerText="Sources" itemKey="sources">
                    <SourcesPage />
                </PivotItem>
                <PivotItem
                    headerText="Re-Order Levels"
                    itemKey="re-order-level"
                >
                    <ReOrderlevelPage />
                </PivotItem>
            </Pivot>
        </div>
    );
};

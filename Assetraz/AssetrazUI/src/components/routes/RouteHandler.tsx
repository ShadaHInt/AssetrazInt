// React
import React from "react";
import { Route } from "react-router";
import { Routes, useLocation } from "react-router-dom";
import { ApprovalDashboard } from "../../pages/Approvals/ApprovalDashboard";

//Components
import Home from "../../pages/Home/Home";
import ITAdminDashboard from "../../pages/Admin/DashboardPage/ITDashboard";
import NoAccess from "../../pages/InvalidFlows/NoAccess";
import NotFound from "../../pages/InvalidFlows/NotFound";
import RequestPage from "../../pages/request/RequestPage";
import ReportsPage from "../../pages/Reports/ReportsPage";
import { MasterDataPage } from "../../pages/Master Data/MasterDataPage";
import { AssetMaintenance } from "../../pages/Admin/MaintenanceRequests/MaintenanceRequests";
import OldAssetsInvoiceRegister from "../../pages/Inventory/OldAssetsInvoiceRegister/OldAssetsInvoiceRegister";
import { OtherSourcesProvider } from "../../pages/Inventory/OtherSourceInventory/OtherSourcesProvider";
import { InvoiceRegisterProvider } from "../../pages/Inventory/InvoiceRegister/InvoiceRegisterProvider";
import  AllAssetsRegister  from "../../pages/Inventory/AllAssetsRegister/AllAssetsRegister";

import ProcurementProvider from "../../pages/Admin/ProcurementPage/ProcurementProvider";
import { ReturnedAssetProvider } from "../../pages/Inventory/ReturnedAssets/ReturnedAssetProvider";
import { PurchaseOrderProvider } from "../../pages/Admin/PurchaseOrderPage/PurchaseOrderProvider";
import { InsuredAssetsProvider } from "../../pages/Inventory/InsuredAssetsProvider";
import { IssuableAssetProvider } from "../../pages/request/IssuableAssetProvider";
import { ScrapListProvider } from "../../pages/Inventory/ScrapList/ScrapListProvider";
import { UserRequestProvider } from "../../pages/Admin/UserRequestsPage/UserRequestProvider";
import { EmployeeAssetsDashboard } from "../../pages/Admin/EmployeeAssets/EmployeeAssetsDashboard";
import { AssignedRolesDashboard } from "../../pages/Admin/AssignedRoles/AssignedRolesDashboard";
import { ROLES } from "../../constants/UserRoles";

//context
import {
    IGPContext,
    useGeneralPageContext,
} from "../../Contexts/GeneralPageContext";
import { UpdateAssetsProvider } from "../../pages/Admin/UpdateAssets/UpdateAssetsProvider";
import { UserReportDashboard } from "../../pages/Admin/UserReport/UserReportDashboard";

interface LocationState {
    itrequestNumber?: string | undefined;
    userRequestNumber?: string | undefined;
}

const RouteHandler: React.FunctionComponent = () => {
    const location = useLocation() as { state: LocationState };
    const requestNumber = location.state?.itrequestNumber;
    const userRequestNumber = location.state?.userRequestNumber;
    const { isUserRolesActive, selectedRole, currentUserRoles } =
        useGeneralPageContext() as IGPContext;

    const isAccountAdmin = () => {
        const accessibleRoles = [ROLES.ACCOUNTS_EXECUTIVE];
        if (isUserRolesActive)
            return (
                selectedRole && accessibleRoles.includes(selectedRole?.userRole)
            );
        return currentUserRoles.some((role) => accessibleRoles.includes(role));
    };

    const canAccessIssueReturnPage = () => {
        const accessibleRoles = [ROLES.IT_ADMIN];
        if (isUserRolesActive)
            return (
                selectedRole && accessibleRoles.includes(selectedRole?.userRole)
            );
        return currentUserRoles.some((role) => accessibleRoles.includes(role));
    };
    const canAccessAssignRolesPage = () => {
        const accessibleRoles = [ROLES.ADMINISTRATOR];
        return selectedRole && accessibleRoles.includes(selectedRole?.userRole);
    };
    const canAccessInsuredAssetPage = () => {
        const accessibleRoles = [ROLES.OPS_EXECUTIVE];
        if (isUserRolesActive)
            return (
                selectedRole && accessibleRoles.includes(selectedRole?.userRole)
            );
        return currentUserRoles.some((role) => accessibleRoles.includes(role));
    };
    const canAccessApprovalsPage = () => {
        const accessibleRoles = [ROLES.SUPERVISOR, ROLES.PROCUREMENT_APPROVER];
        if (isUserRolesActive)
            return (
                selectedRole && accessibleRoles.includes(selectedRole?.userRole)
            );
        return currentUserRoles.some((role) => accessibleRoles.includes(role));
    };

    const canAccessUpdateAssetsPage = () => {
        const accessibleRoles = [ROLES.IT_ADMIN_MANAGER];
        if (isUserRolesActive)
            return (
                selectedRole && accessibleRoles.includes(selectedRole?.userRole)
            );
        return currentUserRoles.some((role) => accessibleRoles.includes(role));
    };

    const isOnlyAccountsAdmin =
        selectedRole?.userRole === ROLES.ACCOUNTS_EXECUTIVE;

    return (
        <Routes>
            {/* Common pages */}
            <Route path="/request" element={<RequestPage />} />
            {/* Role specific pages (While updating the routes , Please update the routes with role based condition checks ) */}
            <Route
                path="/"
                element={
                    isUserRolesActive ? (
                        selectedRole?.userRole === ROLES.IT_ADMIN ? (
                            <ITAdminDashboard />
                        ) : (
                            <Home />
                        )
                    ) : currentUserRoles.some(
                          (role) => role === ROLES.IT_ADMIN
                      ) ? (
                        <ITAdminDashboard />
                    ) : (
                        <Home />
                    )
                }
            />
            <Route
                path="/approvals/"
                element={
                    canAccessApprovalsPage() ? (
                        <ApprovalDashboard
                            isUserRolesActive={isUserRolesActive}
                            currentUserRoles={currentUserRoles}
                            selectedRole={selectedRole}
                        />
                    ) : (
                        <NoAccess />
                    )
                }
            >
                <Route
                    path=":route/:id"
                    element={
                        canAccessApprovalsPage() ? (
                            <ApprovalDashboard
                                isUserRolesActive={isUserRolesActive}
                                currentUserRoles={currentUserRoles}
                                selectedRole={selectedRole}
                            />
                        ) : (
                            <NoAccess />
                        )
                    }
                />
            </Route>
            <Route
                path="/issue-return"
                element={
                    canAccessIssueReturnPage() ? (
                        <IssuableAssetProvider />
                    ) : (
                        <NoAccess />
                    )
                }
            />
            <Route
                path="/other-source-inventory"
                element={
                    canAccessIssueReturnPage() ? (
                        <OtherSourcesProvider />
                    ) : (
                        <NoAccess />
                    )
                }
            />
            <Route
                path="/stock-receipt/"
                element={
                    canAccessIssueReturnPage() || isAccountAdmin() ? (
                        <InvoiceRegisterProvider
                            isAccountsAdmin={isOnlyAccountsAdmin}
                        />
                    ) : (
                        <NoAccess />
                    )
                }
            >
                <Route
                    path=":id"
                    element={
                        canAccessIssueReturnPage() || isAccountAdmin() ? (
                            <InvoiceRegisterProvider
                                isAccountsAdmin={isOnlyAccountsAdmin}
                            />
                        ) : (
                            <NoAccess />
                        )
                    }
                ></Route>
            </Route>
            <Route
                path="/procurement"
                element={
                    canAccessIssueReturnPage() ? (
                        <ProcurementProvider
                            requestNumber={requestNumber}
                            userRequestNumber={userRequestNumber}
                        />
                    ) : (
                        <NoAccess />
                    )
                }
            />
            <Route
                path="/approved-requests"
                element={
                    canAccessIssueReturnPage() ? (
                        <UserRequestProvider />
                    ) : (
                        <NoAccess />
                    )
                }
            />
            <Route
                path="/maintenanceRequests"
                element={
                    canAccessIssueReturnPage() ? (
                        <AssetMaintenance />
                    ) : (
                        <NoAccess />
                    )
                }
            />
            <Route
                path="/returned-asset"
                element={
                    canAccessIssueReturnPage() ? (
                        <ReturnedAssetProvider />
                    ) : (
                        <NoAccess />
                    )
                }
            />
            <Route
                path="/scrap-list"
                element={
                    canAccessIssueReturnPage() ? (
                        <ScrapListProvider />
                    ) : (
                        <NoAccess />
                    )
                }
            />

            <Route
                path="/all-assets-register"
                element={
                    canAccessIssueReturnPage() ? (
                        <AllAssetsRegister 
                            isAccountsAdmin={isOnlyAccountsAdmin}
                        />
                    ) : (
                        <NoAccess />
                    )
                }
            />

            <Route
                path="/purchase-order"
                element={
                    canAccessInsuredAssetPage() ? (
                        <PurchaseOrderProvider />
                    ) : (
                        <NoAccess />
                    )
                }
            />
            <Route
                path="/employee-assets"
                element={
                    canAccessIssueReturnPage() ? (
                        <EmployeeAssetsDashboard />
                    ) : (
                        <NoAccess />
                    )
                }
            />
            <Route
                path="/user-reports"
                element={
                    canAccessIssueReturnPage() ? (
                        <UserReportDashboard />
                    ) : (
                        <NoAccess />
                    )
                }
            />
            <Route
                path="/update-assets"
                element={
                    canAccessUpdateAssetsPage() ? (
                        <UpdateAssetsProvider />
                    ) : (
                        <NoAccess />
                    )
                }
            />
            <Route
                path="/assigned-roles"
                element={
                    canAccessAssignRolesPage() && isUserRolesActive ? (
                        <AssignedRolesDashboard />
                    ) : (
                        <NoAccess />
                    )
                }
            />
            <Route
                path="/insured-asset"
                element={
                    canAccessInsuredAssetPage() ? (
                        <InsuredAssetsProvider />
                    ) : (
                        <NoAccess />
                    )
                }
            />
            <Route
                path="/old-asset"
                element={
                    canAccessIssueReturnPage() || isAccountAdmin() ? (
                        <OldAssetsInvoiceRegister
                            isAccountsAdmin={isOnlyAccountsAdmin}
                        />
                    ) : (
                        <NoAccess />
                    )
                }
            />
            <Route
                path="/master-data"
                element={
                    canAccessIssueReturnPage() ? (
                        <MasterDataPage />
                    ) : (
                        <NoAccess />
                    )
                }
            />
            <Route
                path="/reports"
                element={
                    canAccessIssueReturnPage() ? <ReportsPage /> : <NoAccess />
                }
            />
            {/* No Matching routes */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default RouteHandler;

import { Pivot, PivotItem } from "@fluentui/react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ROLES } from "../../constants/UserRoles";
import ITProcurements from "./ITProcurementList";
import { UserRequestApprovalProvider } from "./UserRequestApprovalProvider";
import { UserRole } from "../Admin/AssignedRoles/AssignedRolesTypes";

export interface IDocument {
    key: string;
    name: string;
    categoryName: string;
    manufacturerName: string;
    modelNumber: string;
    serialNumber: string;
    assetTagNumber: string;
    warrentyDate: string;
    assetStatus: string;
    emailId: string;
    issuedDate: string;
    inventoryId: string;
}

export interface IRequestDocument {
    key: string;
    name: string;
    requestID: string;
    purchaseRequestNumber: string;
    networkCompanyID: string;
    companyName: string;
    purpose: string;
    status: string;
    comments: string;
    active: boolean;
    approverName: string;
    iTRequestNumber: string;
}

export interface IDetailsListBasicExampleState {
    assetItems: IDocument[];
    requestItems: IRequestDocument[];
    selectionDetails: string;
}
interface IUserRoles {
    selectedRole: UserRole | undefined;
    isUserRolesActive: boolean | undefined;
    currentUserRoles: string[] | undefined;
}

export const ApprovalDashboard: React.FunctionComponent<IUserRoles> = ({
    selectedRole,
    isUserRolesActive,
    currentUserRoles,
}) => {
    const [selectedTab, setSelectedTab] = useState<string | null>(null);
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const tab = new URLSearchParams(window.location.search).get("tab");
        setSelectedTab(tab || "");
    }, []);

    const canAccessUserRequest = () => {
        const userRequestAccessibleRoles = ROLES.SUPERVISOR;
        if (isUserRolesActive) {
            return (
                selectedRole &&
                userRequestAccessibleRoles.includes(selectedRole.userRole)
            );
        }
        return (
            currentUserRoles &&
            currentUserRoles.some((role) =>
                userRequestAccessibleRoles.includes(role)
            )
        );
    };

    const canAccessITProcurements = () => {
        const iTProcurementsAccessibleRoles = ROLES.PROCUREMENT_APPROVER;
        if (isUserRolesActive) {
            return (
                selectedRole &&
                iTProcurementsAccessibleRoles.includes(selectedRole.userRole)
            );
        }
        return (
            currentUserRoles &&
            currentUserRoles.some((role) =>
                iTProcurementsAccessibleRoles.includes(role)
            )
        );
    };

    return (
        <div>
            <Pivot
                onLinkClick={(item?: PivotItem) => {
                    if (item) {
                        navigate(`?tab=${item.props.itemKey}`);
                    }
                    setSelectedTab(item?.props.itemKey ?? null);
                }}
                selectedKey={selectedTab}
            >
                {canAccessITProcurements() && (
                    <PivotItem
                        headerText="IT Procurements"
                        itemKey="it-procurement"
                    >
                        <ITProcurements id={params.id} />
                    </PivotItem>
                )}
                {canAccessUserRequest() && (
                    <PivotItem
                        headerText="Employee Requests"
                        itemKey="employee-request"
                    >
                        <UserRequestApprovalProvider />
                    </PivotItem>
                )}
            </Pivot>
        </div>
    );
};

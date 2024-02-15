import React from "react";
import { useEffect, useState } from "react";
import { PrimaryButton } from "@fluentui/react";
import { useAsync } from "../../../services/hooks/UseAsync";
import PageTemplate from "../../../components/common/PageTemplate";

import { userRolesType } from "./AssignedRolesTypes";
import { GetAssignedRoles } from "../../../services/AssignedRolesServices";
import { AssignedRoleModal } from "./AssignedRoleModal";
import { AssignedRolesDashboardBody } from "./AssignedRolesDashboardBody";

export const AssignedRolesDashboard: React.FC = () => {
    const {
        execute,
        status: assignedRolesStatus,
        data: assignedRolesData,
        error: isError,
    } = useAsync(GetAssignedRoles, true);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>();
    const [errorMessage, setErrorMessage] = useState<string | undefined>(
        undefined
    );

    const [selectedUserDetails, setSelectedUserDetails] = useState<
        userRolesType | undefined
    >();

    const AddInvoiceButton = () => {
        return (
            <PrimaryButton
                text=" + Assign Roles"
                styles={{
                    root: {
                        marginRight: 16,
                    },
                }}
                onClick={() => {
                    setIsModalOpen(true);
                }}
            />
        );
    };

    useEffect(() => {
        if (!isModalOpen) {
            if (selectedUserDetails) {
                setSelectedUserDetails(undefined);
            }
        }
    }, [isModalOpen, selectedUserDetails]);

    return (
        <PageTemplate
            heading="Assigned Roles"
            isLoading={assignedRolesStatus === "pending"}
            errorOccured={isError}
            headerElementRight={<AddInvoiceButton />}
            errorMessage={errorMessage}
            clearErrorMessage={() => setErrorMessage(undefined)}
            successMessageBar={successMessage}
            setSuccessMessageBar={setSuccessMessage}
        >
            <AssignedRolesDashboardBody
                assignedRolesData={assignedRolesData}
                setSelectedUserDetails={setSelectedUserDetails}
                setIsModalOpen={setIsModalOpen}
                setErrorMessage={setErrorMessage}
            />
            <AssignedRoleModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                setSuccessMessage={setSuccessMessage}
                selectedUserDetails={selectedUserDetails}
                execute={execute}
            />
        </PageTemplate>
    );
};

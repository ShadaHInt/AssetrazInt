import { useMsal } from "@azure/msal-react";
import { useEffect, useState } from "react";
import { UserRole } from "../../pages/Admin/AssignedRoles/AssignedRolesTypes";
import { IsActiveFeatureFlag } from "../../services/FeatureFlagServices";
import { FEATURE_FLAGS } from "../../constants/FeatureFlags";
import { GetAssignedRolesForUser } from "../../services/AssignedRolesServices";
import { GeneralPageContextProvider } from "../../Contexts/GeneralPageContext";
import GeneralPage from "./GeneralPage";

const GeneralPageProvider = () => {
    const { instance, accounts } = useMsal();
    const [currentUserRoles, setRoles] = useState<string[]>([]);
    const [isUserRolesActive, setIsUserRolesActive] = useState<boolean>(false);
    const [userRolesWithDefault, setUserRolesWithdefault] = useState<
        UserRole[]
    >([]);
    const [userRoleFetched, setUserRoleFetched] = useState<boolean>(false);
    const [selectedRole, setSelectedRole] = useState<UserRole>();
    const [defaultRole, setDefaultRole] = useState<UserRole>();
    const userEmail = accounts[0]?.username;

    const fetchAssignedRoles = async (keepCurrentRole?: boolean) => {
        try {
            const data = await GetAssignedRolesForUser();
            const currentRole = localStorage.getItem("selectedRole");
            setUserRoleFetched(true);
            if (data) {
                setUserRolesWithdefault(data);
                setRoles(data.map((i: UserRole) => i.userRole));
                const defaultRole = data.find((i: UserRole) => i.isDefaultRole);
                setDefaultRole(defaultRole);
                if (!keepCurrentRole && !currentRole) {
                    setSelectedRole(defaultRole);
                } else {
                    const role: UserRole = data.find(
                        (i: UserRole) => i.userRole === currentRole
                    );
                    setSelectedRole(role);
                }
            }
        } catch (err: any) {
            setUserRolesWithdefault([]);
            setRoles([]);
        }
    };

    useEffect(() => {
        const checkFeatureFlag = async () => {
            const res: any = await IsActiveFeatureFlag(
                FEATURE_FLAGS.AssignedRoles_224223
            );
            setIsUserRolesActive(res?.result);

            if (userEmail) {
                fetchAssignedRoles();
            }
        };
        checkFeatureFlag();
    }, [instance, accounts, userEmail]);

    const contextValue = {
        currentUserRoles,
        isUserRolesActive,
        userRolesWithDefault,
        userRoleFetched,
        selectedRole,
        setSelectedRole,
        defaultRole,
        setDefaultRole,
        userEmail,
        fetchAssignedRoles,
    };

    return (
        <GeneralPageContextProvider value={contextValue}>
            <GeneralPage />
        </GeneralPageContextProvider>
    );
};

export default GeneralPageProvider;

import {
    ActionButton,
    Callout,
    DirectionalHint,
    Link,
    List,
    Spinner,
    Stack,
    Text,
} from "@fluentui/react";
import { FunctionComponent, useEffect, useState } from "react";

import { EditDefaultRole } from "../../services/AssignedRolesServices";
import {
    IGPContext,
    useGeneralPageContext,
} from "../../Contexts/GeneralPageContext";

import { classNames, styles } from "./UserProfileStyles";
import { UserRole } from "../../pages/Admin/AssignedRoles/AssignedRolesTypes";
import { useNavigate } from "react-router-dom";

interface calloutProps {
    toggleIsCalloutVisible: () => void;
    handleSignOut: () => void;
    userEmail: string;
    userName: string | undefined;
}

const UserProfileCallout: FunctionComponent<calloutProps> = ({
    toggleIsCalloutVisible,
    handleSignOut,
    userEmail,
    userName,
}) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const {
        isUserRolesActive,
        setSelectedRole,
        selectedRole,
        userRolesWithDefault,
        defaultRole,
        fetchAssignedRoles,
    } = useGeneralPageContext() as IGPContext;

    useEffect(() => {
        selectedRole &&
            localStorage.setItem("selectedRole", selectedRole?.userRole);
    }, [selectedRole]);

    const onRenderCell = (
        item: UserRole | undefined,
        index: number | undefined
    ) => {
        return (
            <div
                className={classNames.itemCell}
                data-is-focusable={true}
                onClick={() => {
                    setSelectedRole(item);
                    navigate("/", { replace: true });
                }}
            >
                <Text
                    variant="medium"
                    style={{
                        fontWeight: 500,
                    }}
                >
                    {item?.userRole}
                </Text>
            </div>
        );
    };

    const updateDefaultRole = async () => {
        setIsLoading(true);
        const defaultRoleId = defaultRole?.userRoleId;
        if (selectedRole && defaultRoleId) {
            let response = await EditDefaultRole(defaultRoleId, selectedRole);
            if (response) {
                fetchAssignedRoles();
            }
            setIsLoading(false);
        }
    };

    return (
        <Callout
            ariaLabelledBy="callout-label"
            ariaDescribedBy="callout-description"
            coverTarget
            role="dialog"
            className={styles.callout}
            gapSpace={50}
            target={"#callout-button"}
            isBeakVisible={false}
            onDismiss={toggleIsCalloutVisible}
            directionalHint={DirectionalHint.topRightEdge}
            setInitialFocus
        >
            <Stack>
                <Stack horizontal horizontalAlign="space-between">
                    <Stack.Item style={{ paddingTop: 10, paddingLeft: 5 }}>
                        <Text variant="medium" style={{ fontWeight: 500 }}>
                            Valorem Reply
                        </Text>
                    </Stack.Item>
                    <Stack.Item>
                        <ActionButton
                            onClick={handleSignOut}
                            text="Sign Out"
                            style={{ padding: 5 }}
                        />
                    </Stack.Item>
                </Stack>
                <Stack horizontal tokens={{ childrenGap: 5 }}>
                    <Stack.Item>
                        <Stack style={{ padding: 5 }}>
                            <Text
                                variant="mediumPlus"
                                style={{ fontWeight: 500 }}
                            >
                                {userName}
                            </Text>
                            <Text variant="medium">{userEmail}</Text>
                            <Stack.Item></Stack.Item>
                        </Stack>
                    </Stack.Item>
                </Stack>
                {isUserRolesActive ? (
                    <>
                        <Stack>
                            <Stack.Item>
                                <Stack
                                    horizontal
                                    horizontalAlign="space-between"
                                    style={{ padding: 5, marginBottom: "20px" }}
                                >
                                    <Text
                                        variant="medium"
                                        style={{ fontStyle: "italic" }}
                                    >
                                        Role - {selectedRole?.userRole}
                                    </Text>
                                    {isLoading ? (
                                        <Spinner />
                                    ) : (
                                        <Link
                                            disabled={
                                                JSON.stringify(selectedRole) ===
                                                JSON.stringify(defaultRole)
                                            }
                                            onClick={updateDefaultRole}
                                        >
                                            Set as default
                                        </Link>
                                    )}

                                    <Stack.Item></Stack.Item>
                                </Stack>
                            </Stack.Item>
                        </Stack>
                        {userRolesWithDefault.length > 1 ? (
                            <Stack>
                                <Stack.Item>
                                    <Stack style={{ padding: 5 }}>
                                        <Text
                                            variant="medium"
                                            style={{
                                                marginBottom: "5px",
                                            }}
                                        >
                                            Switch Role:{" "}
                                        </Text>
                                        <List
                                            items={userRolesWithDefault.filter(
                                                (i: UserRole) =>
                                                    i.userRoleId !==
                                                    selectedRole?.userRoleId
                                            )}
                                            onRenderCell={onRenderCell}
                                        />
                                        <Stack.Item></Stack.Item>
                                    </Stack>
                                </Stack.Item>
                            </Stack>
                        ) : null}
                    </>
                ) : null}
            </Stack>
        </Callout>
    );
};

export default UserProfileCallout;

import React, { useEffect, useState } from "react";
import { IColumn, Link, TooltipHost, Text } from "@fluentui/react";

import StyledDetailsList from "../../../components/common/StyledDetailsList";
import { detailsListStyles } from "../ProcurementPage/ProcurementPage.styles";
import {
    IAssignedRolesDashboardBody,
    UserRole,
    userRolesType,
} from "./AssignedRolesTypes";

export const AssignedRolesDashboardBody: React.FC<
    IAssignedRolesDashboardBody
> = ({
    assignedRolesData,
    setErrorMessage,
    setSelectedUserDetails,
    setIsModalOpen,
}) => {
    const classes = detailsListStyles();

    const [groupedData, setGroupedData] = useState<userRolesType>({});

    useEffect(() => {
        const assignedRoles = async () => {
            try {
                var groupedAssignedRolesData: userRolesType = {};

                assignedRolesData?.forEach((role: any) => {
                    const {
                        userId,
                        userRoleId,
                        userRole,
                        userName,
                        userEmailId,
                        isDefaultRole,
                    }: {
                        userId: string;
                        userRoleId: number;
                        userRole: string;
                        userName: string;
                        userEmailId: string;
                        isDefaultRole: boolean;
                    } = role;

                    if (!groupedAssignedRolesData[userEmailId]) {
                        groupedAssignedRolesData[userEmailId] = {
                            userName,
                            userEmailId,
                            userRoles: [
                                { userId, userRoleId, userRole, isDefaultRole },
                            ],
                        };
                    } else {
                        groupedAssignedRolesData[userEmailId].userRoles.push({
                            userId,
                            userRoleId,
                            userRole,
                            isDefaultRole,
                        });
                    }
                });

                setGroupedData(groupedAssignedRolesData);
            } catch (error) {
                setErrorMessage(error as string);
            }
        };

        assignedRoles();
    }, [assignedRolesData, setErrorMessage]);

    const _columns: IColumn[] = [
        {
            key: "userName",
            name: "User Name",
            fieldName: "userName",
            minWidth: 150,
            isResizable: true,
            onRender: (item: userRolesType) => (
                <Link
                    onClick={() => {
                        setSelectedUserDetails(item);
                        setIsModalOpen(true);
                    }}
                >
                    {item.userName}
                </Link>
            ),
        },
        {
            key: "userEmailId",
            name: "User Email",
            fieldName: "userEmailId",
            minWidth: 150,
            isResizable: true,
        },
        {
            key: "assignedRoles",
            name: "Assigned Roles",
            fieldName: "assignedRoles",
            minWidth: 500,
            isResizable: true,
            onRender: (item) => {
                return (
                    <div className={classes.tooltip}>
                        <TooltipHost
                            content={
                                <table className={classes.table}>
                                    <thead>
                                        <tr>
                                            <th className={classes.tableData}>
                                                Assigned Roles
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {item.userRoles.map(
                                            (role: UserRole, index: number) => {
                                                return (
                                                    <tr key={role.userId}>
                                                        <td
                                                            className={
                                                                classes.tableData
                                                            }
                                                        >
                                                            {role.userRole}
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                        )}
                                    </tbody>
                                </table>
                            }
                        >
                            {item.userRoles.map(
                                (role: UserRole, index: number) => (
                                    <span key={role.userId}>
                                        <Text variant="small">
                                            {role.userRole}
                                            {index + 1 !==
                                                groupedData[item.userEmailId]
                                                    ?.userRoles.length && ", "}
                                        </Text>
                                    </span>
                                )
                            )}
                        </TooltipHost>
                    </div>
                );
            },
        },
    ];
    return (
        <StyledDetailsList
            data={Object.values(groupedData) ?? []}
            columns={_columns}
            emptymessage="No assets found"
        />
    );
};

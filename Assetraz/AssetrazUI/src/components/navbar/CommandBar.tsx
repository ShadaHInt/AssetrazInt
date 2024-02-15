//React
import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useBoolean } from "@fluentui/react-hooks";
import { useCallback, useEffect, useMemo, useState } from "react";

//UI
import {
    CommandBar,
    ICommandBarItemProps,
} from "@fluentui/react/lib/CommandBar";
import { CommandBarButton } from "@fluentui/react";

//Services
import { GetReorderLevelNotification } from "../../services/assetService";
import { IsActiveFeatureFlag } from "../../services/FeatureFlagServices";

//Authentication
import {
    useMsal,
    AuthenticatedTemplate,
    UnauthenticatedTemplate,
} from "@azure/msal-react";

import UserProfileCallout from "./UserProfileCallout";
import NotificationIcon from "./NotificationIcon";
import NotificationPanel from "./NotificationPanel";

import { CommandBarStyles } from "./CommandBarStyles";

import { PAGES, adminSubMenu, inventorySubMenu } from "./CommandBarConstants";
import { reOrderLevel } from "../../types/ReOrderLevel";
import { FEATURE_FLAGS } from "../../constants/FeatureFlags";
import { ROLES } from "../../constants/UserRoles";
import {
    IGPContext,
    useGeneralPageContext,
} from "../../Contexts/GeneralPageContext";

type isActive = {
    request: boolean;
    approvals: boolean;
    admin: boolean;
    inventory: boolean;
    masterData: boolean;
    reports: boolean;
};

const defaultActiveBar: isActive = {
    request: false,
    approvals: false,
    admin: false,
    inventory: false,
    masterData: false,
    reports: false,
};

export const NavbarCommands: React.FunctionComponent = () => {
    const navigate = useNavigate();
    const classes = CommandBarStyles();
    const { instance, accounts } = useMsal();
    const location = useLocation();

    const [isCalloutVisible, { toggle: toggleIsCalloutVisible }] =
        useBoolean(false);

    const [activeBar, setActiveBar] = useState<isActive>(defaultActiveBar);
    const [isPanelOpen, { toggle: toggleIsPanelOpen }] = useBoolean(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isUserRolesActive, setIsUserRolesActive] = useState<boolean>(false);
    const [notificationCount, setNotificationCount] = useState<number>();
    const [noticationDetails, setNotificationDetails] = useState<
        reOrderLevel[]
    >([]);

    const userName = accounts[0]?.name;
    const userEmail = accounts[0]?.username;

    const { currentUserRoles, userRoleFetched } =
        useGeneralPageContext() as IGPContext;

    useEffect(() => {
        const checkFeatureFlag = async () => {
            const res: any = await IsActiveFeatureFlag(
                FEATURE_FLAGS.AssignedRoles_224223
            );
            setIsUserRolesActive(res?.result);
        };

        checkFeatureFlag();
    }, []);

    const handleSignIn = () => {
        instance.loginRedirect({
            scopes: ["user.read"],
        });
    };

    const handleSignOut = () => {
        instance.logoutRedirect();
    };

    const getNotificationDetails = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await GetReorderLevelNotification();
            setNotificationDetails(res);
        } catch (err) {
            setNotificationDetails([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const groupedByNetworkCompany = useMemo(
        () =>
            noticationDetails?.reduce(
                (acc: { [key: string]: reOrderLevel[] }, obj) => {
                    const key = obj.networkCompanyId;
                    if (!acc[key]) {
                        acc[key] = [];
                    }
                    acc[key].push(obj);
                    return acc;
                },
                {}
            ),
        [noticationDetails]
    );

    useEffect(() => {
        if (currentUserRoles.includes(ROLES.IT_ADMIN)) {
            getNotificationDetails();
        }
    }, [currentUserRoles, getNotificationDetails]);

    useEffect(() => {
        const length = Object.keys(groupedByNetworkCompany).length;
        setNotificationCount(length);
    }, [groupedByNetworkCompany]);

    useEffect(() => {
        let updatedActiveBar: isActive;
        let currentPage = location.pathname.substring(1);
        if (adminSubMenu.includes(currentPage)) {
            updatedActiveBar = {
                ...defaultActiveBar,
                admin: true,
            };
        } else if (inventorySubMenu.includes(currentPage)) {
            updatedActiveBar = {
                ...defaultActiveBar,
                inventory: true,
            };
        } else if (currentPage === PAGES.MASTER_DATA) {
            updatedActiveBar = {
                ...defaultActiveBar,
                masterData: true,
            };
        } else {
            updatedActiveBar = {
                ...defaultActiveBar,
                [currentPage]: true,
            };
        }
        setActiveBar(updatedActiveBar);
    }, [location.pathname]);

    const getAdminSubMenu = () => {
        if (
            currentUserRoles.includes(ROLES.IT_ADMIN) &&
            currentUserRoles.includes(ROLES.OPS_EXECUTIVE)
        ) {
            if (isUserRolesActive) {
                return [
                    {
                        key: "approvedUserRequests",
                        text: "Approved Employee Requests",
                        iconProps: { iconName: "Personalize" },
                        onClick: () =>
                            navigate("/approved-requests", { replace: true }),
                    },
                    {
                        key: "itProcurement",
                        text: "IT Procurement",
                        iconProps: { iconName: "Personalize" },
                        onClick: () =>
                            navigate("/procurement", { replace: true }),
                    },
                    {
                        key: "purchaseOrder",
                        text: "Purchase Order",
                        iconProps: { iconName: "ShoppingCart" },
                        onClick: () =>
                            navigate("/purchase-order", { replace: true }),
                    },
                    // {
                    //     key: "maintenanceRequests",
                    //     text: "Maintenance Requests",
                    //     iconProps: { iconName: "Personalize" },
                    //     onClick: () =>
                    //         navigate("/maintenanceRequests", { replace: true }),
                    // },
                    {
                        key: "employeeAssets",
                        text: "Employee Assets",
                        iconProps: { iconName: "D365TalentHRCore" },
                        onClick: () =>
                            navigate("/employee-assets", { replace: true }),
                    },
                    {
                        key: "assignedRoles",
                        text: "Assigned Roles",
                        iconProps: { iconName: "Group" },
                        onClick: () =>
                            navigate("/assigned-roles", { replace: true }),
                    },
                ];
            } else {
                return [
                    {
                        key: "approvedUserRequests",
                        text: "Approved Employee Requests",
                        iconProps: { iconName: "Personalize" },
                        onClick: () =>
                            navigate("/approved-requests", { replace: true }),
                    },
                    {
                        key: "itProcurement",
                        text: "IT Procurement",
                        iconProps: { iconName: "Personalize" },
                        onClick: () =>
                            navigate("/procurement", { replace: true }),
                    },
                    {
                        key: "purchaseOrder",
                        text: "Purchase Order",
                        iconProps: { iconName: "ShoppingCart" },
                        onClick: () =>
                            navigate("/purchase-order", { replace: true }),
                    },
                    // {
                    //     key: "maintenanceRequests",
                    //     text: "Maintenance Requests",
                    //     iconProps: { iconName: "Personalize" },
                    //     onClick: () =>
                    //         navigate("/maintenanceRequests", { replace: true }),
                    // },
                    {
                        key: "employeeAssets",
                        text: "Employee Assets",
                        iconProps: { iconName: "D365TalentHRCore" },
                        onClick: () =>
                            navigate("/employee-assets", { replace: true }),
                    },
                ];
            }
        }
        if (currentUserRoles.some((role) => role === ROLES.IT_ADMIN)) {
            if (isUserRolesActive) {
                return [
                    {
                        key: "itProcurement",
                        text: "IT Procurement",
                        iconProps: { iconName: "Personalize" },
                        onClick: () =>
                            navigate("/procurement", { replace: true }),
                    },
                    {
                        key: "approvedUserRequests",
                        text: "Approved Employee Requests",
                        iconProps: { iconName: "Personalize" },
                        onClick: () =>
                            navigate("/approved-requests", { replace: true }),
                    },
                    {
                        key: "maintenanceRequests",
                        text: "Maintenance Requests",
                        iconProps: { iconName: "Personalize" },
                        onClick: () =>
                            navigate("/maintenanceRequests", { replace: true }),
                    },
                    {
                        key: "employeeAssets",
                        text: "Employee Assets",
                        iconProps: { iconName: "D365TalentHRCore" },
                        onClick: () =>
                            navigate("/employee-assets", { replace: true }),
                    },
                    {
                        key: "assignedRoles",
                        text: "Assigned Roles",
                        iconProps: { iconName: "Group" },
                        onClick: () =>
                            navigate("/assigned-roles", { replace: true }),
                    },
                ];
            } else {
                return [
                    {
                        key: "itProcurement",
                        text: "IT Procurement",
                        iconProps: { iconName: "Personalize" },
                        onClick: () =>
                            navigate("/procurement", { replace: true }),
                    },
                    {
                        key: "approvedUserRequests",
                        text: "Approved Employee Requests",
                        iconProps: { iconName: "Personalize" },
                        onClick: () =>
                            navigate("/approved-requests", { replace: true }),
                    },
                    {
                        key: "maintenanceRequests",
                        text: "Maintenance Requests",
                        iconProps: { iconName: "Personalize" },
                        onClick: () =>
                            navigate("/maintenanceRequests", { replace: true }),
                    },
                    {
                        key: "employeeAssets",
                        text: "Employee Assets",
                        iconProps: { iconName: "D365TalentHRCore" },
                        onClick: () =>
                            navigate("/employee-assets", { replace: true }),
                    },
                ];
            }
        } else if (
            currentUserRoles.some((role) => role === ROLES.OPS_EXECUTIVE)
        ) {
            return [
                {
                    key: "purchaseOrder",
                    text: "Purchase Order",
                    iconProps: { iconName: "ShoppingCart" },
                    onClick: () =>
                        navigate("/purchase-order", { replace: true }),
                },
            ];
        } else {
            return [];
        }
    };

    const getAdminMenu = () => {
        let menu = {
            key: "admin",
            text: "Admin",
            iconProps: { iconName: "Admin" },
            checked: activeBar.admin,
            subMenuProps: {
                items: getAdminSubMenu(),
            },
        };

        return menu;
    };

    const getInventorySubMenu = () => {
        if (
            currentUserRoles.includes(ROLES.IT_ADMIN) &&
            currentUserRoles.includes(ROLES.OPS_EXECUTIVE)
        ) {
            return [
                {
                    key: "confirmStockReceipt",
                    text: "Invoice Register",
                    iconProps: { iconName: "AccountActivity" },
                    subMenuProps: {
                        items: [
                            {
                                key: "confirmStockReceipt",
                                text: "Invoice Register",
                                iconProps: { iconName: "AccountActivity" },
                                onClick: () =>
                                    navigate("/stock-receipt", {
                                        replace: true,
                                    }),
                            },
                            {
                                key: "oldAssetInvoiceRegister",
                                text: "Associate Invoices (Old Asset)",
                                iconProps: { iconName: "DocumentSet" },
                                onClick: () =>
                                    navigate("/old-asset", { replace: true }),
                            },
                        ],
                    },
                },
                {
                    key: "insuredItemsList",
                    text: "Insurance Register",
                    iconProps: { iconName: "ProtectedDocument" },
                    onClick: () =>
                        navigate("/insured-asset", { replace: true }),
                },
                {
                    key: "issueReturnRegister",
                    text: "Issuable Assets Register",
                    iconProps: { iconName: "SyncFolder" },
                    onClick: () => navigate("/issue-return", { replace: true }),
                },
                {
                    key: "inventoryFromOtherSources",
                    text: "Other Source Inventory",
                    iconProps: { iconName: "TripleColumn" },
                    onClick: () =>
                        navigate("/other-source-inventory", { replace: true }),
                },
                {
                    key: "returnedAssets",
                    text: "Returned Assets",
                    iconProps: { iconName: "IssueTrackingMirrored" },
                    onClick: () =>
                        navigate("/returned-asset", { replace: true }),
                },
                {
                    key: "scrapListRegister",
                    text: "Scrap List Register",
                    iconProps: { iconName: "RecycleBin" },
                    onClick: () => navigate("/scrap-list", { replace: true }),
                },
            ];
        }
        if (currentUserRoles.some((role) => role === ROLES.IT_ADMIN)) {
            return [
                {
                    key: "confirmStockReceipt",
                    text: "Invoice Register",
                    iconProps: { iconName: "AccountActivity" },
                    subMenuProps: {
                        items: [
                            {
                                key: "confirmStockReceipt",
                                text: "Invoice Register",
                                iconProps: { iconName: "AccountActivity" },
                                onClick: () =>
                                    navigate("/stock-receipt", {
                                        replace: true,
                                    }),
                            },
                            {
                                key: "oldAssetInvoiceRegister",
                                text: "Associate Invoices (Old Asset)",
                                iconProps: { iconName: "DocumentSet" },
                                onClick: () =>
                                    navigate("/old-asset", { replace: true }),
                            },
                        ],
                    },
                },
                {
                    key: "issueReturnRegister",
                    text: "Issuable Assets Register",
                    iconProps: { iconName: "SyncFolder" },
                    onClick: () => navigate("/issue-return", { replace: true }),
                },
                {
                    key: "inventoryFromOtherSources",
                    text: "Other Source Inventory",
                    iconProps: { iconName: "TripleColumn" },
                    onClick: () =>
                        navigate("/other-source-inventory", { replace: true }),
                },
                {
                    key: "returnedAssets",
                    text: "Returned Assets",
                    iconProps: { iconName: "IssueTrackingMirrored" },
                    onClick: () =>
                        navigate("/returned-asset", { replace: true }),
                },
                {
                    key: "scrapListRegister",
                    text: "Scrap List Register",
                    iconProps: { iconName: "RecycleBin" },
                    onClick: () => navigate("/scrap-list", { replace: true }),
                },
            ];
        } else if (
            currentUserRoles.some((role) => role === ROLES.OPS_EXECUTIVE)
        ) {
            return [
                {
                    key: "insuredItemsList",
                    text: "Insurance Register",
                    iconProps: { iconName: "ProtectedDocument" },
                    onClick: () =>
                        navigate("/insured-asset", { replace: true }),
                },
            ];
        } else if (
            currentUserRoles.some((role) => role === ROLES.ACCOUNTS_EXECUTIVE)
        ) {
            return [
                {
                    key: "confirmStockReceipt",
                    text: "Invoice Register",
                    iconProps: { iconName: "AccountActivity" },
                    subMenuProps: {
                        items: [
                            {
                                key: "confirmStockReceipt",
                                text: "Invoice Register",
                                iconProps: { iconName: "AccountActivity" },
                                onClick: () =>
                                    navigate("/stock-receipt", {
                                        replace: true,
                                    }),
                            },
                            {
                                key: "oldAssetInvoiceRegister",
                                text: "Associate Invoices (Old Asset)",
                                iconProps: { iconName: "DocumentSet" },
                                onClick: () =>
                                    navigate("/old-asset", { replace: true }),
                            },
                        ],
                    },
                },
            ];
        } else {
            return [];
        }
    };

    const getInventoryMenu = () => {
        let menu = {
            key: "inventory",
            text: "Inventory",
            iconProps: { iconName: "Library" },
            checked: activeBar.inventory,
            subMenuProps: {
                items: getInventorySubMenu(),
            },
        };

        return menu;
    };

    const getReportsMenu = () => {
        let menu = {
            key: "reports",
            text: "Reports",
            iconProps: { iconName: "ReportDocument" },
            checked: activeBar.reports,
            onClick: () => navigate("/reports", { replace: true }),
        };

        return menu;
    };

    const _emptyItems: ICommandBarItemProps[] = [];

    const _items: ICommandBarItemProps[] = [
        {
            key: "request",
            text: "Request",
            iconProps: { iconName: "Home" },
            checked: activeBar.request,
            onClick: () => navigate("/request", { replace: true }),
        },
        {
            key: "approvals",
            text: "Approvals",
            iconProps: { iconName: "Completed" },
            checked: activeBar.approvals,
            onClick: () => navigate("/approvals", { replace: true }),
        },
        getAdminMenu(),
        getInventoryMenu(),
        {
            key: "masterData",
            text: "Master Data",
            iconProps: { iconName: "MasterDatabase" },
            checked: activeBar.masterData,
            onClick: () => navigate("/master-data", { replace: true }),
        },
        getReportsMenu(),
    ];

    const _farItemsUnAuthenticated: ICommandBarItemProps[] = [
        {
            key: "signin",
            text: "Sign In",
            ariaLabel: "Sign In",
            iconOnly: false,
            iconProps: { iconName: "Signin" },
            onClick: () => handleSignIn(),
        },
    ];

    const _farItemsAuthenticated: ICommandBarItemProps[] = [
        {
            key: "profile",
            ariaLabel: "profile",
            iconOnly: false,
            onClick: toggleIsCalloutVisible,
            onRender: (item) => {
                return (
                    <CommandBarButton
                        id="callout-button"
                        iconProps={{ iconName: "Contact" }}
                        text={"Hi, " + userName}
                        onClick={toggleIsCalloutVisible}
                    />
                );
            },
        },
    ];

    if (currentUserRoles.includes(ROLES.IT_ADMIN)) {
        _farItemsAuthenticated.unshift({
            key: "notification",
            ariaLabel: "notification",
            iconOnly: true,
            onClick: () => toggleIsPanelOpen(),
            onRender: (item) => {
                return (
                    <NotificationIcon
                        toggleIsPanelOpen={toggleIsPanelOpen}
                        notificationCount={notificationCount}
                    />
                );
            },
        });
    }

    const roleBasedMenuItems = () => {
        let filteredItems = _items;
        if (
            !currentUserRoles.some(
                (role) =>
                    role === ROLES.SUPERVISOR ||
                    role === ROLES.PROCUREMENT_APPROVER
            )
        ) {
            filteredItems = filteredItems.filter(
                (item) => item.key !== "approvals"
            );
        }

        if (
            !currentUserRoles.some(
                (role) =>
                    role === ROLES.IT_ADMIN || role === ROLES.OPS_EXECUTIVE
            )
        ) {
            filteredItems = filteredItems.filter(
                (item) => item.key !== "admin"
            );
        }

        if (!currentUserRoles.some((role) => role === ROLES.IT_ADMIN)) {
            filteredItems = filteredItems.filter(
                (item) => item.key !== "masterData" && item.key !== "reports"
            );
        }

        if (
            !currentUserRoles.some(
                (role) =>
                    role === ROLES.ACCOUNTS_EXECUTIVE ||
                    role === ROLES.IT_ADMIN ||
                    role === ROLES.OPS_EXECUTIVE
            )
        ) {
            filteredItems = filteredItems.filter(
                (item) => item.key !== "inventory"
            );
        }

        return filteredItems;
    };

    return (
        <>
            <AuthenticatedTemplate>
                <CommandBar
                    items={userRoleFetched ? roleBasedMenuItems() : []}
                    farItems={_farItemsAuthenticated}
                    ariaLabel="Navbar actions"
                    primaryGroupAriaLabel="Navbar actions"
                    className={classes.root}
                />
                {isPanelOpen && (
                    <NotificationPanel
                        isPanelOpen={isPanelOpen}
                        toggleIsPanelOpen={toggleIsPanelOpen}
                        notificationCount={notificationCount}
                        groupedByNetworkCompany={groupedByNetworkCompany}
                        getNotificationDetails={getNotificationDetails}
                        isLoading={isLoading}
                    />
                )}
                {isCalloutVisible && (
                    <UserProfileCallout
                        toggleIsCalloutVisible={toggleIsCalloutVisible}
                        handleSignOut={handleSignOut}
                        userEmail={userEmail}
                        userName={userName}
                    />
                )}
            </AuthenticatedTemplate>

            <UnauthenticatedTemplate>
                <CommandBar
                    items={_emptyItems}
                    farItems={_farItemsUnAuthenticated}
                    ariaLabel="Navbar actions"
                    primaryGroupAriaLabel="Navbar actions"
                    className={classes.root}
                />
            </UnauthenticatedTemplate>
        </>
    );
};

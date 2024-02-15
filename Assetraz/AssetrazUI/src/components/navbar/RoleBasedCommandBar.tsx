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

export const RoleBasedNavbarCommands: React.FunctionComponent = () => {
    const navigate = useNavigate();
    const classes = CommandBarStyles();
    const { instance, accounts } = useMsal();
    const location = useLocation();

    const [isCalloutVisible, { toggle: toggleIsCalloutVisible }] =
        useBoolean(false);
    const [activeBar, setActiveBar] = useState<isActive>(defaultActiveBar);
    const [isPanelOpen, { toggle: toggleIsPanelOpen }] = useBoolean(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [notificationCount, setNotificationCount] = useState<number>();
    const [noticationDetails, setNotificationDetails] = useState<
        reOrderLevel[]
    >([]);
    const userName = accounts[0]?.name;
    const userEmail = accounts[0]?.username;

    const { userRoleFetched, selectedRole } =
        useGeneralPageContext() as IGPContext;

    const handleSignIn = () => {
        instance.loginRedirect({
            scopes: ["user.read"],
        });
    };

    const handleSignOut = () => {
        instance.logoutRedirect();
        localStorage.removeItem("selectedRole");
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
        if (selectedRole?.userRole === ROLES.IT_ADMIN) {
            getNotificationDetails();
        }
    }, [selectedRole, getNotificationDetails]);

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

    const itAdminSubMenuItems = {
        admin: [
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
                onClick: () => navigate("/procurement", { replace: true }),
            },
            {
                key: "employeeAssets",
                text: "Employee Assets",
                iconProps: { iconName: "D365TalentHRCore" },
                onClick: () => navigate("/employee-assets", { replace: true }),
            },
        ],
        inventory: [
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
                onClick: () => navigate("/returned-asset", { replace: true }),
            },
            {
                key: "scrapListRegister",
                text: "Scrap List Register",
                iconProps: { iconName: "RecycleBin" },
                onClick: () => navigate("/scrap-list", { replace: true }),
            },
            {
                key: "allAssetsRegister",
                text: "Assets Register",
                iconProps: { iconName: "Trackers" },
                onClick: () => navigate("/all-assets-register", { replace: true }),
            },
        ],
    };

    const opsAdminSubMenuItems = {
        admin: [
            {
                key: "purchaseOrder",
                text: "Purchase Order",
                iconProps: { iconName: "ShoppingCart" },
                onClick: () => navigate("/purchase-order", { replace: true }),
            },
        ],
        inventory: [
            {
                key: "insuredItemsList",
                text: "Insurance Register",
                iconProps: { iconName: "ProtectedDocument" },
                onClick: () => navigate("/insured-asset", { replace: true }),
            },
        ],
    };

    const itAdminManagerSubMenuItems = {
        admin: [
            {
                key: "updateAssets",
                text: "Update Assets",
                iconProps: { iconName: "PageEdit" },
                onClick: () => navigate("/update-assets", { replace: true }),
            },
        ],
    };

    const administratorSubMenuItems = {
        admin: [
            {
                key: "assignedRoles",
                text: "Assigned Roles",
                iconProps: { iconName: "Group" },
                onClick: () => navigate("/assigned-roles", { replace: true }),
            },
        ],
    };

    const accountExecutiveSubMenu = {
        inventory: [
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
                    ],
                },
            },
        ],
    };

    const getAdminSubMenu = () => {
        const role = selectedRole?.userRole;
        switch (role) {
            case ROLES.IT_ADMIN:
                return itAdminSubMenuItems.admin;
            case ROLES.OPS_EXECUTIVE:
                return opsAdminSubMenuItems.admin;
            case ROLES.ADMINISTRATOR:
                return administratorSubMenuItems.admin;
            case ROLES.IT_ADMIN_MANAGER:
                return itAdminManagerSubMenuItems.admin;
            default:
                return [];
        }
    };

    const getAdminMenu = () => {
        const role = selectedRole?.userRole;
        if (
            role === ROLES.ADMINISTRATOR ||
            role === ROLES.IT_ADMIN ||
            role === ROLES.OPS_EXECUTIVE ||
            role === ROLES.IT_ADMIN_MANAGER
        ) {
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
        }
        return null;
    };

    const getInventorySubMenu = () => {
        const role = selectedRole?.userRole;
        switch (role) {
            case ROLES.IT_ADMIN:
                return itAdminSubMenuItems.inventory;
            case ROLES.OPS_EXECUTIVE:
                return opsAdminSubMenuItems.inventory;
            case ROLES.ACCOUNTS_EXECUTIVE:
                return accountExecutiveSubMenu.inventory;
            default:
                return [];
        }
    };

    const getInventoryMenu = () => {
        const role = selectedRole?.userRole;
        if (
            role === ROLES.IT_ADMIN ||
            role === ROLES.ACCOUNTS_EXECUTIVE ||
            role === ROLES.OPS_EXECUTIVE
        ) {
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
        }
        return null;
    };

    const getReportsMenu = () => {
        const role = selectedRole?.userRole;
        if (role === ROLES.IT_ADMIN) {
            let menu = {
                key: "reports",
                text: "Reports",
                iconProps: { iconName: "ReportDocument" },
                checked: activeBar.reports,
                onClick: () => navigate("/reports", { replace: true }),
            };
            return menu;
        }
        return null;
    };

    const getMasterDataMenu = () => {
        const role = selectedRole?.userRole;
        if (role === ROLES.IT_ADMIN) {
            let menu = {
                key: "masterData",
                text: "Master Data",
                iconProps: { iconName: "MasterDatabase" },
                checked: activeBar.masterData,
                onClick: () => navigate("/master-data", { replace: true }),
            };
            return menu;
        }
        return null;
    };

    const getApprovalsMenu = () => {
        const role = selectedRole?.userRole;
        if (role === ROLES.SUPERVISOR || role === ROLES.PROCUREMENT_APPROVER) {
            let menu = {
                key: "approvals",
                text: "Approvals",
                iconProps: { iconName: "Completed" },
                checked: activeBar.approvals,
                onClick: () => navigate("/approvals", { replace: true }),
            };
            return menu;
        }
        return null;
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
    ];

    const roleBasedMenuItems = (): ICommandBarItemProps[] => {
        const approvalsMenu = getApprovalsMenu();
        const adminMenus = getAdminMenu();
        const inventoryMenus = getInventoryMenu();
        const masterDataMenu = getMasterDataMenu();
        const reportMenu = getReportsMenu();
        let menuItems = [..._items];
        if (approvalsMenu) {
            menuItems.push(approvalsMenu);
        }
        if (adminMenus) {
            menuItems.push(adminMenus);
        }
        if (inventoryMenus) {
            menuItems.push(inventoryMenus);
        }
        if (masterDataMenu) {
            menuItems.push(masterDataMenu);
        }
        if (reportMenu) {
            menuItems.push(reportMenu);
        }
        return menuItems;
    };

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

    if (selectedRole?.userRole === ROLES.IT_ADMIN) {
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

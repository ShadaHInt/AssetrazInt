import { ActionButton, Panel, Stack, Text } from "@fluentui/react";

import NotificationPanelList from "./NotificationPanelList";
import LoadingSpinner from "../common/LoadingSpinner";
import { reOrderLevel } from "../../types/ReOrderLevel";

interface notificationProps {
    isPanelOpen: boolean;
    toggleIsPanelOpen: () => void;
    notificationCount: number | undefined;
    groupedByNetworkCompany: {
        [key: string]: reOrderLevel[];
    };
    getNotificationDetails: () => Promise<void>;
    isLoading: boolean;
}

const NotificationPanel = (props: notificationProps) => {
    const {
        isPanelOpen,
        toggleIsPanelOpen,
        notificationCount,
        groupedByNetworkCompany,
        getNotificationDetails,
        isLoading,
    } = props;
    return (
        <Panel
            headerText="Notifications"
            isOpen={isPanelOpen}
            onDismiss={toggleIsPanelOpen}
            styles={{
                main: {
                    minWidth: "420px",
                },
                headerText: { fontSize: 23 },
                commands: { backgroundColor: "white" },
            }}
            closeButtonAriaLabel="Close"
        >
            <Stack style={{ width: "100%" }}>
                <Stack horizontal horizontalAlign="end">
                    <ActionButton
                        iconProps={{ iconName: "Refresh" }}
                        text="Refresh"
                        onClick={getNotificationDetails}
                    />
                </Stack>
            </Stack>
            {isLoading ? (
                <LoadingSpinner />
            ) : notificationCount && notificationCount > 0 ? (
                <NotificationPanelList
                    groupedByNetworkCompany={groupedByNetworkCompany}
                />
            ) : (
                <Stack.Item>
                    <Text variant="medium">No new notifications</Text>
                </Stack.Item>
            )}
        </Panel>
    );
};

export default NotificationPanel;

import { CommandBarButton } from "@fluentui/react";
import { notificationBadgeStyle } from "./NotificationPanelStyle";

interface iconProps {
    toggleIsPanelOpen: () => void;
    notificationCount: number | undefined;
}
const NotificationIcon = (props: iconProps) => {
    const { toggleIsPanelOpen, notificationCount } = props;
    return (
        <CommandBarButton
            id="notification-button"
            iconProps={{
                iconName: "Ringer",
                style: { fontSize: 17, height: 17, marginTop: 4 },
            }}
            onClick={toggleIsPanelOpen}
            text={
                notificationCount && notificationCount > 0
                    ? notificationCount?.toString()
                    : undefined
            }
            styles={notificationBadgeStyle}
        ></CommandBarButton>
    );
};

export default NotificationIcon;

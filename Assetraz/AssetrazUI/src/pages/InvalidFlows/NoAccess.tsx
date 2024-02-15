//React
import React from "react";

// UI
import { Stack, Text } from "@fluentui/react";
import { Depths } from "@fluentui/theme";

const NoAccess = () => {
    return (
        <Stack horizontalAlign="center" verticalFill>
            <div style={{ boxShadow: Depths.depth64 }}>
                <Text variant="xxLarge">Access Denied</Text>
            </div>
        </Stack>
    );
};

export default NoAccess;

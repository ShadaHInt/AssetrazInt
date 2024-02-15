//React
import React from "react";

// UI
import { Stack, Text } from "@fluentui/react";
import { Depths } from "@fluentui/theme";

const NotFound = () => {
    return (
        <Stack horizontalAlign="center" verticalFill>
            <div style={{ boxShadow: Depths.depth64 }}>
                <Text variant="xxLarge">Page not found.</Text>
            </div>
        </Stack>
    );
};

export default NotFound;

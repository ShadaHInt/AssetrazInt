import { Stack } from "@fluentui/react";
import { Dashboard } from "../Home/Dashboard";

import { useMsal } from "@azure/msal-react";

const RequestPage = () => {
    const { accounts } = useMsal();
    const userEmail = accounts[0]?.username;

    return (
        <Stack horizontalAlign="center" verticalFill>
            <Dashboard email={userEmail} />
        </Stack>
    );
};

export default RequestPage;

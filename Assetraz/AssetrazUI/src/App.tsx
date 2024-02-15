//React
import React from "react";

//Components
import GeneralPageProvider from "./components/main/GeneralPageProvider";

//Styles
import { initializeIcons } from "@fluentui/font-icons-mdl2";
import "./App.scss";

//Authentication
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";

interface InstanceType {
    msalInstance: PublicClientApplication;
}

const App: React.FunctionComponent<InstanceType> = ({ msalInstance }) => {
    initializeIcons();

    return (
        <MsalProvider instance={msalInstance}>
            <GeneralPageProvider />
        </MsalProvider>
    );
};

export default App;

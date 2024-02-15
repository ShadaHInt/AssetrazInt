//React
import { Route } from "react-router";
import { Routes } from "react-router-dom";

//Components
import Navbar from "../navbar/Navbar";
import RouteHandler from "../routes/RouteHandler";
import Home from "../../pages/Home/Home";
import NoAccess from "../../pages/InvalidFlows/NoAccess";

//Authentication
import {
    AuthenticatedTemplate,
    UnauthenticatedTemplate,
} from "@azure/msal-react";

//Services
import LoadingSpinner from "../common/LoadingSpinner";

//context
import {
    IGPContext,
    useGeneralPageContext,
} from "../../Contexts/GeneralPageContext";

const GeneralPage = () => {
    const { userRoleFetched } = useGeneralPageContext() as IGPContext;

    return (
        <div className="container-fluid">
            <Navbar />

            <div className="container">
                <AuthenticatedTemplate>
                    {userRoleFetched ? <RouteHandler /> : <LoadingSpinner />}
                </AuthenticatedTemplate>

                <UnauthenticatedTemplate>
                    <UnAuthenticatedPages />
                </UnauthenticatedTemplate>
            </div>
        </div>
    );
};

const UnAuthenticatedPages = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NoAccess />} />
        </Routes>
    );
};

export default GeneralPage;

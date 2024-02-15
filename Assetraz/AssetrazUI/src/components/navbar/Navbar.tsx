//React
import React from "react";
import { Stack } from "@fluentui/react";

//Components
import { NavbarCommands } from "./CommandBar";
import { RoleBasedNavbarCommands } from "./RoleBasedCommandBar";
import Logo from "../headerBar/Logo";

//Styles
import { ContainerDiv } from "./Navbar.styles";
import {
    IGPContext,
    useGeneralPageContext,
} from "../../Contexts/GeneralPageContext";

const Navbar: React.FunctionComponent = () => {
    const { isUserRolesActive } = useGeneralPageContext() as IGPContext;

    return (
        <ContainerDiv>
            <div className="container">
                <Stack horizontal>
                    <Logo />
                    {isUserRolesActive ? (
                        <RoleBasedNavbarCommands />
                    ) : (
                        <NavbarCommands />
                    )}
                </Stack>
            </div>
        </ContainerDiv>
    );
};

export default Navbar;

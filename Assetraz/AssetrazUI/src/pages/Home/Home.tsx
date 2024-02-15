// UI
import { Stack } from "@fluentui/react";
import { Image } from "@fluentui/react/lib/Image";

// Authentication
import {
    AuthenticatedTemplate,
    UnauthenticatedTemplate,
} from "@azure/msal-react";
import RequestPage from "../request/RequestPage";

import {
    Card,
    ContainerDiv,
    Content,
    Front,
    Back,
    Title,
    Description,
    SignInInfo,
    imageProps,
} from "./Home.styles";
import { Route, Routes } from "react-router-dom";

const Home = () => {
    return (
        <>
            <Stack>
                <AuthenticatedTemplate>
                    <Routes>
                        <Route path="/" element={<RequestPage />} />
                    </Routes>
                </AuthenticatedTemplate>
            </Stack>
            <ContainerDiv>
                <UnauthenticatedTemplate>
                    <Image
                        {...imageProps}
                        alt="Reply banner image - unauthorized page"
                    />
                    <Card>
                        <Content>
                            <Front>
                                <Title>Assetraz</Title>
                                <Description>
                                    "You are not authorized to view this page."
                                </Description>
                            </Front>
                            <Back>
                                <SignInInfo>
                                    "Please sign in to continue."
                                </SignInInfo>
                            </Back>
                        </Content>
                    </Card>
                </UnauthenticatedTemplate>
            </ContainerDiv>
        </>
    );
};

export default Home;

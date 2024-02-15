import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";
import { PublicClientApplication } from "@azure/msal-browser";

const pca = new PublicClientApplication({
    auth: {
        clientId: "test_ClientID",
        authority: "testAuthority",
        redirectUri: "/",
    },
});

it('renders "Welcome to Your Fluent UI App"', () => {
    render(<App msalInstance={pca} />);
    const linkElement = screen.getByText(/Welcome to Your Fluent UI App/i);
    expect(linkElement).toBeInTheDocument();
});

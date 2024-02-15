import { LogLevel, PublicClientApplication } from "@azure/msal-browser";

export const msalConfig = {
  auth: {
      clientId: process.env.REACT_APP_CLEINT_ID,
      authority: process.env.REACT_APP_AUTHORITY,
      redirectUri: "/",
      postLogoutRedirectUri: "/",
  },
  cache: {
      cacheLocation: "localStorage",
      storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level: any, message: string, containsPii: any) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          }
        },
    }
  }
};

export const loginRequest = {
  scopes: [process.env.REACT_APP_SCOPE]
};

export const msalInstance = new PublicClientApplication(msalConfig);
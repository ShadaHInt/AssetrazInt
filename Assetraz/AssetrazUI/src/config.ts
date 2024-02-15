export interface IProcessEnv {
  REACT_APP_API_BASE_URL: string
  REACT_APP_BASE_API_URL: string
  REACT_APP_CLEINT_ID: string
  REACT_APP_AUTHORITY: string
  REACT_APP_SCOPE: string
};


declare global {
  namespace NodeJS {
    interface ProcessEnv extends IProcessEnv { }
  }
};
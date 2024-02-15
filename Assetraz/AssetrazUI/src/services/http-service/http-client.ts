import { loginRequest, msalInstance } from "../auth/authConfig";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  },
});

axiosInstance.interceptors.request.use(
  async (response: any) => {
    const account = msalInstance.getAllAccounts()[0];
    const msalResponse = await msalInstance.acquireTokenSilent({
      ...loginRequest,
      account: account,
    });
    response.headers.Authorization = `Bearer ${ msalResponse.accessToken }`;
    return response;
  },
  (err: any) => {
    return Promise.reject(err);
  }
);

export default axiosInstance;
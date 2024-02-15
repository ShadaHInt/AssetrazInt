import { getExceptionMessage } from "../Other/ErrorHandling";
import { INetworkCompany, NetworkCompany } from "../types/NetworkCompany";
import axiosInstance from "./http-service/http-client";

export const GetAllNetworkCompanies = async () => {
    const response = axiosInstance.get("NetworkCompany/active");
    if ((await response).status !== 200) {
        throw new Error(`Error! status: ${await response}`);
    }
    return (await response).data.map((e: NetworkCompany) => ({
        key: e.networkCompanyId,
        text: e.companyName,
        isPrimary: e.isPrimary,
    }));
};

export const GetCompaniesForDashboard = async () => {
    const response = axiosInstance.get("NetworkCompany");
    if ((await response).status !== 200) {
        throw new Error(`Error! status: ${await response}`);
    }
    const companies: INetworkCompany[] = (await response).data;
    return companies;
};

export const AddNetworkCompany = async (data: any): Promise<any> => {
    try {
        const response = axiosInstance.post("NetworkCompany", data);
        if ((await response).status !== 200) {
            throw new Error(`Error! status: ${await response}`);
        }
        return response;
    } catch (err) {
        return getExceptionMessage(err, "Network company");
    }
};

export const UpdateNetworkCompany = async (data: any): Promise<any> => {
    try {
        const response = axiosInstance.put("NetworkCompany", data);
        if ((await response).status !== 200) {
            throw new Error(`Error! status: ${await response}`);
        }
        return response;
    } catch (err) {
        return getExceptionMessage(err, "Network company");
    }
};

export const DeleteNetworkcompany = async (
    networkCompanyId: any
): Promise<any> => {
    try {
        const response = axiosInstance.delete(
            "NetworkCompany?networkCompanyId=" + networkCompanyId
        );
        if ((await response).status !== 200) {
            throw new Error(`Error! status: ${await response}`);
        }
        return response;
    } catch (err) {
        return getExceptionMessage(err, "Network company");
    }
};

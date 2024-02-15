import { getExceptionMessage } from "../Other/ErrorHandling";
import { InsuredAssetRequest, IUploadPolicy } from "../types/InsuredAsset";
import http from "./http-service/http-client";

export const GetInsuredAssets = async (): Promise<any> => {
    try {
        const response = await http.get("Insurance");
        const result = await response.data;
        return result;
    } catch (err) {
        throw getExceptionMessage(err);
    }
};

export const getInsuranceDetails = async (
    referenceNumbers: string[]
): Promise<any> => {
    try {
        let commonString = "insuranceReferenceIds=";
        let queryString = "";
        referenceNumbers.forEach((referenceNumber) => {
            queryString = queryString + commonString + referenceNumber + "&&";
        });
        const response = await http.get(
            "Insurance/insuranceDetails?" + queryString
        );
        if (response.status !== 200) {
            throw new Error(`Error! status: ${response.status}`);
        }
        const result = await response.data;
        return result;
    } catch (err) {
        throw getExceptionMessage(err);
    }
};

export const uploadPolicy = async (data: IUploadPolicy): Promise<any> => {
    try {
        const response = await http.post("Insurance/upload-policy", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        if (response.status !== 200) {
            throw new Error(response.data);
        }
        const result = await response.data;
        return result;
    } catch (err) {
        throw getExceptionMessage(err);
    }
};

export const updateAsset = async (
    editedAsset: InsuredAssetRequest[]
): Promise<any> => {
    try {
        const response = await http.put("Insurance", editedAsset);
        return response.data;
    } catch (err: any) {
        throw getExceptionMessage(err);
    }
};

export const DownloadPolicyFile = async (
    referenceNumber: string,
    filename: string
): Promise<any> => {
    try {
        const response = await http.get(
            "Insurance/download-policy/" + referenceNumber,
            {
                responseType: "blob",
            }
        );
        const file = response.data;
        const url = window.URL.createObjectURL(file);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();
        return true;
    } catch (err) {
        getExceptionMessage(err);
    }
};

export const DeletePolicyFile = async (
    referenceNumber: string
): Promise<boolean> => {
    const response = await http.delete("Insurance/policy/" + referenceNumber);
    return response.data;
};

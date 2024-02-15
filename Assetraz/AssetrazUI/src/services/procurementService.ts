import { getExceptionMessage } from "../Other/ErrorHandling";
import http from "./http-service/http-client";

const ENDPOINT = "Procurement/";

export const getProcurementsApprovalDashboard = async (): Promise<any> => {
    try {
        const response = await http.get(ENDPOINT + "approvals");
        if (response.status !== 200) {
            throw new Error(`Error! status: ${response.status}`);
        }
        const result = await response.data;
        return result;
    } catch (err) {
        console.log(err);
    }
};

export const ProcurementDetails = async (
    procurementRequestId: string
): Promise<any> => {
    try {
        const response = await http.get(ENDPOINT + procurementRequestId);
        if (response.status !== 200) {
            throw new Error(`Error! status: ${response.status}`);
        }
        const result = await response.data;
        return result;
    } catch (err) {
        throw getExceptionMessage(err);
    }
};

export const ProcurementItemDetails = async (
    procurementId: any,
    vendorId: any
): Promise<any> => {
    try {
        const response = await http.get(
            ENDPOINT + "details/" + procurementId + "/" + vendorId
        );
        if (response.status !== 200) {
            throw new Error(`Error! status: ${response.status}`);
        }
        return response.data;
    } catch (err) {
        throw getExceptionMessage(err);
    }
};

export const ProcurementList = async (): Promise<any> => {
    try {
        const response = await http.get(ENDPOINT);
        if (response.status !== 200) {
            throw new Error(`Error! status: ${response.status}`);
        }
        const result = await response.data;
        return result;
    } catch (err) {
        console.log(err);
    }
};

export const CreateProcurementRequest = async (
    data: any,
    requestForQuote: boolean,
    cc: boolean
): Promise<any> => {
    try {
        const response = await http.post(
            ENDPOINT + "new",
            JSON.stringify(data),
            {
                params: {
                    requestForQuote,
                    cc,
                },
            }
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

export const CreateProcurementRequestForUserRequest = async (
    data: any,
): Promise<any> => {
    try {
        const response = await http.post(
            ENDPOINT + "user-requests/procurement",JSON.stringify(data)
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

export const UpdateProcurementRequest = async (
    data: any,
    statusUpdate: boolean,
    cc: boolean
): Promise<any> => {
    try {
        const response = await http.put(
            ENDPOINT + "update",
            JSON.stringify(data),
            {
                params: {
                    statusUpdate,
                    cc,
                },
            }
        );
        const result = await response.data;
        return result;
    } catch (err) {
        throw getExceptionMessage(err);
    }
};

export const UpdateRequestStatus = async (
    procurementRequestId: string,
    isDelete?: boolean,
    isApproved?: boolean,
    comments: string = ""
): Promise<any> => {
    try {
        const response = await http.put(
            ENDPOINT + "update-status/" + procurementRequestId,
            comments,
            {
                params: {
                    isDelete,
                    isApproved,
                },
            }
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

export const UploadVendorQuotes = async (data: any): Promise<any> => {
    try {
        let formdata = new FormData();
        for (let i = 0; i < data.length; ++i) {
            formdata.append(
                `vendorQuoteList[${i}].ProcurementVendorId`,
                data[i].procurementVendorId
            );
            formdata.append(
                `vendorQuoteList[${i}].ProcurementRequestId`,
                data[i].procurementRequestId
            );
            formdata.append(
                `vendorQuoteList[${i}].QuoteFile`,
                data[i].quoteFile
            );
            formdata.append(
                `vendorQuoteList[${i}].IsShortListed`,
                data[i].isShortListed
            );
        }

        const response = await http.post(ENDPOINT + "upload-quote", formdata, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        if (response.status !== 200) {
            throw new Error(`Error! status: ${response.status}`);
        }
        const result = await response.data;
        return result;
    } catch (err) {
        console.log(err);
    }
};

export const DeleteVendorQuote = async (
    procurementVendorId: string
): Promise<boolean> => {
    const response = await http.delete(
        ENDPOINT + "quote/" + procurementVendorId
    );
    return response.data;
};

export const DownloadVendorQuote = async (
    procurementVendorId: string,
    filename: string
): Promise<any> => {
    try {
        const response = await http.get(
            ENDPOINT + "download-quote/" + procurementVendorId,
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

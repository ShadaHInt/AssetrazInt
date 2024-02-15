import { getExceptionMessage } from "../Other/ErrorHandling";
import { PurchaseItemsDetails } from "../types/PurchaseOrder";
import http from "./http-service/http-client";

const ENDPOINT = "PurchaseOrder/";

export const PurchaseOrderList = async (): Promise<any> => {
    try {
        const response = await http.get(ENDPOINT);
        if (response.status !== 200) {
            throw new Error(`Error! status: ${response.status}`);
        }
        const result = await response.data;
        return result;
    } catch (err) {
        throw getExceptionMessage(err);
    }
};

export const PurchaseOrderDetails = async (
    purchaseOrderRequestId: any,
    purchaseOrderNumber?:string
): Promise<any> => {
    try {
        const response = await http.get(
            ENDPOINT + "details/" + purchaseOrderRequestId  + "?purchaseOrderNumber=" + purchaseOrderNumber
        );
        if (response.status !== 200) {
            throw new Error(`Error! status: ${response.status}`);
        }
        return response.data;
    } catch (err) {
        throw getExceptionMessage(err);
    }
};

export const PurchaseRequestDetail = async (
    purchaseOrderRequestId: any
): Promise<any> => {
    try {
        const response = await http.get(
            "PurchaseRequest/purchaseRequest/irq/" + purchaseOrderRequestId
        );
        if (response.status !== 200 && response.status !== 204) {
            throw new Error(`Error! status: ${response.status}`);
        }
        return response.data;
    } catch (err) {
        throw getExceptionMessage(err);
    }
};

export const UpdatePurchaseOrderDetails = async (
    purchaseOrderDetails: PurchaseItemsDetails[],
    isPartial: boolean,
    isHandover: boolean
): Promise<any> => {
    try {
        const response = await http.put(
            ENDPOINT + "update/",
            purchaseOrderDetails,
            {
                params: {
                    isPartial,
                    isHandover,
                },
            }
        );
        if (response.status !== 200) {
            throw new Error(`Error! status: ${response.status}`);
        }
        return response.data;
    } catch (err) {
        throw getExceptionMessage(err);
    }
};

export const viewPO = async (poRequestId: any): Promise<any> => {
    try {
        const response = await http.get(ENDPOINT + "view/" + poRequestId);
        if (response.status !== 200) {
            throw new Error(`Error! status: ${response.status}`);
        }
        return response.data;
    } catch (err) {
        throw getExceptionMessage(err);
    }
};

export const CreatePurchaseOrder = async (data: any): Promise<any> => {
    try {
        const response = await http.post(ENDPOINT + "add", data);
        if (response.status !== 200) {
            throw new Error(`Error! status: ${response.status}`);
        }
        return response;
    } catch (err) {
        throw getExceptionMessage(err);
    }
};

export const getProcurementsReport = async (): Promise<any> => {
    try {
        const response = await http.get(ENDPOINT + "report");
        if (response.status !== 200) {
            throw new Error(`Error! status: ${response.status}`);
        }
        return response.data;
    } catch (err) {
        throw getExceptionMessage(err);
    }
};

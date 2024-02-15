import http from "./http-service/http-client";
import { getExceptionMessage } from "../Other/ErrorHandling";

export const getRequestsByuser = async (): Promise<any> => {
  try {
    const response = await http.get("PurchaseRequest/getPurchaseRequestByuser");
    const result = await response.data;
    return result;
  } catch (err) {
    throw getExceptionMessage(err);
  }
};

export const getRequestsBySupervisor = async (): Promise<any> => {
  try {
    const response = await http.get("PurchaseRequest/getPurchaseRequestBySupervisor");
    const result = await response.data;
    return result;
  } catch (err) {
    throw getExceptionMessage(err);
  }
};

export const createNewAssetRequest = async (data: any): Promise<any> => {
  try {
    const response = await http.post("PurchaseRequest/newAsset", data);
    if (response.status !== 200) {
      throw new Error(response.data);
    }
    const result = await response.data;
    return result;
  } catch (err) {
    throw getExceptionMessage(err);
  }
};

export const updateNewAssetRequest = async (requestNumber: string, data: any): Promise<any> => {
  try {
    const response = await http.post("PurchaseRequest/updateAssetRequest?requestNumber=" + requestNumber, data);
    if (response.status !== 200) {
      throw new Error(response.data);
    }
    const result = await response.data;
    return result;
  } catch (err) {
    throw getExceptionMessage(err);
  }
};

export const deleteNewAssetRequest = async (requestNumber: string): Promise<any> => {
  try {
    const response = await http.post("PurchaseRequest/deleteAssetRequest?requestNumber=" + requestNumber);
    if (response.status !== 200) {
      throw new Error(response.data);
    }
    return response.data;
  } catch (err) {
    throw getExceptionMessage(err);
  }
};

export const reviewAssetRequest = async (requestNumber: string, review: boolean, data: any): Promise<any> => {
  try {
    const response = await http.post("PurchaseRequest/reviewAssetRequest?requestNumber=" + requestNumber + "&&review=" + review, data);
    if (response.status !== 200) {
      throw new Error(response.data);
    }
    return response.data;
  } catch (err) {
    throw getExceptionMessage(err);
  }
};

export const approvedUserRequests = async (): Promise<any> => {
  try {
    const response = await http.get("PurchaseRequest/approvedRequest");
    const result = await response.data;
    return result;
  } catch (err) {
    throw getExceptionMessage(err);
  }
};

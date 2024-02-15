import { getExceptionMessage } from "../Other/ErrorHandling";
import http from "./http-service/http-client";

export const getMaintenanceRequestByUser = async (): Promise<any> => {
  try {
      const response = await http.get("MaintenanceRequest");
      return response.data;
  } catch (err: any) {
      throw getExceptionMessage(err);
  }
};

export const getAllMaintenanceRequests = async (): Promise<any> => {
  try {
      const response = await http.get("MaintenanceRequest/all");
      return response.data;
  } catch (err: any) {
      throw getExceptionMessage(err);
  }
};

export const createNewMaintenanceRequest = async (data: any): Promise<any> => {
  try {
    const response = await http.post("MaintenanceRequest", data);
    if (response.status !== 200) {
      throw new Error(response.data);
    }
    const result = response.data;
    return result;
  } catch (err) {
    throw getExceptionMessage(err);
  }
};
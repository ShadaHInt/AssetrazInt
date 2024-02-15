import { getExceptionMessage } from "../Other/ErrorHandling";
import { PreferenceType } from "../pages/Admin/DashboardPage/PreferenceTypes";
import http from "./http-service/http-client";

export const getDashboardPreferences = async (): Promise<PreferenceType[] | undefined> => {
  try {
      const response = await http.get("DashboardPreference");
      if (response.status !== 200) {
          throw new Error(`Error! status: ${response.status}`);
      }
      const result = await response.data;
      return result;
  } catch (err) {
    throw getExceptionMessage(err);
  }
};

export const addDashboardPreferences = async (data: PreferenceType): Promise<any> => {
  try {
      const response = await http.post("DashboardPreference", JSON.stringify(data));
      if (response.status !== 200) {
          throw new Error(`Error! status: ${response.status}`);
      }
      return response.data;
  } catch (err) {
     throw getExceptionMessage(err);
  }
};

export const deleteDashboardPreferences = async (preferenceId: string): Promise<any> => {
  try {
      const response = await http.put(`DashboardPreference?preferenceId=${preferenceId}`);
      if (response.status !== 200) {
          throw new Error(`Error! status: ${response.status}`);
      }
      return response.data;
  } catch (err) {
     throw getExceptionMessage(err);
  }
};


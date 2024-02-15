import { getExceptionMessage } from "../Other/ErrorHandling";
import { reOrderLevel } from "../types/ReOrderLevel";
import axiosInstance from "./http-service/http-client";

const ENDPOINT = "ReOrderLevel/";

export const GetReorderLevelList = async (networkCompanyId:string): Promise<any> => { 
  try{
    const response = await axiosInstance.get(ENDPOINT + "reorder-level-master-data?networkCompanyId=" + networkCompanyId);
    if (response.status !== 200) {
      throw new Error(`Error! status: ${response}`);
    }
    const reOrderLevelList:reOrderLevel[] = await response.data;
    return reOrderLevelList;

  } catch (err) {
      throw getExceptionMessage(err);
  }   
};

export const AddReorderLevel = async(reOrderLevels:reOrderLevel[]):Promise<any> => {
  try{
    const response = await axiosInstance.post(ENDPOINT + "add", reOrderLevels );
    if (response.status !== 200) {
      throw new Error(`Error! status: ${response}`);
    }
    return response.data;
  }catch(err){
    throw getExceptionMessage(err);
  }
};

export const UpdateReorderLevel = async(reOrderLevels:reOrderLevel[]):Promise<any> => {
  try{
    const response = await axiosInstance.put(ENDPOINT + "update", reOrderLevels );
    if (response.status !== 200) {
      throw new Error(`Error! status: ${response}`);
    }
    return response.data;
  }catch(err){
    throw getExceptionMessage(err);
  }
 };
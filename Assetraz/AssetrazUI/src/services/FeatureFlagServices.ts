import { getExceptionMessage } from "../Other/ErrorHandling";
import axiosInstance from "./http-service/http-client";

const ENDPOINT = "FeatureFlag";

export const IsActiveFeatureFlag = async ( featureName :string) => {
  try{
    const response = await axiosInstance.get(ENDPOINT +"/" +featureName);
    if (response.status !== 200) {
        throw new Error(`Error! status: ${await response}`);
    }
    const isActiveFeature: any[] = response.data;
    return isActiveFeature;
  } catch (err) {
    throw getExceptionMessage(err);
  }
};  
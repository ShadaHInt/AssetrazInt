import { getExceptionMessage } from "../Other/ErrorHandling";
import { IAllAsset } from "../types/AllAsset";
import http from "./http-service/http-client";

export const GetAllAssetsList = async (): Promise<IAllAsset[]> => {
    try {
        const response = await http.get("Assets/asset-register");
        const result = await response.data;
        return result;
    } catch (err) {
        throw getExceptionMessage(err);
    }
};

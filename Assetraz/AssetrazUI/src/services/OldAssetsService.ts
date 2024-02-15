import { getExceptionMessage } from "../Other/ErrorHandling";
import { IOldAsset } from "../types/OldAsset";
import http from "./http-service/http-client";

export const GetOldAssets = async (): Promise<IOldAsset[]> => {
    try {
        const response = await http.get("Assets/cutover-asset");
        const result = await response.data;
        return result;
    } catch (err) {
        throw getExceptionMessage(err);
    }
};

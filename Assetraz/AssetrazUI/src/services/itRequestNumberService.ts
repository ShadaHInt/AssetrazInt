import { ItRequest } from "../types/ItRequest";
import { getExceptionMessage } from "../Other/ErrorHandling";
import axiosInstance from "./http-service/http-client";

export const GetAllProcurementRequestNumber = async () => {
    try {
        const response = axiosInstance.get("procurement/requestNumber");
        if ((await response).status !== 200) {
            throw new Error(`Error! status: ${await response}`);
        }

        return (await response).data.map((e: ItRequest) => ({
            key: e?.procurementRequestId,
            text: e?.procurementRequestNumber,
        }));
    } catch (err: any) {
        throw getExceptionMessage(err);
    }
};

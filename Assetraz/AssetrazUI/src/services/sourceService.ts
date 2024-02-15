import { Source, ISource } from "../types/Source";
import axiosInstance from "./http-service/http-client";
import { getExceptionMessage } from "../Other/ErrorHandling";

export const GetAllSources = async () => {
    const response = axiosInstance.get("Source");
    if ((await response).status !== 200) {
        throw new Error(`Error! status: ${await response}`);
    }
    return (await response).data.map((e: Source) => ({
        key: e.sourceId,
        text: e.sourceName,
    }));
};

export const GetSourcesForMasterData = async () => {
    const response = axiosInstance.get("Source/all");
    if ((await response).status !== 200) {
        throw new Error(`Error! status: ${await response}`);
    }
    const sources: ISource[] = (await response).data;
    return sources;
};

export const AddSource = async (data: any): Promise<any> => {
    try {
        const response = axiosInstance.post("Source", data);
        if ((await response).status !== 200) {
            throw new Error(`Error! status: ${await response}`);
        }
        return response;
    } catch (err) {
        return getExceptionMessage(err, "source");
    }
};

export const UpdateSource = async (data: any): Promise<any> => {
    try {
        const response = axiosInstance.put("Source", data);
        if ((await response).status !== 200) {
            throw new Error(`Error! status: ${await response}`);
        }
        return response;
    } catch (err) {
        return getExceptionMessage(err, "source");
    }
};

export const DeleteSource = async (sourceId: any): Promise<any> => {
    try {
        const response = axiosInstance.delete("Source?sourceId=" + sourceId);
        if ((await response).status !== 200) {
            throw new Error(`Error! status: ${await response}`);
        }
        return response;
    } catch (err) {
        return getExceptionMessage(err, "source");
    }
};

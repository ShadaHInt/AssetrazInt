import { getExceptionMessage } from "../Other/ErrorHandling";
import IAsset, { AssetDetails } from "../types/Asset";
import { RefurbishedAsset } from "../types/RefurbishedAsset";
import http from "./http-service/http-client";

const getAssets = async (): Promise<IAsset[] | undefined> => {
    try {
        const response = await http.get("Assets");
        if (response.status !== 200) {
            throw new Error(`Error! status: ${response.status}`);
        }
        const result = await response.data;
        return result;
    } catch (err) {
        console.log(err);
    }
};

export const getAssetsByCategory = async (categoryId: string): Promise<IAsset[] | undefined> => {
    try {
        const response = await http.get("Assets/issuable_aset/category/"+categoryId);
        if (response.status !== 200) {
            throw new Error(`Error! status: ${response.status}`);
        }
        const result = await response.data;
        return result;
    } catch (err) {
        throw getExceptionMessage(err);
    }
};

export const getAssetsReport = async (): Promise<IAsset[] | undefined> => {
    try {
        const response = await http.get("Assets/report");
        if (response.status !== 200) {
            throw new Error(`Error! status: ${response.status}`);
        }
        return response.data;
    } catch (err) {
        throw getExceptionMessage(err);
    }
};

export const getActivityReport = async (): Promise<any> => {
    try {
        const response = await http.get("Assets/activity-report");
        if (response.status !== 200) {
            throw new Error(`Error! status: ${response.status}`);
        }
        return response.data;
    } catch (err) {
        throw getExceptionMessage(err);
    }
};

export const getAsset = async (id: string): Promise<any> => {
    try {
        const response = await http.get("Assets/" + id);
        if (response.status !== 200) {
            throw new Error(`Error! status: ${response.status}`);
        }
        const result = await response.data;
        return result;
    } catch (err) {
        console.log(err);
        throw new Error("Error occured!");
    }
};

export const issueAsset = async (data: any): Promise<any> => {
    try {
        const response = await http.post("Assets/issue", JSON.stringify(data));
        if (response.status !== 200) {
            throw new Error(`Error! status: ${response.status}`);
        }
        return response.data;
    } catch (err) {
        console.log(err);
    }
};

export const returnAsset = async (data: any): Promise<any> => {
    try {
        const response = await http.post("Assets/return", JSON.stringify(data));
        if (response.status !== 200) {
            throw new Error(`Error! status: ${response.status}`);
        }
        return response.data;
    } catch (err) {
        console.log(err);
    }
};

export const getAssetbyUser = async (userEmail? : string | undefined): Promise<any> => {
    try {
      const url = userEmail ? `Assets/getAssetByuser/${userEmail}` : "Assets/getAssetByuser";
      const response = await http.get(url);
        const result = await response.data;
        return result;
    } catch (err) {
        throw getExceptionMessage(err);
    }
};

export const getAssetsyInvoice = async (invoiceId: string): Promise<any> => {
    const response = await http.get("Assets/invoice/" + invoiceId);
    return response.data;
};

export const updateAssetDetailsFromInvoice = async (
    data: IAsset[],
    invoiceId: string,
    register: boolean = false
): Promise<string> => {
    try {
        const response = await http.put("Assets/update-purchased", data, {
            params: {
                invoiceId,
                register,
            },
        });
        return response.data;
    } catch (err: any) {
        throw getExceptionMessage(err);
    }
};

export const getRefurbishedAssets = async (): Promise<any> => {
    try {
        const response = await http.get("Assets/refurbished-assets");
        return response.data;
    } catch (err: any) {
        throw getExceptionMessage(err);
    }
};

export const getRefurbishedAssetById = async (
    refurbishedAssetId: string
): Promise<any> => {
    try {
        const response = await http.get(
            "Assets/refurbished-asset-byId?refurbishAssetId=" +
                refurbishedAssetId
        );
        return response.data;
    } catch (err: any) {
        throw getExceptionMessage(err);
    }
};

export const updateRefurbished = async (
    refurbishedAsset: RefurbishedAsset,
    refurbishAssetId: string
): Promise<any> => {
    try {
        const response = await http.put(
            "Assets/update-refurbished",
            refurbishedAsset,
            {
                params: {
                    refurbishAssetId,
                },
            }
        );
        return response.data;
    } catch (err: any) {
        throw getExceptionMessage(err);
    }
};

export const GetScrapList = async (): Promise<any> => {
    try {
        const response = await http.get("Assets/scrap-list");
        const result = await response.data;
        return result;
    } catch (err) {
        throw getExceptionMessage(err);
    }
};

export const GetReorderLevelNotification = async (): Promise<any> => {
    try {
        const response = await http.get("Assets/notification");
        const result = await response.data;
        return result;
    } catch (err) {
        throw getExceptionMessage(err);
    }
};

export const getOtherSourcesInventory = async (): Promise<any> => {
    try {
        const response = await http.get("Assets/other-source");
        return response.data;
    } catch (err: any) {
        throw getExceptionMessage(err);
    }
};

export const getOtherSourcesInventoryById = async (
    otherSourceId: string
): Promise<any> => {
    try {
        const response = await http.get("Assets/other-source/" + otherSourceId);
        return response.data;
    } catch (err: any) {
        throw getExceptionMessage(err);
    }
};

export const createOtherSourceInventoryRequest = async (
    data: any,
    register: boolean = false
): Promise<any> => {
    try {
        const response = await http.post("Assets/add-other-source", data, {
            params: {
                register,
            },
        });
        if (response.status !== 200) {
            throw new Error(`Error! status: ${response.status}`);
        }
        const result = response.data;
        return result;
    } catch (err) {
        throw getExceptionMessage(err);
    }
};

export const UpdateOtherSourceInventoryRequest = async (
    data: any,
    register: boolean = false,
    inventoryOtherSourceId: string
): Promise<any> => {
    try {
        const response = await http.put("Assets/update-other-source", data, {
            params: {
                register,
                inventoryOtherSourceId,
            },
        });
        if (response.status !== 200) {
            throw new Error(`Error! status: ${response.status}`);
        }
        const result = response.data;
        return result;
    } catch (err) {
        throw getExceptionMessage(err);
    }
};

export const uploadSupportDocument = async (data: any): Promise<any> => {
    try {
        const response = await http.post(
            "Assets/upload-support-document",
            data,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        if (response.status !== 200) {
            throw new Error(response.data);
        }
        const result = await response.data;
        return result;
    } catch (err) {
        throw getExceptionMessage(err);
    }
};

export const DownloadSupportDocument = async (
    otherSourceId: string,
    filename: string
): Promise<any> => {
    try {
        const response = await http.get(
            "Assets/download-support-document/" + otherSourceId,
            {
                responseType: "blob",
            }
        );
        const file = response.data;
        const url = window.URL.createObjectURL(file);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();
        return true;
    } catch (err) {
        getExceptionMessage(err);
    }
};

export const DeleteSupportDocument = async (
    otherSourceId: string
): Promise<boolean> => {
    const response = await http.delete(
        "Assets/delete-support-document/" + otherSourceId
    );
    return response.data;
};

export const getIssuedAssetByUser = async (): Promise<any> => {
    try {
        const response = await http.get("Assets/getIssuedAssetByUser");
        const result = await response.data;
        return result;
    } catch (err) {
        throw getExceptionMessage(err);
    }
};

export const DeleteScrap = async (
  refurbishedAssetId: string
): Promise<boolean> => {
  const response = await http.delete(
      "Assets/delete-scrap/" + refurbishedAssetId
  );
  return response.data;
};

export default getAssets;

export const GetAllAssets = async (): Promise<any> => {
    try {
        const response = await http.get("Assets/all-assets");
        const result = await response.data;
        return result;
    } catch (err) {
        throw getExceptionMessage(err);
    }
};

export const UpdateAssetDetails = async (asset: AssetDetails): Promise<string> => {
    try {
        const response = await http.put("Assets/update-asset", asset);
        return response.data;
    } catch (err: any) {
        throw getExceptionMessage(err);
    }
};

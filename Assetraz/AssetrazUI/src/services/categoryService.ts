import { Category, ICategory } from "../types/Category";
import axiosInstance from "./http-service/http-client";
import { getExceptionMessage } from "../Other/ErrorHandling";

export const GetAllCategories = async () => {
    const response = axiosInstance.get("Category");
    if ((await response).status !== 200) {
        throw new Error(`Error! status: ${await response}`);
    }
    return (await response).data.map((e: Category) => ({
        key: e.categoryId,
        text: e.categoryName,
        title: e.categoryName,
    }));
};

export const GetCategories = async () => {
    const response = axiosInstance.get("Category");
    if ((await response).status !== 200) {
        throw new Error(`Error! status: ${await response}`);
    }
    const categories: ICategory[] = (await response).data;
    return categories;
};

export const GetAllCategoriesForListing = async () => {
    const response = axiosInstance.get("Category");
    if ((await response).status !== 200) {
        throw new Error(`Error! status: ${await response}`);
    }
    return (await response).data.map((e: Category) => ({
        label: e.categoryName,
        value: e.categoryId,
    }));
};

export const GetCategoriesForMasterData = async () => {
    const response = axiosInstance.get("Category/all");
    if ((await response).status !== 200) {
        throw new Error(`Error! status: ${await response}`);
    }
    const categories: ICategory[] = (await response).data;
    return categories;
};

export const AddCategory = async (data: any): Promise<any> => {
    try {
        const response = axiosInstance.post("Category", data);
        if ((await response).status !== 200) {
            throw new Error(`Error! status: ${await response}`);
        }
        return response;
    } catch (err) {
        return getExceptionMessage(err, "category");
    }
};

export const UpdateCategory = async (data: any): Promise<any> => {
    try {
        const response = axiosInstance.put("Category", data);
        if ((await response).status !== 200) {
            throw new Error(`Error! status: ${await response}`);
        }
        return response;
    } catch (err) {
        return getExceptionMessage(err, "category");
    }
};

export const DeleteCategory = async (categoryId: any): Promise<any> => {
    try {
        const response = axiosInstance.delete(
            "Category?categoryId=" + categoryId
        );
        if ((await response).status !== 200) {
            throw new Error(`Error! status: ${await response}`);
        }
        return response;
    } catch (err) {
        return getExceptionMessage(err, "category");
    }
};

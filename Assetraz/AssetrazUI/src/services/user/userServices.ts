// import { User } from "../../types/User";
import http from "../http-service/http-client";

export const getEmployees = async (): Promise<any> => {
    try {
        const response = await http.get("user");
        if (response.status !== 200) {
            throw new Error(`Error! status: ${response.status}`);
        }
        const result = await response.data;
        return result;
    } catch (err) {
        console.log(err);
    }
};

export const getAllEmployees = async (): Promise<any> => {
    try {
        const response = await http.get("user/all-users");
        if (response.status !== 200) {
            throw new Error(`Error! status: ${response.status}`);
        }
        const result = await response.data;
        return result;
    } catch (err) {
        console.log(err);
    }
};

export const getUserRoles = async (email: string): Promise<any> => {
    try {
        const response = await http.get("user/getUserRoles?email=" + email);
        if (response.status !== 200) {
            throw new Error(`Error! status: ${response.status}`);
        }
        const result = await response.data;
        return result;
    } catch (err) {
        console.log(err);
    }
};

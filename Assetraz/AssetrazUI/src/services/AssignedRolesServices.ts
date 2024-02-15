import { getExceptionMessage } from "../Other/ErrorHandling";
import { AssignRoleRequest, UserRole } from "../pages/Admin/AssignedRoles/AssignedRolesTypes";
import axiosInstance from "./http-service/http-client";

const ENDPOINT = "AssignedRoles";

export const GetAssignedRoles = async () => {
  try{
    const response = await axiosInstance.get(ENDPOINT);
    if (response.status !== 200) {
        throw new Error(`Error! status: ${await response}`);
    }
    const assignedRoles: any[] = response.data;
    return assignedRoles;
  } catch (err) {
    throw getExceptionMessage(err);
  }
};  

export const GetUserRoles = async () => {
  try{
    const response = await axiosInstance.get(ENDPOINT+"/Roles");
    if (response.status !== 200) {
        throw new Error(`Error! status: ${await response}`);
    }
    const roles: any[] = response.data;
    return roles;
  } catch (err) {
    throw getExceptionMessage(err);
  }
};  

export const GetAssignedRolesForUser = async () => {
  try {
    const isLoggedInUser = true;
    const endpoint = ENDPOINT+"/users/assigned-roles";
    const url = `${endpoint}?isLoggedInUser=${isLoggedInUser}`;
    const response = await axiosInstance.get(url);
    if (response.status !== 200) {
      throw new Error(`Error! status: ${response.status}`);
    }

    const roles = response.data;
    return roles;
  } catch (err) {
    throw getExceptionMessage(err);
  }
};


export const AddUserRoles = async (userPreveleges : AssignRoleRequest) => {
  try{
    const response = await axiosInstance.post(ENDPOINT, userPreveleges);
    if (response.status !== 200) {
        throw new Error(`Error! status: ${await response}`);
    }
    const roles: any[] = response.data;
    return roles;
  } catch (err) {
    throw getExceptionMessage(err);
  }
};  

export const EditUserRoles = async (userPreveleges : AssignRoleRequest) => {
  try{
    const response = await axiosInstance.put(ENDPOINT, userPreveleges);
    if (response.status !== 200) {
        throw new Error(`Error! status: ${await response}`);
    }
    const roles: any[] = response.data;
    return roles;
  } catch (err) {
    throw getExceptionMessage(err);
  }
};

export const EditDefaultRole = async (defaultRoleId : number, newDefaultRole : UserRole) => {
  try{
    const response = await axiosInstance.put(ENDPOINT + "/" + defaultRoleId, newDefaultRole);
    if (response.status !== 200) {
        throw new Error(`Error! status: ${await response}`);
    }
    const result: any[] = response.data;
    return result;
  } catch (err) {
    throw getExceptionMessage(err);
  }
}; 

export const DeleteUserRoles = async (userEmail : string) => {
  try{
    const response = await axiosInstance.delete(ENDPOINT , {
      data: { userEmail},
    }
    );
    if (response.status !== 200) {
        throw new Error(`Error! status: ${await response}`);
    }
    const result: any[] = response.data;
    return result;
  } catch (err) {
    throw getExceptionMessage(err);
  }
}; 
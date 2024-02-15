import React from "react";

export type UserRole = {
  userId: string;
  userRoleId: number;
  userRole: string;
  isDefaultRole: boolean;
  userEmailId?: string;
};

export type userRolesType = {
  [key: string]: {
      userName: string;
      userEmailId: string;
      userRoles: UserRole[];
  };
};

export type Role = { roleId: number; roleName: string };

export type AssignRoleRequest = {
    userId?: string;
    userEmailId?: string;
    userName?: string;
    userRoleIds?: number[];
    defaultRoleId?: number;
};

export interface IAssignedRoleModal {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSuccessMessage: React.Dispatch<React.SetStateAction<string | undefined>>;
  execute: () => void;
  selectedUserDetails: userRolesType | undefined;
}

export interface IAssignedRolesDashboardBody {
  assignedRolesData: any[] | null;
  setErrorMessage: React.Dispatch<React.SetStateAction<string | undefined>>;
  setSelectedUserDetails: React.Dispatch<
      React.SetStateAction<userRolesType | undefined>
  >;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}


export type Action =
    | { type: "SET_USER_EMAIL"; payload: string }
    | { type: "SET_USER_NAME"; payload: string }
    | { type: "SET_ROLE_IDS"; payload: number[] }
    | { type: "SET_DEFAULT_ROLE_ID"; payload: number }
    | { type: "SET_ALL_DETAILS"; payload: AssignRoleRequest }
    | { type: "RESET_STATE" };
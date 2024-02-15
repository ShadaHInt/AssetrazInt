import { Action, AssignRoleRequest, userRolesType } from "./AssignedRolesTypes";

export const reducer = (
  state: AssignRoleRequest,
  action: Action
): AssignRoleRequest => {
  switch (action.type) {
    case "SET_USER_EMAIL":
        return { ...state, userEmailId: action.payload };
    case "SET_USER_NAME":
        return { ...state, userName: action.payload };
    case "SET_ROLE_IDS": {
        const updatedState = {
            ...state,
            userRoleIds: action.payload,
            defaultRoleId: state.defaultRoleId && 
                (!action.payload.includes(state.defaultRoleId) && state.userRoleIds?.includes(state.defaultRoleId))
                    ? undefined
                    : state.defaultRoleId 
        };

        return updatedState;
    }
    case "SET_DEFAULT_ROLE_ID":
        return { ...state, defaultRoleId: action.payload };
    case "SET_ALL_DETAILS":
        return { ...state, ...action.payload };
    case "RESET_STATE":
        return {};
    default:
        return state;
    }
};

export const ConvertToAssignRoleRequest = (
  userRoles: userRolesType[keyof userRolesType]
): AssignRoleRequest => {
  const { userName, userEmailId, userRoles: roles } = userRoles;
  const userRoleIds: number[] = roles?.map((role) => role.userRoleId);
  const defaultRole = roles?.find((role) => role.isDefaultRole);
  const defaultRoleId = defaultRole ? defaultRole.userRoleId : undefined;
  const assignRoleRequest: AssignRoleRequest = {
      userEmailId,
      userName,
      userRoleIds,
      defaultRoleId,
  };

  return assignRoleRequest;
};

export const deepEqual = <T extends Record<string, any>>(obj1: T, obj2: T): boolean => {
    if (obj1 === obj2) {
        return true;
    }

    if (obj1 == null || obj2 == null) {
        return false;
    }

    if (typeof obj1 !== typeof obj2) {
        return false;
    }

    if (typeof obj1 === "object") {
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);

        if (keys1.length !== keys2.length) {
            return false;
        }

        for (const key of keys1) {
            if (!deepEqual(obj1[key], obj2[key])) {
                return false;
            }
        }

        return true;
    }

    return obj1 === obj2;
};
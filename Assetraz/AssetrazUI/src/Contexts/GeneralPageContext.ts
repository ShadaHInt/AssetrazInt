import { Dispatch, SetStateAction, createContext, useContext } from "react";
import { UserRole } from "../pages/Admin/AssignedRoles/AssignedRolesTypes";

export interface IGPContext  {
  currentUserRoles: string[];
  isUserRolesActive: boolean;
  userRolesWithDefault: UserRole[];
  userRoleFetched: boolean;
  selectedRole: UserRole | undefined;
  setSelectedRole: Dispatch<SetStateAction<UserRole | undefined>>;
  defaultRole: UserRole | undefined;
  setDefaultRole: Dispatch<SetStateAction<UserRole | undefined>>;
  fetchAssignedRoles: (keepCurrentRole?: boolean) => Promise<void>
}

export const GeneralPageContext = createContext<IGPContext | undefined>({} as IGPContext);
export const GeneralPageContextProvider = GeneralPageContext.Provider;
export const useGeneralPageContext = () => useContext(GeneralPageContext);

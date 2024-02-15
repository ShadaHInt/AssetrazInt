import React, { Dispatch, SetStateAction, useContext } from "react";


export interface IProcurementRequestContextValues {
  seletedProcurementRequest: string | undefined; 
  hasUserRequest : boolean | undefined;
  userRequestNumber?:string | undefined;
  setHasUserRequest?: Dispatch<SetStateAction<boolean | undefined>>,
}

export const ProcurementRequestContext = React.createContext<IProcurementRequestContextValues | undefined>(
  {} as IProcurementRequestContextValues
);

export const ProcurementRequestProvider = ProcurementRequestContext.Provider;
export const useProcurementRequestContext = () => useContext(ProcurementRequestContext);

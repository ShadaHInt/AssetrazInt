import React, { createContext, useContext } from "react";
import { OtherSourceInventoryProps } from "../types/OtherSourceInventory";

export interface IOtherSourceModalContext {
  otherSourceDetail:  OtherSourceInventoryProps[]  | undefined;
  initialOtherSourceDetail?:  OtherSourceInventoryProps[]  | undefined;
  setOtherSourceDetail: React.Dispatch<React.SetStateAction<OtherSourceInventoryProps[]>>;
}

export const OtherSourceModalContext = createContext<IOtherSourceModalContext>({} as IOtherSourceModalContext );
export const OtherSourceModalContextProvider = OtherSourceModalContext.Provider;
export const useOtherSourceModalContext = () => useContext(OtherSourceModalContext);
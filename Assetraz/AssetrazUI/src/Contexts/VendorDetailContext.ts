import React, { createContext, useContext } from "react";
import { IVendor } from "../types/Vendor";


export interface IVendorContext {
  vendorDetail: IVendor | undefined;
  initialVendorDetail: IVendor | undefined;
  setVendorDetail: React.Dispatch<React.SetStateAction<IVendor | undefined>>;
}

export const VendorContext = createContext<IVendorContext>({} as IVendorContext );

export const useVendorContext = () => useContext(VendorContext);

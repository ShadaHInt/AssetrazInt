import { getExceptionMessage } from "../Other/ErrorHandling";
import { Vendor, IVendor } from "../types/Vendor";
import axiosInstance from "./http-service/http-client";

export const GetAllVendors = async () => {

  const response = axiosInstance.get("Vendor");
    if((await response).status !== 200)
    {
      throw new Error(`Error! status: ${(await response)}`);
    } 
    return (await response).data.map((e : Vendor) => ({key: e.vendorId, text: e.vendorName}));
};

export const GetVendorsForDashboard = async () => {
  const response = axiosInstance.get("Vendor/all");
  if ((await response).status !== 200) {
      throw new Error(`Error! status: ${await response}`);
  }
  const vendors: IVendor[] = (await response).data;
  return vendors;
};

export const AddVendor = async (newVendor : IVendor) => {
  try{
    const response = await axiosInstance.post("Vendor",newVendor);
    if (response.status !== 200) {
        throw new Error(`Error! status: ${await response}`);
    }
    const vendors: IVendor[] = response.data;
    return vendors;
  } catch (err) {
    throw getExceptionMessage(err);
  }
};  

export const UpdateVendor = async (newVendor : IVendor) => {
  try{
    const response = await axiosInstance.put("Vendor",newVendor);
    if (response.status !== 200) {
        throw new Error(`Error! status: ${await response}`);
    }

    const vendors: IVendor[] = response.data;
    return vendors;
  } catch (err) {
    throw getExceptionMessage(err);
  }
}; 

export const DeleteVendor = async (vendorId : string) => {
  try{
    const response = await axiosInstance.delete("Vendor?vendorId="+vendorId);
    if (response.status !== 200) {
        throw new Error(`Error! status: ${await response}`);
    }
    
    const vendors: IVendor[] = response.data;
    return vendors;
  } catch (err) {
    throw getExceptionMessage(err);
  }
}; 
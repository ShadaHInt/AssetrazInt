import { getExceptionMessage } from "../Other/ErrorHandling";
import { IManufacturer, Manufacturer } from "../types/Manufacturer";
import axiosInstance from "./http-service/http-client";

export const GetAllManfacturer = async () => { 
    const response = axiosInstance.get("Manufacturer");
    if((await response).status !== 200)
    {
      throw new Error(`Error! status: ${(await response)}`);
    } 
    return (await response).data.map((e : Manufacturer) => ({key: e.manfacturerId, text: e.manufacturerName}));
};

export const GetManufacturersForDashboard = async () => {
  const response = axiosInstance.get("Manufacturer/all");
  if ((await response).status !== 200) {
      throw new Error(`Error! status: ${await response}`);
  }
  const manufacturers: IManufacturer[] = (await response).data;
  return manufacturers;
};

export const AddManufacturer = async(data:IManufacturer): Promise<any> =>{
  try {
        const response = axiosInstance.post("Manufacturer/add", data);
        if ((await response).status !== 200) {
            throw new Error(`Error! status: ${await response}`);
        }
        return response;
    } catch (err) {
        return getExceptionMessage(err, "manufacturer");
    }
};

export const UpdateManufacturer = async(data:IManufacturer): Promise<any> =>{
  try {
        const response = axiosInstance.post("Manufacturer/update", data);
        if ((await response).status !== 200) {
            throw new Error(`Error! status: ${await response}`);
        }
        return response;
    } catch (err) {
        return getExceptionMessage(err, "manufacturer");
    }
};

export const DeleteManufacturer = async(manufacturerId : string): Promise<any> =>{
    try {
          const response = axiosInstance.delete("Manufacturer?manufacturerId="+ manufacturerId);
          if ((await response).status !== 200) {
              throw new Error(`Error! status: ${await response}`);
          }
          return response;
      } catch (err) {
          return getExceptionMessage(err, "manufacturer");
      }
  };
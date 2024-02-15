import { getExceptionMessage } from "../Other/ErrorHandling";
import axiosInstance from "./http-service/http-client";
import http from "./http-service/http-client";

const ENDPOINT = "Invoice/";

export const GetInvoicesHandedOver = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get("Invoice/handover");
    if (response.status !== 200) {
      throw new Error(`Error! status: ${response.status}`);
    }
    const result = await response.data;
    return result;
  } catch (err) {
    console.log(err);
    throw new Error("Error occured");
  }
};

export const DownloadInvoice = async (invoiceId: string, filename: string): Promise<any> => {
    try {
        const response = await http.get(ENDPOINT + "download-invoice/" + invoiceId, {
            responseType: "blob"
    });
    const file =  response.data;
    const url = window.URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
  
    return true;
  } catch(err) {
    getExceptionMessage(err);
  }
};

export const DeleteInvoice = async (invoiceId: string): Promise<any> => {
  try{
    const response = await http.delete(
      ENDPOINT + "delete-invoice/" + invoiceId
  );
  const result = await response.data;
    return result;
  }catch(err) {
    getExceptionMessage(err);
  }
};


export const UploadInvoice = async (invoiceDetails:any):Promise<any> => {
  try{
    const response =  await http.post(ENDPOINT + "upload-invoice" , invoiceDetails,{
      headers: {
        "Content-Type": "multipart/form-data",
      }});
      if (response.status !== 200) {
        throw new Error(`Error! status: ${response.status}`);
      }
      const result = await response.data;
      return result;
  }
  catch(err){
    getExceptionMessage(err);
  }
};

//upload-invoice
export const UploadInvoiceForOldAsset = async (invoiceDetails: any, inventoryIds :string[]):Promise<any> => {
  try{
    const updatedInvoiceDetails = {
      ...invoiceDetails,
      inventoryIds: inventoryIds
    };
    const response =  await http.post(ENDPOINT + "upload-invoice-oldAsset" ,  updatedInvoiceDetails,{
      headers: {
        "Content-Type": "multipart/form-data",
      }});
      if (response.status !== 200) {
        throw new Error(`Error! status: ${response.status}`);
      }
      const result = await response.data;
      return result;
  }
  catch(err){
    getExceptionMessage(err);
  }
};
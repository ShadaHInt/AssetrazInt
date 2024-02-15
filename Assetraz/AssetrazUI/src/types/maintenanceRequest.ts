export interface IMaintenanceRequest {
  requestId: string;
  inventoryId:string;
  maintenanceRequestNumber?: string;
  categoryName?: string;
  manufacturerName?:string;
  assetTagNumber?: string;
  serialNumber?: string;
  modelNumber?: string;
  status?: string;
  subStatus?:string;
  issuedDate?: Date;
  submittedDate?: Date;
  resolvedDate?: Date;
}

export interface INewRequest {
  inventoryId:string;
  priority:string;
  description:string;
  address:string;
  phoneNumber?:string;
}
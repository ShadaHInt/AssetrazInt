export interface IOldAsset {
  inventoryOtherSourceId?: string;
  inventoryId?: string;
  documentId?: string;
  documentNumber?: string;
  networkCompanyId: string;
  networkCompanyName?: string;
  receivedDate: Date;
  categoryList?: string[];
  manufacturerId: string;
  manufacturerName: string;
  modelNumber?: string;
  warrantyDate?: Date;
  serialNumber?: string;
  specifications?: string;
  assetTagNumber?: string;
  categoryId: string;
  categoryName: string;
  invoiceNumber?: string;
  invoiceDate?: Date;
  supportingDocumentFilePath?: string;
  fileName?: string;
  referenceNumber?:string;
  invoiceId?:string;
}

export interface IOldAssetModalType {
  selectedReferenceIdAssets?: IOldAsset[];
  selectedAssets?:IOldAsset[];
  selectedReferenceNumber?: string;
  dismissPanel: (isSuccess?: boolean) => any;
  isModalOpen: boolean;
  isAccountsAdmin: boolean; 
}
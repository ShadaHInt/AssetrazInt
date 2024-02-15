export interface IOtherSourceInventory {
    inventoryOtherSourceId?: string;
    inventoryId?: string;
    documentID?: string;
    documentNumber?:string;
    networkCompanyId?: string;
    networkCompanyName?: string;
    receivedDate: Date;
    sourceID?: string;
    sourceName: string;
    categoryList: string[];
    notes?: string;
    manufacturerId?: string;
    modelNumber?: string;
    warrantyDate?: Date;
    serialNumber?: string;
    assetStatus?:string;
    specifications?: string;
    assetTagNumber?: string;
    assetValue?: number;
    categoryId?: string;
    supportingDocumentFilePath?: string | any;
    supportingDocumentFile?: Blob | null;
    fileName?: string | any;
    cutOverStock?:string;
}

export interface OtherSourceInventoryProps {
  id?: string | number;
  inventoryOtherSourceId?: string;
  inventoryId?: string;
  documentID?: string;
  networkCompanyId?: string;
  networkCompanyName?: string;
  receivedDate?: Date;
  sourceId?: string;
  sourceName?: string;
  notes?: string;
  manufacturerId?: string;
  manufacturerName?: string;
  modelNumber?: string;
  warrantyDate?: Date;
  serialNumber?: string;
  assetStatus?:string;
  specifications?: string;
  assetTagNumber?: string | null;
  assetValue?: string;
  issuable?:boolean;
  categoryId?: string;
  categoryName?: string;
  supportingDocumentFilePath?: string | any;
  supportingDocumentFile?: Blob | null;
  fileName?: string | any;
  cutOverStock?:boolean | undefined;
  documentNumber?:string | undefined;
}
  
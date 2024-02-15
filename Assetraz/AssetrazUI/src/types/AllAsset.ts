export interface IAllAsset {
    inventoryId?: string;
    modelNumber?: string;
    serialNumber?: string;
    assetTagNumber?: string;
    userRequestNumber?: string;
    categoryName: string;
    networkCompanyId?: string;
    networkCompanyName?: string;
    manufacturerName: string;
    inventoryOtherSourceId?: string;
    documentID?: string;
    documentNumber?: string;
    supportingDocumentFilePath?: string;
    supportingFileName?: string;
    invoiceId?: string;
    invoiceNumber?: string;
    invoiceDate?: Date;
    invoiceFilePath?: string;
    invoiceFileName?: string;
    purchaseOrderRequestId?: string;
    purchaseOrderNumber?: string;
    poGeneratedOn?: Date;
}

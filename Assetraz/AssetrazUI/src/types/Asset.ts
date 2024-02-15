interface IAsset {
    inventoryId: string;
    trackId:string;
    purchaseOrderRequestId: string;
    categoryId: string;
    categoryName: string;
    manufacturerName: string;
    modelNumber: string;
    specifications?: string;
    warrentyDate: Date;
    serialNumber: string;
    assetTagNumber: string;
    issuable: boolean;
    assetValue: number;
    insuranceRequired: boolean;
    assetStatus: string;
    issuedTo: string;
    issuedBy?: string;
    issuedDate?: string;
    emailId?: string;
    returnDate: Date;
    reason: string;
    networkCompany: string;
    warrentyStatus: string;
    networkCompanyName?: string;
}

export default IAsset;

export type AssetDetails = {
    inventoryId: string;
    networkCompanyId: string;
    networkCompanyName:string;
    categoryId:string;
    categoryName:string;
    manufacturerId:string;
    manufacturerName:string
    modelNumber?:string;
    assetTagNumber?:string;
    serialNumber?:string;
    warrantyDate?:Date
}

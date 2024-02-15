export type ScrapList = {
    scrapAssetId: string;
    categoryName: string;
    manufacturerName: string;
    modelNumber: string;
    warrentyDate: Date;
    serialNumber: string;
    assetTagNumber: string;
    scrappedDate: Date;
    markedBy: string;
    status: string;
    remarks: string;
    networkCompanyName: string;
    inventoryId: string;
    refurbishedAssetId?: string;
};

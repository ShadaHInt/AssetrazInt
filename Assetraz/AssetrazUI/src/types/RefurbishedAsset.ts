export interface RefurbishedAsset {
  refurbishAssetId?: string;
  inventoryId?: string;
  categoryName: string;
  manufacturerName: string;
  modelNumber?: string;
  warrentyDate?: Date;
  serialNumber?: string;
  assetTagNumber?: string;
  returnDate?: string;
  returnedBy: string;
  issuedBy: string;
  reason?: string;
  status: string;
  refurbishedDate?: Date;
  issuable: boolean;
  remarks?: string;
  addToScrap: boolean;
  scrappedDate?: Date;
  networkCompanyName?: string;
  isLatestEntry?: boolean;
}
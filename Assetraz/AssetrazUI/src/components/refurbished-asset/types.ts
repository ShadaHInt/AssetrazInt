export interface  IRefurbishedAssetModalType {
  refurbishedAssetId: string;
  selectedAssetId:string | undefined;
  dismissPanel: (isSuccess?: boolean) => any;
}

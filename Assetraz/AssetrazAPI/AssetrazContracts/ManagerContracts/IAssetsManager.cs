using AssetrazContracts.DTOs;

namespace AssetrazContracts.ManagerContracts
{
    public interface IAssetsManager
    {
        List<AssetDto> GetAssets();
        Task<List<AssetDetailsDto>> GetAssetsReport();
        Task<List<AssetTrackDto>> GetAssetsActivityReport();
        Task<bool> IssueAsset(AssetTrackDto assetTrackDto);
        Task<bool> ReturnAsset(AssetTrackDto assetTrackDto);
        Task<AssetDetailsDto> GetAssetDetails(Guid inventoryId);
        Task<List<AssetDto>> GetAssetsByUser(string? userEmail);
        Task<List<AssetDto>> GetAssetsFromInvoice(Guid invoiceId);
        Task<bool> UpdateAssetDetails(List<AssetDto> assets, Guid invoiceId, bool register);
        Task<List<RefurbishedAssetDto>> GetRefurbishedAssets();
        Task<RefurbishedAssetDto> GetRefurbishedAssetById(Guid inventoryId);
        Task<bool> UpdateRefurbishedAsset(RefurbishedAssetDto refurbishedAsset, Guid inventoryId);
        Task<List<ScrapListDto>> GetScrapList();
        Task<List<OtherSourcesInventoryDto>> GetOtherSourcesInventory();
        Task<List<OtherSourcesInventoryDto>> GetOtherSourceInventoryById(Guid inventoryOtherSourceId);
        Task<Guid> AddOtherSourceInventory(List<OtherSourcesInventoryDto> otherSourcesInventoryDto,bool register);
        Task<bool> UploadSupportDocument(InventoryFileDto inventoryFileDto );
        Task<(Stream, string, string)> DownloadSupportDocument(Guid inventoryOtherSourceId);
        Task<bool> DeleteSupportDocument(Guid inventoryOtherSourceId);
        Task<Guid> UpdateOtherSourceInventory(List<OtherSourcesInventoryDto> otherSourcesInventoryDto, bool register, Guid inventoryOtherSourceId);
        Task<List<AssetDto>> GetIssuedAssetsByUser();
        Task<List<CutOverAssetDto>> GetCutOverAssets();
        Task<bool> DeleteAssetfromScrapList(Guid refurbishedAssetId);
        Task<List<AssetDetailsDto>> GetIssuableAssetsCategory(Guid categoryId);
        Task<List<ReOrderLevelsDto>> GetReorderLevelNotification();
        Task<List<AllAssetDto>> GetAllAssets();
        Task<bool> UpdateAsset(AllAssetDto asset);
        Task<List<AssetRegisterDto>> GetAssetsList();
    }
}

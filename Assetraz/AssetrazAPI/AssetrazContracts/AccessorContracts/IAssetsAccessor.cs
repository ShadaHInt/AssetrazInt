using AssetrazContracts.DTOs;
using Microsoft.AspNetCore.Http;

namespace AssetrazContracts.AccessorContracts
{
    public interface IAssetsAccessor
    {
        List<AssetDto> GetAssets();
        Task<List<AssetDetailsDto>> GetAssetsReport();
        Task<List<AssetTrackDto>> GetAssetsActivityReport();

        Task<AssetDetailsDto> GetAssetDetails(Guid inventoryId);
        Task<List<AssetDto>> GetAssetsByUser(string? userEmail);
        Task<List<AssetDto>> GetAssetsFromInvoice(Guid invoiceId);
        Task<Guid> UpdateAssetDetails(List<AssetDto> assets, Guid invoiceId, bool register);
        Task<List<RefurbishedAssetDto>> GetRefurbishedAssets();
        List<string?> GetInventoryAssetTag(bool edited);
        List<string?> GetInventorySerialNumber(bool edited);
        Task<RefurbishedAssetDto> GetRefurbishedAssetById(Guid inventoryId);
        Task<bool> UpdateRefurbishedAsset(RefurbishedAssetDto refurbishedAsset, Guid inventoryId);
        Task<List<ScrapListDto>> GetScrapList();
        Task<List<OtherSourcesInventoryDto>> GetOtherSourcesInventory();
        Task<List<OtherSourcesInventoryDto>> GetOtherSourceInventoryById(Guid inventoryOtherSourceId);
        Task<Guid> AddOtherSourceInventory(List<OtherSourcesInventoryDto> otherSourcesInventoryDto,bool register);
        Task<bool> UpdateSupportDocument(InventoryFileDto inventoryFileDto );
        Task<string> GetSupportDocumentFilePath(Guid inventoryOtherSourceId);
        Task<bool> DeleteSupportDocument(Guid inventoryOtherSourceId);
        bool CheckOtherSourcesInventory(Guid sourceId);
        Task<Guid> UpdateOtherSourceInventory(List<OtherSourcesInventoryDto> otherSourcesInventoryDto, bool register, Guid inventoryOtherSourceId);
        List<Guid> GetExistingCategoriesFromInventories();
        List<AssetDto> GetExsistingAssets(List<AssetDto> updatedAsset);
        Task<List<AssetDto>> GetIssuedAssetsByUser();
        bool IsNetworkCompanyExistsInInventories(Guid networkCompanyId);
        Task<List<CutOverAssetDto>> GetCutOverAssets();

        Task<bool> DeleteAssetfromScrapList(Guid refurbishedAssetId);
        Task<bool> ReturnScrapItem(Guid refurbishedAssetId);
        Task<List<AssetDetailsDto>> GetIssuableAssetsCategory(Guid categoryId);
        Task<List<ReOrderLevelsDto>> GetReorderLevelNotification();
        Task<List<AllAssetDto>> GetAllAssets();
        Task<bool> UpdateAsset(AllAssetDto asset);
        Task<List<AssetRegisterDto>> GetAssetsList();

    }
}

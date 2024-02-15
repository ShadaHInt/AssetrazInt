using AssetrazAccessors;
using AssetrazContracts.AccessorContracts;
using AssetrazContracts.DTOs;
using AssetrazContracts.EngineContracts;
using AssetrazContracts.Exceptions;
using AssetrazContracts.ManagerContracts;
using QueueProcess = AssetrazContracts.Enums.QueueProcess;

namespace AssetrazManagers
{
    public class AssetsManager : IAssetsManager
    {
        private IAssetsAccessor assetsAccessor;
        private IAssetsTrackAccessor _assetsTrackAccessor;
        private readonly IFunctionQueueEngine _functionQueueEngine;
        private readonly ISupportDocumentBlobEngine _supportDocumentBlobEngine;

        public AssetsManager(IAssetsAccessor AssetsAccessor, IAssetsTrackAccessor assetsTrackAccessor, IFunctionQueueEngine functionQueueEngine, ISupportDocumentBlobEngine supportDocumentBlobEngine)
        {
            assetsAccessor = AssetsAccessor;
            _assetsTrackAccessor = assetsTrackAccessor;
            _functionQueueEngine = functionQueueEngine;
            _supportDocumentBlobEngine = supportDocumentBlobEngine;
        }

        public async Task<AssetDetailsDto> GetAssetDetails(Guid inventoryId)
        {
            return await assetsAccessor.GetAssetDetails(inventoryId);
        }

        public async Task<List<AssetDetailsDto>> GetAssetsReport()
        {
            return await assetsAccessor.GetAssetsReport();
        }

        public async Task<List<AssetTrackDto>> GetAssetsActivityReport()
        {
            return await assetsAccessor.GetAssetsActivityReport();
        }

        public List<AssetDto> GetAssets()
        {
            return assetsAccessor.GetAssets();
        }

        public async Task<bool> IssueAsset(AssetTrackDto assetTrackDto)
        {
            return await _assetsTrackAccessor.IssueAsset(assetTrackDto);
        }

        public async Task<bool> ReturnAsset(AssetTrackDto assetTrackDto)
        {
            return await _assetsTrackAccessor.ReturnAsset(assetTrackDto);
        }

        public async Task<List<AssetDto>> GetAssetsByUser(string? userEmail)
        {
            return await assetsAccessor.GetAssetsByUser(userEmail);
        }

        public async Task<bool> UpdateAssetDetails(List<AssetDto> assets, Guid invoiceId, bool register)
        {
            var  excludeAssets = assetsAccessor.GetExsistingAssets(assets).Select(c => c.AssetTagNumber);
            var excludeSerialNumbers = assetsAccessor.GetExsistingAssets(assets).Select(c => c.SerialNumber);

            List<string?> incomingAssetTags = assets.Select(e => e.AssetTagNumber ).Except(excludeAssets).ToList();
            List<string?> incomingSerialNumbers = assets.Select(e => e.SerialNumber).Except(excludeSerialNumbers).ToList();
            var edited = false;
            ValidateDuplicateAssetTag(incomingAssetTags,edited);
            ValidateDuplicateSerialNumber(incomingSerialNumbers, edited);
                var purchaseOrderRequestId = await assetsAccessor.UpdateAssetDetails(assets, invoiceId, register);
                if (purchaseOrderRequestId != Guid.Empty && register)
                {
                    return await _functionQueueEngine.PushMessage(new QueueMessageDto
                    {
                        Process = QueueProcess.AccountsTeamNotification,
                        ProcessId = purchaseOrderRequestId
                    });
                }
                else return purchaseOrderRequestId != Guid.Empty ? true : false;
               
        }
        public async Task<List<AssetDto>> GetAssetsFromInvoice(Guid invoiceId)
        {
            return await assetsAccessor.GetAssetsFromInvoice(invoiceId);
        }

        public async Task<List<RefurbishedAssetDto>> GetRefurbishedAssets()
        {
            return await assetsAccessor.GetRefurbishedAssets();
        }
        public async Task<RefurbishedAssetDto> GetRefurbishedAssetById(Guid refurbishAssetId)
        {
            RefurbishedAssetDto refurbishedAsset = await assetsAccessor.GetRefurbishedAssetById(refurbishAssetId);
            if (refurbishedAsset != null)
            {
                return refurbishedAsset;
            }
            else
            {
                throw new NullReferenceException($"Couldn't find record for {refurbishedAsset}");
            }
        }
        public async Task<bool> UpdateRefurbishedAsset(RefurbishedAssetDto refurbishedAsset, Guid refurbishAssetId)
        {
            RefurbishedAssetDto refurbishmentAsset = await assetsAccessor.GetRefurbishedAssetById(refurbishAssetId);
            if (refurbishmentAsset != null)
            {
                return await assetsAccessor.UpdateRefurbishedAsset(refurbishedAsset, refurbishAssetId);
            }
            else
            {
                throw new NullReferenceException($"Couldn't find record for {refurbishedAsset}");
            }
        }

        public async Task<List<ScrapListDto>> GetScrapList()
        {
            return await assetsAccessor.GetScrapList();
        }

        public async Task<List<OtherSourcesInventoryDto>> GetOtherSourcesInventory()
        {
            return await assetsAccessor.GetOtherSourcesInventory();
        }

        public async Task<List<OtherSourcesInventoryDto>> GetOtherSourceInventoryById(Guid inventoryOtherSourceId)
        {
            return await assetsAccessor.GetOtherSourceInventoryById(inventoryOtherSourceId);
        }

        public async Task<Guid> AddOtherSourceInventory(List<OtherSourcesInventoryDto> otherSourcesInventoryDto,bool register)
        {

            List<string?> incomingAssetTags = otherSourcesInventoryDto.Select(e => e.AssetTagNumber).ToList();
            List<string?> incomingSerialNumbers = otherSourcesInventoryDto.Select(e=>e.SerialNumber).ToList();
            var edited = false;

            ValidateDuplicateAssetTag(incomingAssetTags,edited);
            ValidateDuplicateSerialNumber(incomingSerialNumbers, edited);


            return await assetsAccessor.AddOtherSourceInventory(otherSourcesInventoryDto, register);

        }

        public async Task<bool> UploadSupportDocument(InventoryFileDto inventoryFileDto )
        {
            var response = await _supportDocumentBlobEngine.UploadSupportDocument(inventoryFileDto);
            if (response)
                return await assetsAccessor.UpdateSupportDocument(inventoryFileDto);

            return false;
        }

        public async Task<(Stream, string, string)> DownloadSupportDocument(Guid inventoryOtherSourceId)
        {
            string filePath = await assetsAccessor.GetSupportDocumentFilePath(inventoryOtherSourceId);
            string fileName = filePath.Split("/").LastOrDefault();

            var result = await _supportDocumentBlobEngine.DownloadSupportDocument(filePath);

            return (result.Item1, result.Item2, fileName);
        }

        public async Task<bool> DeleteSupportDocument(Guid inventoryOtherSourceId)
        {
            string filePath = await assetsAccessor.GetSupportDocumentFilePath(inventoryOtherSourceId);
            var response = await _supportDocumentBlobEngine.DeleteSupportDocument(filePath);

            if (response)
                return await assetsAccessor.DeleteSupportDocument(inventoryOtherSourceId);

            return false;
        }

        public async Task<Guid> UpdateOtherSourceInventory( List<OtherSourcesInventoryDto> otherSourcesInventoryDto, bool register, Guid inventoryOtherSourceId )
        {
            List<string?> incomingAssetTags = otherSourcesInventoryDto.Select(e => e.AssetTagNumber).ToList();
            List<string?> incomingSerialNumbers = otherSourcesInventoryDto.Select(e => e.SerialNumber).ToList();
            var edited = true;
            ValidateDuplicateAssetTag(incomingAssetTags,edited);
            ValidateDuplicateSerialNumber(incomingSerialNumbers, edited);
            await ValidateDuplicateAssetTagSerialNumberInOtherSource(incomingAssetTags, incomingSerialNumbers, inventoryOtherSourceId);
            return await assetsAccessor.UpdateOtherSourceInventory(otherSourcesInventoryDto, register, inventoryOtherSourceId);
            
        }

        public async Task<List<AssetDto>> GetIssuedAssetsByUser()
        {
            return await assetsAccessor.GetIssuedAssetsByUser();
        }

        private void ValidateDuplicateAssetTag(List<string?> incomingAssetTags,bool edited)
        {
            var inventoryAssetTags = assetsAccessor.GetInventoryAssetTag(edited);
            if((inventoryAssetTags.Intersect(incomingAssetTags)).Any())
            {
                throw new DuplicateAssetTagException("Duplicate asset tag number found in DB!");
            }
        }
        private void ValidateDuplicateSerialNumber(List<string?> incomingSerialNumbers, bool edited)
        {
            List<string?> trimmedSerialNumbers = incomingSerialNumbers
                .Where(serialNumber => !string.IsNullOrEmpty(serialNumber))
                .Select(serialNumber =>
                {
                    if (!string.IsNullOrEmpty(serialNumber))
                    {
                        string formatted = string.Join(" ", serialNumber.Split((char[])null, StringSplitOptions.RemoveEmptyEntries));
                        return formatted.ToLower();
                    }
                    return serialNumber;
                }).ToList();

            var serialNumbers = assetsAccessor.GetInventorySerialNumber(edited);
            var commonDuplicates = trimmedSerialNumbers
                                    .GroupBy(serialNumber => serialNumber)
                                    .Where(group => group.Count() > 1)
                                    .Select(group => group.Key)
                                    .ToList();

            var lowercaseSerialNumbers = serialNumbers.Select(s => s?.ToLower());

            if (commonDuplicates.Any() || (lowercaseSerialNumbers.Intersect(trimmedSerialNumbers)).Any())
            {
                 throw new DuplicateSerialNumberException("Duplicate serial number found in DB!");
            }
        }
        public async Task<List<CutOverAssetDto>> GetCutOverAssets()
        {
            return await assetsAccessor.GetCutOverAssets();
        }

        public async Task<bool> DeleteAssetfromScrapList(Guid refurbishedAssetId)
        {
            var response = await assetsAccessor.DeleteAssetfromScrapList(refurbishedAssetId);
            if(response)
                return await assetsAccessor.ReturnScrapItem(refurbishedAssetId);

            return false;
        }

        public async Task<List<AssetDetailsDto>> GetIssuableAssetsCategory(Guid categoryId)
        {
            return await assetsAccessor.GetIssuableAssetsCategory(categoryId);
        }

        public async Task<List<ReOrderLevelsDto>> GetReorderLevelNotification()
        {
            return await assetsAccessor.GetReorderLevelNotification();
        }

        public async Task ValidateDuplicateAssetTagSerialNumberInOtherSource(List<string> assetTagNumbers, List<string> serialNumbers, Guid otherSourceId)
        {
            var otherSourceDetails = await assetsAccessor.GetOtherSourcesInventory();
            otherSourceDetails =  otherSourceDetails.Where(i=>i.AssetStatus == String.Empty && i.InventoryOtherSourceId != otherSourceId).ToList();

            var assetTagSet = new HashSet<string>(assetTagNumbers);
            var serialNumberSet = new HashSet<string>(serialNumbers);

            foreach (var item in otherSourceDetails)
            {
                if (item.AssetTagNumber != null && assetTagSet.Contains(item.AssetTagNumber))
                {
                    throw new DuplicateAssetTagException("Duplicate asset tag number found in DB!");
                }

                if (item.SerialNumber != null && serialNumberSet.Contains(item.SerialNumber))
                {
                    throw new DuplicateSerialNumberException("Duplicate serial number found in DB!");
                }
            }

        }

        public async Task<List<AllAssetDto>> GetAllAssets()
        {
            return await assetsAccessor.GetAllAssets();
        }

        public async Task<bool> UpdateAsset(AllAssetDto asset)
        {
            AssetDetailsDto assetDetails = await GetAssetDetails(asset.InventoryId);
            string? currentAssetTag = assetDetails.AssetTagNumber;
            string? currentSerialNumber = assetDetails.SerialNumber;
            List<string?> incomingAssetTags = new() { asset.AssetTagNumber != currentAssetTag ? asset.AssetTagNumber : null };
            List<string?> incomingSerialNumbers = new() { asset.SerialNumber != currentSerialNumber ? asset.SerialNumber : null };
            var edited = false;
            ValidateDuplicateAssetTag(incomingAssetTags, edited);
            ValidateDuplicateSerialNumber(incomingSerialNumbers, edited);

            return await assetsAccessor.UpdateAsset(asset);
        }
        public async Task<List<AssetRegisterDto>> GetAssetsList()
        {
            return await assetsAccessor.GetAssetsList();
        }
    }
}

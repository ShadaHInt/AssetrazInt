using AssetrazAccessors.Common;
using AssetrazContracts.DTOs;
using AssetrazContracts.Enums;
using AssetrazDataProvider;
using AssetrazDataProvider.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace AssetrazAccessors
{
    public class AssetsTrackAccessor : AccessorCommon, IAssetsTrackAccessor
    {
        private AssetrazContext _context;

        public AssetsTrackAccessor(AssetrazContext context, IHttpContextAccessor httpAccessor) :base(httpAccessor)
        {
            _context = context;
        }


        public async Task<bool> IssueAsset(AssetTrackDto assetTrackDto)
        {
            Inventory? asset = await _context.Inventories.FirstOrDefaultAsync(i => i.InventoryId == assetTrackDto.InventoryId);
            if (asset == null)
            {
                throw new ArgumentException($"Asset of inventory id does not exist", nameof(assetTrackDto.InventoryId));
            }

            bool isAvailable = asset.AssetStatus == AssetStatus.Available.ToString();
            if (!isAvailable) return false;

            InventoryTrackRegister record = new()
            {
                TrackId = Guid.NewGuid(),
                InventoryId = assetTrackDto.InventoryId,
                EmailId = assetTrackDto.EmailId,
                IssuedTo = assetTrackDto.IssuedTo,
                IssuedDate = DateTime.Now.ToUniversalTime(),
                CreatedDate = DateTime.Now.ToUniversalTime(),
                UpdatedDate = DateTime.Now.ToUniversalTime(),
                CreatedBy = LoggedInUser,
                UpdatedBy = LoggedInUser,
            };

            asset.AssetStatus = AssetStatus.Issued.ToString();
            asset.UserRequestNumber = assetTrackDto.userRequestNumber;
            await _context.InventoryTrackRegisters.AddAsync(record);

            if (assetTrackDto.userRequestNumber!=null)
            {
                PurchaseRequest purchaseRequestData = await _context.PurchaseRequests.FirstOrDefaultAsync(c => c.PurchaseRequestNumber == assetTrackDto.userRequestNumber);
                purchaseRequestData.Status = RequestStatus.Issued.ToString();
            }
            
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> ReturnAsset(AssetTrackDto assetTrackDto)
        {
            Inventory? asset = await _context.Inventories.FirstOrDefaultAsync(i => i.InventoryId == assetTrackDto.InventoryId);
            if (asset == null)
            {
                throw new ArgumentException($"Asset of inventory id does not exist", nameof(assetTrackDto.InventoryId));
            }
              
            bool isIssued = asset.AssetStatus == AssetStatus.Issued.ToString();
            if (!isIssued) return false;

            InventoryTrackRegister? inventoryTracker = await _context.InventoryTrackRegisters
                .FirstOrDefaultAsync(itr => itr.InventoryId == assetTrackDto.InventoryId && !itr.ReturnDate.HasValue);

            if (inventoryTracker == null)
            {
                throw new NullReferenceException("Cannot trace the asset");
            }

            inventoryTracker.UpdatedDate = DateTime.Now.ToUniversalTime();
            inventoryTracker.UpdatedBy = LoggedInUser;
            inventoryTracker.ReturnDate = DateTime.Now.ToUniversalTime();
            inventoryTracker.Reason = assetTrackDto.Reason!.ToString();
            inventoryTracker.Remarks = assetTrackDto.Remarks ?? null;

            asset.AssetStatus = AssetStatus.Returned.ToString();
            asset.Issuable = false;

            var newRefurbishedAsset = new RefurbishedAsset();
            newRefurbishedAsset.RefurbishAssetId = Guid.NewGuid();
            newRefurbishedAsset.InventoryId = assetTrackDto.InventoryId;
            newRefurbishedAsset.ReturnedDate = DateTime.Now.ToUniversalTime();
            newRefurbishedAsset.CreatedDate = DateTime.Now.ToUniversalTime();
            newRefurbishedAsset.Status = RefurbishmentStatus.NotStarted.ToString();
            newRefurbishedAsset.CreatedBy = LoggedInUserName;
            newRefurbishedAsset.Reason= assetTrackDto.Reason;
            newRefurbishedAsset.ReturnedBy = assetTrackDto.IssuedTo;

            _context.RefurbishedAssets.Add(newRefurbishedAsset);

            return await _context.SaveChangesAsync() > 0;
        }
    }
}

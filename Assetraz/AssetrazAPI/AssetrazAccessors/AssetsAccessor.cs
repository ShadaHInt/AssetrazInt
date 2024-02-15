using AssetrazAccessors.Common;
using AssetrazContracts.AccessorContracts;
using AssetrazContracts.DTOs;
using AssetrazContracts.Enums;
using AssetrazContracts.LoggerContracts;
using AssetrazDataProvider;
using AssetrazDataProvider.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Graph;
using System.Data;


namespace AssetrazAccessors
{
    public class AssetsAccessor : AccessorCommon, IAssetsAccessor
    {
        private readonly IMapper mapper;
        private AssetrazContext dbContext;
        private readonly ILogAnalytics _log;
        private readonly int _insurableAssetValue;
        public AssetsAccessor(AssetrazContext DbContext, IMapper Mapper, IHttpContextAccessor httpAccessor, ILogAnalytics log, IConfiguration configuration) : base(httpAccessor)
        {
            dbContext = DbContext;
            mapper = Mapper;
            _log = log;
            _insurableAssetValue = int.Parse(configuration.GetSection("InsurableAssetValue").Value);
        }

        public DateTime? ConvertUtcToLocal(DateTime? utcDateTime)
        {
            if (utcDateTime.HasValue)
            {
                return utcDateTime.Value.ToLocalTime();
            }
            return null;
        }

        public async Task<List<AssetDetailsDto>> GetAssetsReport()
        {
            var assetDetails = await dbContext.Inventories
                .Include(i => i.Manufacturer)
                .Include(i => i.Category)
                .ToListAsync();

            var assetTrackList = await dbContext.InventoryTrackRegisters.ToListAsync();
            var invoiceList = await dbContext.Invoices.ToListAsync();
            var purchaseOrderList = await dbContext.PurchaseOrderHeaders.Include(poh => poh.NetworkCompany).Include(poh => poh.Vendor).ToListAsync();
            var networkCompany = await dbContext.NetworkCompanies.ToListAsync();
            List<AssetDetailsDto> assetDetailsDto = mapper.Map<List<AssetDetailsDto>>(assetDetails);

            foreach (AssetDetailsDto asset in assetDetailsDto)
            {
                if (asset.AssetStatus == AssetStatus.Issued.ToString())
                {
                    var assetTrack = assetTrackList.FirstOrDefault(atl => atl.InventoryId == asset.InventoryId && !atl.ReturnDate.HasValue);

                    asset.IssuedTo = assetTrack?.IssuedTo;
                    asset.EmailId = assetTrack?.EmailId;
                    asset.EmployeeId = assetTrack?.EmployeeId;
                    asset.IssuedDate = assetTrack?.IssuedDate.Value.Date;

                }
                if (asset.PurchaseOrderRequestId.HasValue)
                {
                    var invoice = invoiceList.FirstOrDefault(i => i.PurchaseOrderRequestId == asset.PurchaseOrderRequestId.Value);

                    asset.InvoiceDate = ConvertUtcToLocal(invoice.InvoiceDate);
                    asset.InvoiceNumber = invoice.InvoiceNumber;
                 

                    var purchaseOrder = purchaseOrderList.FirstOrDefault(po => po.PurchaseOrderRequestId == asset.PurchaseOrderRequestId);
                    asset.NetworkCompany = purchaseOrder.NetworkCompany.CompanyName;
                    asset.Vendor = purchaseOrder.Vendor.VendorName;
                }
                if (!asset.PurchaseOrderRequestId.HasValue)
                {
                    var invoice = invoiceList.FirstOrDefault(i => i.InventoryId == asset.InventoryId);
                    asset.InvoiceDate = ConvertUtcToLocal(invoice?.InvoiceDate) ?? new DateTime();
                    asset.InvoiceNumber = invoice?.InvoiceNumber;

                    asset.NetworkCompany = networkCompany.FirstOrDefault(po => po.NetworkCompanyId == asset.NetworkCompanyId).CompanyName;

                }
            }

            return assetDetailsDto;
        }

        public async Task<List<AssetTrackDto>> GetAssetsActivityReport()
        {
            var query = from i in dbContext.InventoryTrackRegisters
                        select new { InventoryId = i.InventoryId, ActivityStatus = "Issued", UpdatedBy = i.UpdatedBy, IssuedTo = i.IssuedTo, Remarks = i.Remarks, IssuedOrReturnedDate = i.IssuedDate };
            query = query.Union(from i in dbContext.InventoryTrackRegisters
                                where i.ReturnDate != null
                                select new { InventoryId = i.InventoryId, ActivityStatus = "Returned", UpdatedBy = i.UpdatedBy, IssuedTo = i.IssuedTo, Remarks = i.Remarks, IssuedOrReturnedDate = i.ReturnDate });
            query = query.OrderByDescending(i => i.IssuedOrReturnedDate);

            List<AssetTrackDto> asset = new List<AssetTrackDto>();
            asset = await (from itr in query
                           join i in dbContext.Inventories on itr.InventoryId equals i.InventoryId
                           select new AssetTrackDto
                           {
                               IssuedOrReturnedDate = itr.IssuedOrReturnedDate.Value.Date,
                               UpdatedBy = itr.UpdatedBy,
                               ActivityStatus = itr.ActivityStatus,
                               CategoryName = i.Category.CategoryName,
                               ModelNumber = i.ModelNumber,
                               AssetTagNumber = i.AssetTagNumber,
                               SerialNumber = i.SerialNumber,
                               IssuedTo = itr.IssuedTo,
                               Remarks = itr.Remarks

                           }).ToListAsync();


            return asset;
        }

        public async Task<AssetDetailsDto> GetAssetDetails(Guid inventoryId)
        {
            var assetDetails = await dbContext.Inventories
                .Include(i => i.Manufacturer)
                .Include(i => i.Category)
                .FirstOrDefaultAsync(i => i.InventoryId == inventoryId);

            var assetTrackList = await dbContext.InventoryTrackRegisters.ToListAsync();
            var invoiceList = await dbContext.Invoices.ToListAsync();
            var purchaseOrderList = await dbContext.PurchaseOrderHeaders.ToListAsync();

            AssetDetailsDto assetDetailsDto = mapper.Map<AssetDetailsDto>(assetDetails);

            if (assetDetailsDto.AssetStatus == AssetStatus.Issued.ToString())
            {
                var assetTrack = assetTrackList.FirstOrDefault(atl => atl.InventoryId == assetDetailsDto.InventoryId && !atl.ReturnDate.HasValue);

                assetDetailsDto.IssuedTo = assetTrack?.IssuedTo;
                assetDetailsDto.EmailId = assetTrack?.EmailId;
                assetDetailsDto.EmployeeId = assetTrack?.EmployeeId;

            }
            if (assetDetailsDto.PurchaseOrderRequestId.HasValue)
            {
                var invoice = invoiceList.FirstOrDefault(i => i.PurchaseOrderRequestId == assetDetailsDto.PurchaseOrderRequestId.Value);

                assetDetailsDto.InvoiceDate = invoice.InvoiceDate;
                assetDetailsDto.InvoiceNumber = invoice.InvoiceNumber;
            }
            if (!assetDetailsDto.PurchaseOrderRequestId.HasValue)
            {
                var invoice = invoiceList.FirstOrDefault(i => i.InventoryId == assetDetailsDto.InventoryId);
                assetDetailsDto.InvoiceDate = ConvertUtcToLocal(invoice?.InvoiceDate);
                assetDetailsDto.InvoiceNumber = invoice?.InvoiceNumber;
            }

                return assetDetailsDto;
        }

        public List<AssetDto> GetAssets()
        {
            var assets = from i in dbContext.Inventories
                         join n in dbContext.NetworkCompanies on i.NetworkCompanyId equals n.NetworkCompanyId
                         join cat in dbContext.Categories on i.CategoryId equals cat.CategoryId
                         join man in dbContext.Manufacturers on i.ManufacturerId equals man.ManfacturerId
                         where ((i.AssetStatus == AssetStatus.Available.ToString() || i.AssetStatus == AssetStatus.Issued.ToString()) && i.Issuable == true)
                         from t in dbContext.InventoryTrackRegisters
                         .Where(c => c.InventoryId == i.InventoryId)
                         .Where(c => c.ReturnDate == null)
                         .DefaultIfEmpty()
                         select new AssetDto
                         {
                             InventoryId = i.InventoryId,
                             CategoryName = cat.CategoryName,
                             ManufacturerName = man.ManufacturerName,
                             ModelNumber = i.ModelNumber,
                             WarrentyDate = i.WarrentyDate,
                             SerialNumber = i.SerialNumber,
                             AssetTagNumber = i.AssetTagNumber == null || i.AssetTagNumber == String.Empty ? i.InventoryId.ToString().Substring(0, 15) : i.AssetTagNumber,
                             AssetStatus = i.AssetStatus,
                             userRequestNumber = i.UserRequestNumber,
                             IssuedTo = t.IssuedTo,
                             IssuedDate = t.IssuedDate,
                             IssuedBy = t.CreatedBy,
                             NetworkCompanyName = n.CompanyName,
                         };

            //can possibly be null. check for exception handling
            var assetDtos = mapper.Map<List<AssetDto>>(assets);
           return assetDtos;
        }

        public async Task<List<AssetDto>> GetAssetsByUser(string? userEmail)
        {
            bool isLoggedInUser = String.IsNullOrEmpty(userEmail);
            List<InventoryTrackRegister> assets = await dbContext.InventoryTrackRegisters
                    .Include(c => c.Inventory)
                        .ThenInclude(c => c.Category)
                    .Include(c => c.Inventory)
                        .ThenInclude(c => c.Manufacturer)
                        .Where(p => p.EmailId == (isLoggedInUser ? LoggedInUser : userEmail))
                    .OrderByDescending(c => c.IssuedDate)
                    .ToListAsync();
            List<AssetDto> assetList = mapper.Map<List<AssetDto>>(assets);
            return assetList;
        }

        public async Task<List<AssetDto>> GetAssetsFromInvoice(Guid invoiceId)
        {
            List<PurchaseOrderDetail> orderDetails = await dbContext.PurchaseOrderDetails
                .Join(dbContext.Invoices.Where(i => i.InvoiceId == invoiceId), pod => pod.PurchaseOrderRequestId, i => i.PurchaseOrderRequestId, (pod, i) => pod)
                .ToListAsync();

            if (orderDetails == null)
                throw new ArgumentException("Order details not found for invoiceId", nameof(invoiceId));

            var query = dbContext.Inventories
                    .Include(i => i.Category)
                    .Include(i => i.Manufacturer)
                    .Where(i => i.PurchaseOrderRequestId == orderDetails.FirstOrDefault().PurchaseOrderRequestId)
                    .OrderBy(i => i.CategoryId)
                    .ThenBy(i => i.Manufacturer)
                    .ThenBy(i => i.ModelNumber);


            List<Inventory> inventories = await query.ToListAsync();

            int inventoriesCount = inventories.Count;

            List<Inventory> inventoriesToAdd = new();
            if (inventoriesCount == 0)
            {
                foreach (var orderDetail in orderDetails)
                {
                    for (int i = 0; i < orderDetail.Quantity; ++i)
                    {
                        inventoriesToAdd.Add(new Inventory()
                        {
                            InventoryId = Guid.NewGuid(),
                            CategoryId = orderDetail.CategoryId,
                            ManufacturerId = orderDetail.ManufacturerId,
                            ModelNumber = orderDetail.ModelNumber,
                            PurchaseOrderRequestId = orderDetail.PurchaseOrderRequestId,
                            Specifications = orderDetail.Specifications,
                            AssetStatus = String.Empty,
                            CreatedBy = LoggedInUser,
                            UpdatedBy = LoggedInUser,
                            CreatedDate = DateTime.Now.ToUniversalTime(),
                            UpdatedDate = DateTime.Now.ToUniversalTime(),
                            AssetValue = orderDetail.RatePerQuantity,
                        });
                    }
                }

                await dbContext.Inventories.AddRangeAsync(inventoriesToAdd);
                await dbContext.SaveChangesAsync();

                inventories = await query.ToListAsync();
            }
            return mapper.Map<List<AssetDto>>(inventories);
        }

        public async Task<Guid> UpdateAssetDetails(List<AssetDto> assets, Guid invoiceId, bool register)
        {
            List<PurchaseOrderDetail> purchaseOrderDetails = await dbContext.PurchaseOrderDetails
                .Join(dbContext.Invoices.Where(i => i.InvoiceId == invoiceId), pod => pod.PurchaseOrderRequestId, i => i.PurchaseOrderRequestId, (pod, i) => pod)
                .ToListAsync();
            if (purchaseOrderDetails == null)
                throw new NullReferenceException("Purchase details not found");

            List<Inventory> inventoryInvoiceNumber = await dbContext.Inventories
                    .Join(dbContext.Invoices.Where(i => i.InvoiceId == invoiceId), i => i.PurchaseOrderRequestId, i => i.PurchaseOrderRequestId, (inventory, invoice) => inventory)
                    .ToListAsync();

            Guid purchaseOrderRequestId = purchaseOrderDetails.First().PurchaseOrderRequestId;

            Guid networkCompanyId = dbContext.PurchaseOrderHeaders
                                   .Where(i => i.PurchaseOrderRequestId == purchaseOrderRequestId)
                                   .Select(i => i.NetworkCompanyId)
                                   .FirstOrDefault();

            foreach (AssetDto asset in assets)
            {
                Inventory existingInventory = inventoryInvoiceNumber.Find(e => e.InventoryId == asset.InventoryId);

                existingInventory.WarrentyDate = asset.WarrentyDate;
                existingInventory.AssetTagNumber = asset.AssetTagNumber;
                existingInventory.SerialNumber = asset.SerialNumber;
                existingInventory.AssetValue = asset.AssetValue;
                existingInventory.AssetStatus = register ? AssetStatus.Available.ToString() : String.Empty;
                existingInventory.Issuable = register ? asset.Issuable : false;
                existingInventory.NetworkCompanyId = networkCompanyId;
                existingInventory.UpdatedBy = LoggedInUser;
                existingInventory.UpdatedDate = DateTime.Now.ToUniversalTime();
            }

            List<InsuranceItem> itemsToAdd = new();
            if (register)
            {
                foreach (Inventory inventory in inventoryInvoiceNumber)
                {
                    inventory.AssetStatus = AssetStatus.Available.ToString();
                    //adding to Insurance table
                    if (inventory.AssetValue >= _insurableAssetValue)
                    {
                        itemsToAdd.Add(new InsuranceItem()
                        {
                            InsuranceReferenceId = Guid.NewGuid(),
                            CreatedDate = DateTime.Now.ToUniversalTime(),
                            InventoryId = inventory.InventoryId,
                            RequestRaisedOn = DateTime.Now.ToUniversalTime(),
                            Status = inventory.AssetStatus!,
                            CreatedBy = LoggedInUser,
                            UpdatedBy = LoggedInUser,
                            UpdatedDate = DateTime.Now.ToUniversalTime(),
                        });
                    }
                }
                dbContext.InsuranceItems.AddRange(itemsToAdd);

                Invoice invoice = await dbContext.Invoices.FirstOrDefaultAsync(i => i.InvoiceId == invoiceId);
                invoice.IsAssetAddedToInventory = true;
            }

            //When AssetStatus is Empty string, it means it is just saved, not registered
            return await dbContext.SaveChangesAsync() > 0 ? purchaseOrderRequestId : Guid.Empty;

        }

        public async Task<List<RefurbishedAssetDto>> GetRefurbishedAssets()
        {
            var refurbishedAssets = await dbContext.RefurbishedAssets
                .Where(a => (!a.RefurbishedDate.HasValue || a.Status == RefurbishmentStatus.Completed.ToString()))
                .OrderBy(a => a.Inventory.Category.CategoryName)
                .ThenBy(a => a.ReturnedDate)
                .Include(a => a.Inventory)
                    .ThenInclude(m => m.Manufacturer)
                .Include(a => a.Inventory)
                    .ThenInclude(a => a.Category)
                .Include(a => a.Inventory)
                .Join(
                    dbContext.NetworkCompanies,
                    i => i.Inventory.NetworkCompanyId,
                    n => n.NetworkCompanyId,
                    (i, n) => new { RefurbishedAsset = i, NetworkCompany = n }
                )
                .Select(i => new RefurbishedAssetDto
                {
                    InventoryId = i.RefurbishedAsset.InventoryId,
                    RefurbishAssetId = i.RefurbishedAsset.RefurbishAssetId,
                    CategoryName = i.RefurbishedAsset.Inventory.Category.CategoryName,
                    ManufacturerName = i.RefurbishedAsset.Inventory.Manufacturer.ManufacturerName,
                    ModelNumber = i.RefurbishedAsset.Inventory.ModelNumber,
                    WarrentyDate = i.RefurbishedAsset.Inventory.WarrentyDate,
                    SerialNumber = i.RefurbishedAsset.Inventory.SerialNumber,
                    AssetTagNumber = string.IsNullOrEmpty(i.RefurbishedAsset.Inventory.AssetTagNumber) 
                        ? i.RefurbishedAsset.Inventory.InventoryId.ToString().Substring(0, 15) 
                        : i.RefurbishedAsset.Inventory.AssetTagNumber,
                    RefurbishedDate = i.RefurbishedAsset.RefurbishedDate,
                    ReturnedBy = i.RefurbishedAsset.ReturnedBy!,
                    ReturnDate = i.RefurbishedAsset.ReturnedDate,
                    Issuable = i.RefurbishedAsset.Inventory.Issuable,
                    IssuedBy = i.RefurbishedAsset.Inventory.InventoryTrackRegisters
                    .Where(itr => itr.ReturnDate == i.RefurbishedAsset.CreatedDate)
                    .FirstOrDefault().CreatedBy,
                    Status = i.RefurbishedAsset.Status,
                    Remarks = i.RefurbishedAsset.Remarks,
                    Reason = i.RefurbishedAsset.Reason,
                    NetworkCompanyName = i.NetworkCompany.CompanyName,
                })
                .ToListAsync();

            return refurbishedAssets;
        }

        public List<string?> GetInventoryAssetTag(bool edited)
        {
            List<string?> inventoryAssetTags;
            if (edited)
            {
                inventoryAssetTags = dbContext.Inventories
                    .Where(e => e.AssetStatus != String.Empty && (e.AssetTagNumber != null && e.AssetTagNumber.Trim() != String.Empty))
                    .Select(e => e.AssetTagNumber).ToList();
            }
            else
            {
                inventoryAssetTags = dbContext.Inventories
                    .Where(e => (e.AssetTagNumber != null && e.AssetTagNumber.Trim() != String.Empty))
                    .Select(e => e.AssetTagNumber).ToList();
            }
            return inventoryAssetTags;
        }

        public List<string?> GetInventorySerialNumber(bool edited)
        {
            List<string?> inventorySerialNumbers;
            if (edited)
            {
                inventorySerialNumbers = dbContext.Inventories.Where(e => e.AssetStatus != String.Empty && e.SerialNumber != null).Select(e => e.SerialNumber).ToList();
            }
            else
            {
                inventorySerialNumbers = dbContext.Inventories.Where(e => e.SerialNumber != null).Select(e => e.SerialNumber).ToList();
            }
            return inventorySerialNumbers;
        }

        public async Task<RefurbishedAssetDto> GetRefurbishedAssetById(Guid refurbishAssetId)
        {
            var refurbishedAsset = await (from i in dbContext.RefurbishedAssets
                                           .Where(a => a.RefurbishAssetId == refurbishAssetId)
                                           .Include(a => a.Inventory)
                                               .ThenInclude(a => a.Manufacturer)
                                           .Include(a => a.Inventory)
                                               .ThenInclude(a => a.Category)
                                          let isLatestEntry = i.ReturnedDate == dbContext.RefurbishedAssets
                                              .Where(a => a.InventoryId == i.InventoryId)
                                              .Max(a => (DateTime?)a.ReturnedDate)
                                          select new RefurbishedAssetDto
                                          {
                                              InventoryId = i.InventoryId,
                                              RefurbishAssetId = i.RefurbishAssetId,
                                              CategoryName = i.Inventory.Category.CategoryName,
                                              ManufacturerName = i.Inventory.Manufacturer.ManufacturerName,
                                              ModelNumber = i.Inventory.ModelNumber,
                                              WarrentyDate = i.Inventory.WarrentyDate,
                                              SerialNumber = i.Inventory.SerialNumber,
                                              AssetTagNumber = i.Inventory.AssetTagNumber,
                                              RefurbishedDate = i.RefurbishedDate,
                                              ReturnedBy = i.ReturnedBy,
                                              ReturnDate = i.ReturnedDate,
                                              Issuable = i.Inventory.Issuable,
                                              Status = i.Status,
                                              Remarks = i.Remarks,
                                              Reason = i.Reason,
                                              IsLatestEntry = isLatestEntry,
                                          }).FirstOrDefaultAsync();

            return refurbishedAsset;
        }

        public async Task<bool> UpdateRefurbishedAsset(RefurbishedAssetDto refurbishedAsset, Guid refurbishAssetId)
        {
            var refurbishmentAsset = await dbContext.RefurbishedAssets.Where(a => a.RefurbishAssetId == refurbishAssetId).FirstOrDefaultAsync();
            refurbishmentAsset!.UpdatedBy = LoggedInUserName;
            refurbishmentAsset.UpdatedDate = DateTime.Now.ToUniversalTime();
            refurbishmentAsset.Status = refurbishedAsset.Status.ToString();
            refurbishmentAsset.RefurbishedDate = refurbishedAsset.RefurbishedDate;
            refurbishmentAsset.Remarks = refurbishedAsset.Remarks;
            refurbishmentAsset.RefurbishAssetId = (Guid)refurbishedAsset.RefurbishAssetId;            

            var asset = await dbContext.Inventories.FirstOrDefaultAsync(a => a.InventoryId == refurbishmentAsset.InventoryId);
            if (refurbishedAsset.Issuable)
            {
                asset!.Issuable = true;
                asset.AssetStatus = AssetStatus.Available.ToString();
            }
            else
            {
                asset!.Issuable = false;
                asset.AssetStatus = AssetStatus.Returned.ToString();
            }
            if (refurbishedAsset.AddToScrap)
            {
                var scrapListItem =  await dbContext.ScrapLists.Where(i => i.RefurbishedAssetId == refurbishAssetId).FirstOrDefaultAsync();

                if (scrapListItem == null)
                {
                    // add to scrap list
                    ScrapList newScrap = new()
                    {
                        ScrapAssetId = Guid.NewGuid(),
                        RefurbishedAssetId = refurbishmentAsset.RefurbishAssetId,
                        InventoryId = asset.InventoryId,
                        RefurbishedDate = refurbishmentAsset.RefurbishedDate ?? DateTime.Now.ToUniversalTime(),
                        RefurbishedBy = LoggedInUserName,
                        Status = "In Stock", //temporary
                        Remarks = refurbishedAsset.Remarks,
                        CreatedDate = DateTime.Now.ToUniversalTime(),
                        ScrappedDate = refurbishedAsset.ScrappedDate, // temp
                        CreatedBy = LoggedInUserName,
                    };

                    await dbContext.ScrapLists.AddAsync(newScrap);
                }

                if (scrapListItem != null)
                {
                    scrapListItem.RemovedFromScrap = null;
                    scrapListItem.ScrappedDate = refurbishedAsset.ScrappedDate;
                    scrapListItem.UpdatedDate = DateTime.Now.ToUniversalTime();
                    scrapListItem.UpdatedBy = LoggedInUserName;
                }

            }

            return await dbContext.SaveChangesAsync() > 0;
        }

        public async Task<List<ScrapListDto>> GetScrapList()
        {
            var scrapAssets = await (
                from i in dbContext.Inventories
                join s in dbContext.ScrapLists on i.InventoryId equals s.InventoryId 
                join n in dbContext.NetworkCompanies on i.NetworkCompanyId equals n.NetworkCompanyId
                where s.RemovedFromScrap == null

                select new ScrapListDto
                {
                    ScrapAssetId = s.ScrapAssetId,
                    RefurbishedAssetId = s.RefurbishedAssetId,
                    CategoryName = i.Category.CategoryName,
                    ManufacturerName = i.Manufacturer.ManufacturerName,
                    ModelNumber = i.ModelNumber,
                    WarrentyDate = i.WarrentyDate,
                    SerialNumber = i.SerialNumber,
                    AssetTagNumber = i.AssetTagNumber,
                    InventoryId = i.InventoryId,
                    ScrappedDate = s.ScrappedDate.Value,
                    MarkedBy = s.CreatedBy,
                    Remarks = s.Remarks,
                    Status = s.Status,
                    NetworkCompanyName = n.CompanyName,
                    UpdatedBy = LoggedInUser,
                    UpdatedDate = DateTime.Now.ToUniversalTime(),
                }).OrderBy(c => c.ScrappedDate).ToListAsync();

            var scrapListItems = mapper.Map<List<ScrapListDto>>(scrapAssets);
            return scrapListItems;
        }

        public bool CheckOtherSourcesInventory(Guid sourceId )
        {
            var otherSourcesInventory =dbContext.InventoriesOtherSourcesHeaders.Any(i=>i.SourceId== sourceId);
            return otherSourcesInventory;
        }

        public async Task<List<OtherSourcesInventoryDto>> GetOtherSourcesInventory()
        {

            var inventories = await (from i in dbContext.Inventories.Include(c => c.Category)
                                     join n in dbContext.NetworkCompanies on i.NetworkCompanyId equals n.NetworkCompanyId
                                     select new OtherSourcesInventoryDto
                                     {
                                         NetworkCompanyId = i.NetworkCompanyId.Value,
                                         NetworkCompanyName = n.CompanyName,
                                         CategoryName = i.Category.CategoryName,
                                         AssetStatus = i.AssetStatus,
                                         InventoryOtherSourceId = i.InventoryOtherSourceId.Value,
                                         CutOverStock = i.CutOverStock,
                                         AssetTagNumber=i.AssetTagNumber,
                                         SerialNumber=i.SerialNumber,
                                     }
                                     ).ToListAsync();

            var otherSourcesInventory = await (from o in dbContext.InventoriesOtherSourcesHeaders
                                               select new OtherSourcesInventoryDto
                                               {
                                                   InventoryOtherSourceId = o.InventoryOtherSourceId,
                                                   DocumentID = o.DocumentId,
                                                   SourceId = o.SourceId,
                                                   SourceName = o.Source.SourceName,
                                                   ReceivedDate = o.ReceivedDate,
                                                   Notes = o.Notes,
                                                   DocumentNumber = o.DocumentNumber,
                                               }).OrderBy(c => c.ReceivedDate).ToListAsync();

            foreach (var inventory in otherSourcesInventory)
            {
                var selectedInventory = inventories.Where(x => x.InventoryOtherSourceId != null && x.InventoryOtherSourceId == inventory.InventoryOtherSourceId);

                inventory.NetworkCompanyId = selectedInventory.FirstOrDefault().NetworkCompanyId;
                inventory.AssetStatus = selectedInventory.FirstOrDefault().AssetStatus;
                inventory.NetworkCompanyName = selectedInventory.FirstOrDefault().NetworkCompanyName;
                inventory.CategoryList = selectedInventory.Select(c => c.CategoryName).Distinct().ToList();
                inventory.CutOverStock = selectedInventory.FirstOrDefault().CutOverStock;
                inventory.AssetTagNumber = selectedInventory.FirstOrDefault()?.AssetTagNumber;
                inventory.SerialNumber= selectedInventory.FirstOrDefault()?.SerialNumber;
            }

            return otherSourcesInventory;
        }

        public async Task<List<OtherSourcesInventoryDto>> GetOtherSourceInventoryById(Guid inventoryOtherSourceId)
        {

            var otherSourcesInventory = await (

                from o in dbContext.InventoriesOtherSourcesHeaders
                join i in dbContext.Inventories on o.InventoryOtherSourceId equals i.InventoryOtherSourceId
                join n in dbContext.NetworkCompanies on i.NetworkCompanyId equals n.NetworkCompanyId
                join s in dbContext.Sources on o.SourceId equals s.SourceId into sourceGroup
                from s in sourceGroup.DefaultIfEmpty()
                where o.InventoryOtherSourceId == inventoryOtherSourceId
                select new OtherSourcesInventoryDto
                {
                    InventoryOtherSourceId = i.InventoryOtherSourceId,
                    InventoryId = i.InventoryId,
                    DocumentID = o.DocumentId,
                    NetworkCompanyId = (Guid)i.NetworkCompanyId,
                    NetworkCompanyName = n.CompanyName,
                    SourceId = o.SourceId,
                    SourceName = o.Source.SourceName,
                    ReceivedDate = o.ReceivedDate,
                    SupportingDocumentFilePath = o.SupportingDocumentFilePath,
                    Notes = o.Notes,
                    CategoryId = i.CategoryId,
                    CategoryName = i.Category.CategoryName,
                    ManufacturerId = i.ManufacturerId,
                    ManufacturerName = i.Manufacturer.ManufacturerName,
                    ModelNumber = i.ModelNumber,
                    WarrantyDate = i.WarrentyDate,
                    SerialNumber = i.SerialNumber,
                    Specifications = i.Specifications,
                    AssetTagNumber = i.AssetTagNumber,
                    AssetStatus = i.AssetStatus,
                    AssetValue = i.AssetValue,
                    CutOverStock = i.CutOverStock,
                    DocumentNumber = o.DocumentNumber,
                }).ToListAsync();
            return otherSourcesInventory;
        }

        public async Task<Guid> AddOtherSourceInventory(List<OtherSourcesInventoryDto> otherSourcesInventoryDtos, bool register)
        {
            Guid headerIdGuid = Guid.NewGuid();

            InventoriesOtherSourcesHeader otherSourceHeader = new InventoriesOtherSourcesHeader();

            otherSourceHeader.InventoryOtherSourceId = headerIdGuid;
            otherSourceHeader.ReceivedDate = otherSourcesInventoryDtos.First().ReceivedDate;
            otherSourceHeader.CreatedDate = otherSourceHeader.UpdatedDate = DateTime.Now.ToUniversalTime();
            otherSourceHeader.DocumentId = GetDocumentId();
            otherSourceHeader.SourceId = otherSourcesInventoryDtos.First().SourceId;
            otherSourceHeader.Notes = otherSourcesInventoryDtos.First().Notes;
            otherSourceHeader.CreatedBy = otherSourceHeader.UpdatedBy = LoggedInUser;
            otherSourceHeader.DocumentNumber = otherSourcesInventoryDtos.First().DocumentNumber ?? null;

            dbContext.InventoriesOtherSourcesHeaders.Add(otherSourceHeader);

            foreach (OtherSourcesInventoryDto otherSourceInventory in otherSourcesInventoryDtos)
            {
                Inventory inventory = new Inventory();

                inventory.InventoryId = Guid.NewGuid();
                inventory.InventoryOtherSourceId = headerIdGuid;
                inventory.NetworkCompanyId = otherSourcesInventoryDtos.First().NetworkCompanyId;
                inventory.ManufacturerId = otherSourceInventory.ManufacturerId;
                inventory.ModelNumber = otherSourceInventory.ModelNumber;
                inventory.WarrentyDate = otherSourceInventory.WarrantyDate;
                inventory.SerialNumber = otherSourceInventory.SerialNumber;
                inventory.Specifications = otherSourceInventory.Specifications;
                inventory.AssetTagNumber = otherSourceInventory.AssetTagNumber;
                inventory.AssetValue = otherSourceInventory.AssetValue;
                inventory.CreatedDate = inventory.UpdatedDate = DateTime.Now.ToUniversalTime();
                inventory.CreatedBy = inventory.UpdatedBy = LoggedInUser;
                inventory.CategoryId = otherSourceInventory.CategoryId;
                inventory.AssetStatus = register ? AssetStatus.Available.ToString() : String.Empty;
                inventory.Issuable = (bool)otherSourceInventory.Issuable;
                inventory.InsuranceRequired = false;
                inventory.CutOverStock = otherSourceInventory.CutOverStock;

                dbContext.Inventories.Add(inventory);

                if (register && otherSourceInventory.AssetValue >= _insurableAssetValue)
                {
                    InsuranceItem insuranceItem = new InsuranceItem();

                    insuranceItem.InsuranceReferenceId = Guid.NewGuid();
                    insuranceItem.CreatedDate = DateTime.Now.ToUniversalTime();
                    insuranceItem.InventoryId = inventory.InventoryId;
                    insuranceItem.RequestRaisedOn = DateTime.Now.ToUniversalTime();
                    insuranceItem.Status = inventory.AssetStatus;
                    insuranceItem.CreatedBy = LoggedInUser;
                    insuranceItem.UpdatedBy = LoggedInUser;
                    insuranceItem.UpdatedDate = DateTime.Now.ToUniversalTime();

                    dbContext.InsuranceItems.Add(insuranceItem);
                }

            }
            await dbContext.SaveChangesAsync();
            return otherSourceHeader.InventoryOtherSourceId;
        }

        public async Task<bool> UpdateSupportDocument(InventoryFileDto inventoryFileDto)
        {
            InventoriesOtherSourcesHeader otherSourceHeaders = await dbContext.InventoriesOtherSourcesHeaders
                            .FirstOrDefaultAsync(i => i.InventoryOtherSourceId == inventoryFileDto.InventoryOtherSourceId);

            otherSourceHeaders.SupportingDocumentFilePath = inventoryFileDto.SupportingDocumentFilePath;
            otherSourceHeaders.UpdatedDate = DateTime.Now.ToUniversalTime();
            otherSourceHeaders.UpdatedBy = LoggedInUser;


            return await dbContext.SaveChangesAsync() > 0;
        }

        public async Task<string> GetSupportDocumentFilePath(Guid inventoryOtherSourceId)
        {
            var supportingDocument = await dbContext.InventoriesOtherSourcesHeaders
                            .FirstOrDefaultAsync(o => o.InventoryOtherSourceId.Equals(inventoryOtherSourceId));
            if (supportingDocument == null)
            {
                throw new ArgumentNullException($"Other source inventory id:{inventoryOtherSourceId} not valid:");
            }
            return supportingDocument.SupportingDocumentFilePath;
        }

        public async Task<bool> DeleteSupportDocument(Guid inventoryOtherSourceId)
        {
            InventoriesOtherSourcesHeader otherSourceHeaders = await dbContext.InventoriesOtherSourcesHeaders
                            .FirstOrDefaultAsync(i => i.InventoryOtherSourceId == inventoryOtherSourceId);
            if (otherSourceHeaders == null)
            {
                throw new NullReferenceException($"Couldn't find record for {inventoryOtherSourceId}");
            }

            otherSourceHeaders.SupportingDocumentFilePath = null;
            otherSourceHeaders.UpdatedDate = DateTime.Now.ToUniversalTime();
            otherSourceHeaders.UpdatedBy = LoggedInUser;

            return await dbContext.SaveChangesAsync() > 0;
        }

        public async Task<Guid> UpdateOtherSourceInventory(List<OtherSourcesInventoryDto> otherSourcesInventoryDtos, bool register, Guid inventoryOtherSourceId)
        {
            var otherSourceHeader = await dbContext.InventoriesOtherSourcesHeaders
                .FirstOrDefaultAsync(o => o.InventoryOtherSourceId == inventoryOtherSourceId);

            otherSourceHeader.ReceivedDate = otherSourcesInventoryDtos.First().ReceivedDate;
            otherSourceHeader.SourceId = otherSourcesInventoryDtos.First().SourceId;
            otherSourceHeader.Notes = otherSourcesInventoryDtos.First().Notes;
            otherSourceHeader.UpdatedDate = DateTime.Now.ToUniversalTime();
            otherSourceHeader.UpdatedBy = LoggedInUser;
            otherSourceHeader.DocumentNumber = otherSourcesInventoryDtos.First().DocumentNumber ?? null;

            var existingInventories = await dbContext.Inventories
                .Where(i => i.InventoryOtherSourceId == otherSourcesInventoryDtos.First().InventoryOtherSourceId)
                .ToListAsync();

            var inventoriesToRemove = existingInventories
                .Where(i => !(otherSourcesInventoryDtos.Select(i => i.InventoryId).ToList()).Contains(i.InventoryId))
                .ToList();
            if(inventoriesToRemove.Any())
            {
                dbContext.Inventories.RemoveRange(inventoriesToRemove);
            }

            foreach (OtherSourcesInventoryDto otherSourceInventory in otherSourcesInventoryDtos)
            {
                var inventory = existingInventories.FirstOrDefault(i => i.InventoryId == otherSourceInventory.InventoryId);
                var newinventoryId = Guid.NewGuid();

                if (inventory != null)
                {
                    inventory.NetworkCompanyId = otherSourceInventory.NetworkCompanyId;
                    inventory.ManufacturerId = otherSourceInventory.ManufacturerId;
                    inventory.ModelNumber = otherSourceInventory.ModelNumber;
                    inventory.WarrentyDate = otherSourceInventory.WarrantyDate;
                    inventory.SerialNumber = otherSourceInventory.SerialNumber;
                    inventory.Specifications = otherSourceInventory.Specifications;
                    inventory.AssetTagNumber = otherSourceInventory.AssetTagNumber;
                    inventory.AssetValue = otherSourceInventory.AssetValue;
                    inventory.CategoryId = otherSourceInventory.CategoryId;
                    inventory.AssetStatus = register ? AssetStatus.Available.ToString() : String.Empty;
                    inventory.UpdatedBy = LoggedInUser;
                    inventory.UpdatedDate = DateTime.Now.ToUniversalTime();
                    inventory.CutOverStock = otherSourceInventory.CutOverStock;
                }
                else
                {
                    Inventory newEntry = new Inventory();

                    newEntry.InventoryId = newinventoryId;
                    newEntry.InventoryOtherSourceId = inventoryOtherSourceId;
                    newEntry.ManufacturerId = otherSourceInventory.ManufacturerId;
                    newEntry.NetworkCompanyId = otherSourcesInventoryDtos.First().NetworkCompanyId;
                    newEntry.ModelNumber = otherSourceInventory.ModelNumber;
                    newEntry.WarrentyDate = otherSourceInventory.WarrantyDate;
                    newEntry.SerialNumber = otherSourceInventory.SerialNumber;
                    newEntry.Specifications = otherSourceInventory.Specifications;
                    newEntry.AssetTagNumber = otherSourceInventory.AssetTagNumber;
                    newEntry.AssetValue = otherSourceInventory.AssetValue;
                    newEntry.CreatedDate = newEntry.UpdatedDate = DateTime.Now.ToUniversalTime();
                    newEntry.CreatedBy = newEntry.UpdatedBy = LoggedInUser;
                    newEntry.CategoryId = otherSourceInventory.CategoryId;
                    newEntry.AssetStatus = register ? AssetStatus.Available.ToString() : String.Empty;
                    newEntry.Issuable = (bool)otherSourceInventory.Issuable;
                    newEntry.InsuranceRequired = false;
                    newEntry.CutOverStock = otherSourceInventory.CutOverStock;

                    dbContext.Inventories.Add(newEntry);
                }

                if (register && otherSourceInventory.AssetValue >= _insurableAssetValue)
                {

                    InsuranceItem insuranceItem = new InsuranceItem();

                    insuranceItem.InsuranceReferenceId = Guid.NewGuid();
                    insuranceItem.CreatedDate = DateTime.Now.ToUniversalTime();
                    insuranceItem.InventoryId = inventory?.InventoryId != null  ? inventory.InventoryId : newinventoryId;
                    insuranceItem.RequestRaisedOn = DateTime.Now.ToUniversalTime();
                    insuranceItem.Status = inventory?.AssetStatus != null ? inventory.AssetStatus : AssetStatus.Available.ToString();
                    insuranceItem.CreatedBy = LoggedInUser;
                    insuranceItem.UpdatedBy = LoggedInUser;
                    insuranceItem.UpdatedDate = DateTime.Now.ToUniversalTime();

                    dbContext.InsuranceItems.Add(insuranceItem);
                }

            }
            await dbContext.SaveChangesAsync();
            return otherSourceHeader.InventoryOtherSourceId;

        }

        private string GetDocumentId()
        {
            _log.Information($"Enter DocId -  {DateTime.Now.ToString()}");
            var lastEntry = dbContext.InventoriesOtherSourcesHeaders.OrderByDescending(x => x.CreatedDate).FirstOrDefault();
            var dateString = DateTime.Now.ToUniversalTime().ToString("yyyyMMdd");
            var isTodayApril = DateTime.Today.Month == 4;
            var isLastEntryNotApril = lastEntry?.CreatedDate.Month != 4;
            var commonString = "OTH" + "-" + dateString + "-";
            var documentID = "";

            if (lastEntry == null || (isTodayApril && isLastEntryNotApril))
            {
                documentID = commonString + "00001";
            }
            else
            {
                var newNumber = (Int32.Parse(lastEntry.DocumentId[^5..]) + 1).ToString().PadLeft(5, '0');
                documentID = commonString + newNumber;
            }

            _log.Information($"Request Number DocId -  {documentID}");
            _log.Information($"Exit DocId -  {DateTime.Now.ToString()}");
            return documentID;
        }

        public List<Guid> GetExistingCategoriesFromInventories()
        {
            List<Guid> categoryIds = dbContext.Inventories.Select(i => i.CategoryId).Distinct().ToList();
            return categoryIds;
        }

        public bool IsNetworkCompanyExistsInInventories(Guid networkCompanyId)
        {
            bool isExists = dbContext.Inventories.Any(i => i.NetworkCompanyId == networkCompanyId);
            return isExists;
        }

        public List<AssetDto> GetExsistingAssets(List<AssetDto> updatedAsset)
        {
            var updateInventoryId = updatedAsset.Select(u => u.InventoryId).ToList();
            List<Inventory> existingAssets = dbContext.Inventories.Where(i => updateInventoryId.Contains(i.InventoryId)).ToList();
            List<AssetDto> Filteredassets = mapper.Map<List<AssetDto>>(existingAssets);
            return Filteredassets;
        }

        public async Task<List<AssetDto>> GetIssuedAssetsByUser()
        {
            var assets = await (from i in dbContext.InventoryTrackRegisters
                                join inv in dbContext.Inventories on i.InventoryId equals inv.InventoryId
                                join c in dbContext.Categories on inv.CategoryId equals c.CategoryId
                                join m in dbContext.Manufacturers on inv.ManufacturerId equals m.ManfacturerId
                                join r in dbContext.MaintenanceRequests.Where(m => m.Status != MaintenanceRequestStatus.Resolved.ToString()) on i.InventoryId equals r.InventoryId  into rGroup
                                from r in rGroup.DefaultIfEmpty()
                                where i.EmailId == LoggedInUser && i.ReturnDate == null && inv.AssetStatus == AssetStatus.Issued.ToString() && r.Status == null
                                orderby i.IssuedDate descending
                                select new AssetDto
                                {
                                    InventoryId = inv.InventoryId,
                                    CategoryName = c.CategoryName,
                                    ManufacturerName = m.ManufacturerName,
                                    AssetTagNumber = inv.AssetTagNumber,
                                    SerialNumber = inv.SerialNumber,
                                    ModelNumber = inv.ModelNumber,
                                    IssuedDate = i.IssuedDate
                                })
                         .ToListAsync();
            return assets;
        }

        public async Task<List<CutOverAssetDto>> GetCutOverAssets()
        {
            var inventories = await (from i in dbContext.Inventories.Include(c => c.Category).Include(c=>c.Manufacturer)
                                     where i.CutOverStock == true
                                     join n in dbContext.NetworkCompanies on i.NetworkCompanyId equals n.NetworkCompanyId
                                     join INV in dbContext.Invoices on i.InventoryId equals INV.InventoryId into invoiceJoin
                                     from INV in invoiceJoin.DefaultIfEmpty()
                                     select new CutOverAssetDto
                                     {
                                         InventoryId = i.InventoryId,
                                         NetworkCompanyId = i.NetworkCompanyId.Value,
                                         NetworkCompanyName = n.CompanyName,
                                         CategoryName = i.Category.CategoryName,
                                         InventoryOtherSourceId = i.InventoryOtherSourceId.Value,
                                         ManufacturerName = i.Manufacturer.ManufacturerName,
                                         ModelNumber = i.ModelNumber,
                                         WarrantyDate = i.WarrentyDate,
                                         SerialNumber = i.SerialNumber,
                                         AssetTagNumber = i.AssetTagNumber,
                                         InvoiceNumber = INV.InvoiceNumber,
                                         InvoiceDate = INV.InvoiceDate,
                                         InvoiceId = INV.InvoiceId != null ? INV.InvoiceId : Guid.Empty,
                                         ReferenceNumber = INV.ReferenceNumber,
                                         SupportingDocumentFilePath = INV.InvoiceFilePath,
                                     })
                                     .ToListAsync();
            return inventories;
        }

        public async Task<bool> DeleteAssetfromScrapList(Guid refurbishedAssetId)
        {
            var scrapItemToDelete = await dbContext.ScrapLists
                            .FirstOrDefaultAsync(i => i.RefurbishedAssetId == refurbishedAssetId);

            if (scrapItemToDelete == null)
            {
                throw new NullReferenceException($"Couldn't find record for {refurbishedAssetId}");
            }
            else
            {
                scrapItemToDelete.RemovedFromScrap = true;
                scrapItemToDelete.ScrappedDate = null;
            }

            return await dbContext.SaveChangesAsync() > 0;
        }

        public async Task<bool> ReturnScrapItem(Guid refurbishedAssetId)
        {
            RefurbishedAsset asset = await dbContext.RefurbishedAssets
                            .FirstOrDefaultAsync(i => i.RefurbishAssetId == refurbishedAssetId);

            if (asset == null)
            {
                throw new ArgumentException($"Asset of refurbished asset id does not exist", nameof(RefurbishedAsset.RefurbishAssetId));
            }
            else
            {
                asset.Status = RefurbishmentStatus.NotStarted.ToString();
                asset.RefurbishedDate = null;
            }

            return await dbContext.SaveChangesAsync() > 0;
        }

        public async Task<List<AssetDetailsDto>> GetIssuableAssetsCategory(Guid categoryId)
        {

            var assets = await (from i in dbContext.Inventories
                         join n in dbContext.NetworkCompanies on i.NetworkCompanyId equals n.NetworkCompanyId
                         join cat in dbContext.Categories on i.CategoryId equals cat.CategoryId
                         join man in dbContext.Manufacturers on i.ManufacturerId equals man.ManfacturerId
                         where (i.AssetStatus == AssetStatus.Available.ToString() && i.Issuable == true && i.CategoryId == categoryId)
                         from t in dbContext.InventoryTrackRegisters
                         .Where(c => c.InventoryId == i.InventoryId)
                         .Where(c => c.ReturnDate == null)
                         .DefaultIfEmpty()
                         select new AssetDetailsDto
                         {
                             InventoryId = i.InventoryId,
                             CategoryName = cat.CategoryName,
                             ManufacturerName = man.ManufacturerName,
                             ModelNumber = i.ModelNumber,
                             WarrentyDate = i.WarrentyDate,
                             SerialNumber = i.SerialNumber,
                             AssetTagNumber = i.AssetTagNumber == null || i.AssetTagNumber == String.Empty ? i.InventoryId.ToString().Substring(0, 15) : i.AssetTagNumber,
                             AssetStatus = i.AssetStatus,
                             userRequestNumber = i.UserRequestNumber,
                             IssuedTo = t.IssuedTo,
                             IssuedDate = t.IssuedDate,
                             IssuedBy = t.CreatedBy,
                             NetworkCompanyName = n.CompanyName,
                         }).ToListAsync();

            var assetDtos = mapper.Map<List<AssetDetailsDto>>(assets);
            return assetDtos;
        }

        public async Task<List<ReOrderLevelsDto>> GetReorderLevelNotification()
        {
            List<ReOrderLevelsDto> reOrderlist = await dbContext.ReOrderLevels
                .Where(r => r.NetworkCompany.Active == true && r.Category.Active == true)
                .GroupJoin(dbContext.Inventories
                    .Where(i => i.AssetStatus == AssetStatus.Available.ToString())
                    .GroupBy(c => new { c.NetworkCompanyId, c.CategoryId })
                    .Select(i => new ReOrderLevelsDto
                    {
                        NetworkCompanyId = i.Key.NetworkCompanyId ?? Guid.Empty,
                        CategoryId = i.Key.CategoryId,
                        Available = i.Count()
                    }),
                r => new { r.NetworkCompanyId, r.CategoryId },
                a => new { a.NetworkCompanyId, a.CategoryId },
                (r, a) => new { r, a })
                .SelectMany(x => x.a.DefaultIfEmpty(),
                    (x, a) => new ReOrderLevelsDto
                    {
                        NetworkCompanyId = x.r.NetworkCompanyId,
                        CategoryId = x.r.CategoryId,
                        CategoryName = x.r.Category.CategoryName,
                        NetworkCompanyName = x.r.NetworkCompany.CompanyName,
                        ReOrderLevel = x.r.ReOrderLevel1,
                        CriticalLevel = x.r.CriticalLevel,
                        WarningLevel = x.r.WarningLevel,
                        Available = a.Available ?? 0
                    })
                .Where(i => (i.Available != 0 && i.Available <= i.ReOrderLevel) || (i.Available == 0 && i.ReOrderLevel != 0))
                .ToListAsync();

            return reOrderlist;
        }

        public async Task<List<AllAssetDto>> GetAllAssets()
        {
            List<AllAssetDto> assetDetails = await dbContext.Inventories
                .Where(i => i.AssetStatus != null)
                .Include(i => i.Category)
                .Include(i => i.Manufacturer)
                .Join(dbContext.NetworkCompanies, i => i.NetworkCompanyId, n => n.NetworkCompanyId, 
                    (inventory, networkCompany) => new AllAssetDto 
                    { 
                        InventoryId = inventory.InventoryId,
                        NetworkCompanyId = networkCompany.NetworkCompanyId,
                        NetworkCompanyName = networkCompany.CompanyName,
                        CategoryId = inventory.CategoryId,
                        CategoryName = inventory.Category.CategoryName,
                        ManufacturerId = inventory.ManufacturerId,
                        ManufacturerName = inventory.Manufacturer.ManufacturerName,
                        SerialNumber = inventory.SerialNumber,
                        AssetTagNumber = inventory.AssetTagNumber,
                        ModelNumber = inventory.ModelNumber,
                        WarrantyDate = inventory.WarrentyDate,
                    })
                .ToListAsync();

            return assetDetails;
        }

        public async Task<bool> UpdateAsset(AllAssetDto asset)
        {
            Inventory? inventoryDetails = await dbContext.Inventories.FindAsync(asset.InventoryId);
            if (inventoryDetails == null) 
            { 
                return false; 
            }

            inventoryDetails.ModelNumber = asset.ModelNumber;
            inventoryDetails.SerialNumber = asset.SerialNumber;
            inventoryDetails.AssetTagNumber = asset.AssetTagNumber;
            inventoryDetails.WarrentyDate = asset.WarrantyDate;

            dbContext.Inventories.Update(inventoryDetails);

            return await dbContext.SaveChangesAsync() > 0;
        }

        public async Task<List<AssetRegisterDto>> GetAssetsList()
        {
            var assetRegister = await (from i in dbContext.Inventories
                                       join n in dbContext.NetworkCompanies on i.NetworkCompanyId equals n.NetworkCompanyId
                                       join c in dbContext.Categories on i.CategoryId equals c.CategoryId
                                       join m in dbContext.Manufacturers on i.ManufacturerId equals m.ManfacturerId
                                       join po in dbContext.PurchaseOrderHeaders on i.PurchaseOrderRequestId equals po.PurchaseOrderRequestId into poGroup
                                       from po in poGroup.DefaultIfEmpty()
                                       join oth in dbContext.InventoriesOtherSourcesHeaders on i.InventoryOtherSourceId equals oth.InventoryOtherSourceId into othGroup
                                       from oth in othGroup.DefaultIfEmpty()
                                       where i.AssetStatus != "" 
                                       select new AssetRegisterDto
                                       {
                                           InventoryId = i.InventoryId,
                                           ModelNumber = i.ModelNumber,
                                           SerialNumber = i.SerialNumber,
                                           AssetTagNumber = i.AssetTagNumber,
                                           UserRequestNumber = i.UserRequestNumber,
                                           NetworkCompanyId = i.NetworkCompanyId,
                                           NetworkCompanyName = n.CompanyName,
                                           CategoryName = c.CategoryName,
                                           ManufacturerName = m.ManufacturerName,
                                           InventoryOtherSourceId = i.InventoryOtherSourceId,
                                           DocumentID = oth.DocumentId,
                                           DocumentNumber = oth.DocumentNumber,
                                           SupportingDocumentFilePath = oth.SupportingDocumentFilePath,
                                           PurchaseOrderRequestId = po.PurchaseOrderRequestId,
                                           PurchaseOrderNumber = po.PurchaseOrderNumber,
                                           POGeneratedOn = po.PogeneratedOn
                                       }).ToListAsync();

            var inventoryIds = assetRegister.Select(i => i.InventoryId).ToList();
            var purOrdReqIds = assetRegister.Where(p => p.PurchaseOrderRequestId != null).Select(p => p.PurchaseOrderRequestId).ToList();

            var invoicesWithInventoryIds = dbContext.Invoices.Where(i => inventoryIds.Contains(i.InventoryId)).ToList();
            var invoicesWithPurOrdReqIds = dbContext.Invoices.Where(p => purOrdReqIds.Contains(p.PurchaseOrderRequestId)).ToList();

            foreach (Invoice inv in invoicesWithInventoryIds)
            {

                var assets = assetRegister.Where(i => i.InventoryId == inv.InventoryId);

                foreach (AssetRegisterDto asset in assets)
                {
                    asset.InvoiceId = inv?.InvoiceId;
                    asset.InvoiceNumber = inv?.InvoiceNumber;
                    asset.InvoiceDate = inv?.InvoiceDate;
                    asset.InvoiceFilePath = inv?.InvoiceFilePath;
                }
            }

            foreach (Invoice inv in invoicesWithPurOrdReqIds)
            {

                var assets = assetRegister.Where (i => i.PurchaseOrderRequestId == inv.PurchaseOrderRequestId);

                foreach (AssetRegisterDto asset in assets)
                {
                    asset.InvoiceId = inv?.InvoiceId;
                    asset.InvoiceNumber = inv?.InvoiceNumber;
                    asset.InvoiceDate = inv?.InvoiceDate;
                    asset.InvoiceFilePath = inv?.InvoiceFilePath;
                }
            }


            return assetRegister;
        }
    }
}

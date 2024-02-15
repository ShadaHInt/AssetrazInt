using AssetrazAccessors.Common;
using AssetrazContracts.AccessorContracts;
using AssetrazContracts.DTOs;
using AssetrazContracts.LoggerContracts;
using AssetrazDataProvider;
using AssetrazDataProvider.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace AssetrazAccessors
{
    public class PurchaseOrderAccessor : AccessorCommon, IPurchaseOrderAccessor
    {
        private readonly IMapper mapper;
        private readonly ILogAnalytics _logger;
        private AssetrazContext dbContext;
        public PurchaseOrderAccessor(AssetrazContext DbContext, IMapper Mapper, IHttpContextAccessor httpAccessor, ILogAnalytics logger) : base(httpAccessor)
        {
            dbContext = DbContext;
            mapper = Mapper;
            _logger = logger;
        }

        public async Task<List<PurchaseOrderDetailsFunctionDto>> GetPurchaseOrderDetailsForQuoteGeneration(Guid purchaseOrderRequestId)
        {
            List<PurchaseOrderDetailsFunctionDto> result = new();
            try
            {
                return await dbContext.PurchaseOrderHeaders
                    .Join(dbContext.PurchaseOrderDetails.Include(c => c.Category).Where(pod => pod.PurchaseOrderRequestId == purchaseOrderRequestId),
                    poh => poh.PurchaseOrderRequestId,
                    pod => pod.PurchaseOrderRequestId,
                    (poh, pod) => new PurchaseOrderDetailsFunctionDto
                    {
                        PurchaseOrderNumber = poh.PurchaseOrderNumber,
                        VendorID = poh.VendorId,
                        POGeneratedOn = poh.PogeneratedOn,
                        RatePerQuantity = pod.RatePerQuantity,
                        Specifications = pod.Category.CategoryName + " - " + Environment.NewLine + " Model : " + pod.ModelNumber + Environment.NewLine + " Spec : " + pod.Specifications,
                        Quantity = pod.Quantity

                    }).ToListAsync();

            }
            catch (Exception)
            {
                return result;
            }
        }

        public async Task<List<PurchaseOrderDto>> GetPurchaseOrderList()
        {
            List<PurchaseOrderDto> purchaseOrderlist = new List<PurchaseOrderDto>();
            purchaseOrderlist = await (from RQH in dbContext.RequestForQuoteHeaders
                                       join RQP in dbContext.RequestForQuoteParticipants
                                           on RQH.ProcurementRequestId equals RQP.ProcurementRequestId
                                       join RQD in dbContext.RequestForQuoteDetails.Where(rqd => rqd.VendorId != null)
                                            on new { vendorId = RQP.VendorId, RQP.ProcurementRequestId } equals new { vendorId = RQD.VendorId ?? Guid.Empty, RQD.ProcurementRequestId }
                                       join V in dbContext.Vendors
                                           on RQP.VendorId equals V.VendorId
                                       join POH in dbContext.PurchaseOrderHeaders
                                           on new { RQP.ProcurementRequestId, RQP.VendorId } equals new { POH.ProcurementRequestId, POH.VendorId } into POHGroup
                                       from POH in POHGroup.DefaultIfEmpty()
                                       join INV in dbContext.Invoices
                                           on POH.PurchaseOrderRequestId equals INV.PurchaseOrderRequestId into INVGroup
                                       from INV in INVGroup.DefaultIfEmpty()
                                       join NC in dbContext.NetworkCompanies
                                       on RQH.NetworkCompanyId equals NC.NetworkCompanyId into NCGroup
                                       from NC in NCGroup.DefaultIfEmpty()
                                       where RQH.Status == "Approved" && RQP.IsShortListed == true
                                       group new
                                       {
                                           RQH,
                                           RQP,
                                           V,
                                           POH,
                                           INV
                                       } by new
                                       {
                                           RQH.ProcurementRequestId,
                                           RQP.VendorId,
                                           RQP.ProcurementVendorId,
                                           V.VendorName,
                                           RQH.ProcurementRequestNumber,
                                           RQH.RequestRaisedOn,
                                           QuoteReceivedOn = RQP.QuoteUploadedOn,
                                           RQH.ApprovedOn,
                                           RQP.QutoeFilePath,
                                           RQH.ApprovedBy,
                                           POH.PurchaseOrderNumber,
                                           POH.PurchaseOrderRequestId,
                                           PODate = POH.PogeneratedOn,
                                           INV.InvoiceId,
                                           INV.InvoiceNumber,
                                           INV.InvoiceDate,
                                           INV.InvoiceFilePath,
                                           INV.IsHandedOver,
                                           RQH.Notes,
                                           RQH.Comments,
                                           NetworkCompanyName = NC.CompanyName, 
                                       }
                                 into grp
                                       orderby grp.Key.ProcurementRequestNumber
                                       select (new PurchaseOrderDto
                                       {
                                           ProcurementRequestId = grp.Key.ProcurementRequestId,
                                           PurchaseOrderRequestId = grp.Key.PurchaseOrderRequestId,
                                           VendorId = grp.Key.VendorId,
                                           ProcurementVendorId = grp.Key.ProcurementVendorId,
                                           VendorName = grp.Key.VendorName,
                                           RequestNumber = grp.Key.ProcurementRequestNumber,
                                           RequestRaisedOn = grp.Key.RequestRaisedOn,
                                           QuoteReceivedOn = grp.Key.QuoteReceivedOn,
                                           QuoteFilePath = grp.Key.QutoeFilePath,
                                           ApprovedOn = grp.Key.ApprovedOn,
                                           ApprovedBy = grp.Key.ApprovedBy,
                                           PurchaseOrderNumber = grp.Key.PurchaseOrderNumber,
                                           PoDate = grp.Key.PODate,
                                           InvoiceId = grp.Key.InvoiceId,
                                           InvoiceNumber = grp.Key.InvoiceNumber,
                                           InvoiceDate = grp.Key.InvoiceDate,
                                           InvoiceFilePath = grp.Key.InvoiceFilePath,
                                           IsHandedOver = grp.Key.IsHandedOver,
                                           Notes = grp.Key.Notes,
                                           Comments = grp.Key.Comments,
                                           NetworkCompanyName = grp.Key.NetworkCompanyName,
                                       }))
                                 .ToListAsync();

            var query = purchaseOrderlist.AsQueryable().ToQueryString();

            return purchaseOrderlist;
        }

        public async Task<List<PurchaseOrderDetailsDto>> GetPurchaseDetails(Guid PurchaseOrderRequestId , string? purchaseOrderNumber)
        {
            string decodedPurchaseOrderNumber = purchaseOrderNumber ?? string.Empty;
            if (!decodedPurchaseOrderNumber.Contains("_"))
            {
                decodedPurchaseOrderNumber += "_";
            }

            decimal? totalOrderValue = null;
            if (!string.IsNullOrEmpty(purchaseOrderNumber))
            {
                totalOrderValue = await dbContext.PurchaseOrderDetails
                    .Where(pon => dbContext.PurchaseOrderHeaders
                        .Any(poh => poh.PurchaseOrderRequestId == pon.PurchaseOrderRequestId &&
                                    poh.PurchaseOrderNumber != null &&
                                    poh.PurchaseOrderNumber.StartsWith(decodedPurchaseOrderNumber.Substring(0, decodedPurchaseOrderNumber.LastIndexOf('_')))))
                    .SumAsync(pon => pon.Quantity * pon.RatePerQuantity);
            }

            List<PurchaseOrderDetailsDto> purchaseDetails = await dbContext.PurchaseOrderDetails
                    .Include(c => c.Category)
                    .Include(c => c.Manufacturer)
                    .Where(p => p.PurchaseOrderRequestId == PurchaseOrderRequestId)
                    .Select(p => new PurchaseOrderDetailsDto
                    {
                        PurchaseOrderRequestId = p.PurchaseOrderRequestId,
                        PurchaseOrderDetailsId = p.PurchaseOrderDetailsId,
                        CategoryId = p.CategoryId,
                        ManufacturerId = p.ManufacturerId,
                        CategoryName = p.Category.CategoryName,
                        ManufacturerName = p.Manufacturer.ManufacturerName,
                        ModelNumber = p.ModelNumber,
                        Quantity = p.Quantity,
                        RatePerQuantity = p.RatePerQuantity,
                        Specifications = p.Specifications,
                        QuantityReceived = p.QuantityReceived,
                        VendorId = p.PurchaseOrderRequest.VendorId,
                        TotalOrderValue = totalOrderValue
                    })
                    .ToListAsync();
            return purchaseDetails;
        }

        public async Task<List<PurchaseOrderDetailsDto>> GetPurchaseOrder(Guid purchaseOrderRequestId)
        {
            List<PurchaseOrderDetailsDto> purchaseDetails = await dbContext.PurchaseOrderDetails
                    .Include(c => c.Category)
                    .Include(c => c.Manufacturer)
                    .Where(p => p.PurchaseOrderRequestId == purchaseOrderRequestId)
                    .Select(p => new PurchaseOrderDetailsDto
                    {
                        CategoryId = p.CategoryId,
                        CategoryName = p.Category.CategoryName,
                        ManufacturerName = p.Manufacturer.ManufacturerName,
                        ModelNumber = p.ModelNumber,
                        ManufacturerId = p.ManufacturerId,
                        PurchaseOrderRequestId = p.PurchaseOrderRequest.PurchaseOrderRequestId,
                        Quantity = p.Quantity,
                        RatePerQuantity = p.RatePerQuantity,
                        Specifications = p.Specifications
                    })
                    .OrderBy(p => p.CategoryName)
                    .ToListAsync();
            return purchaseDetails;
        }

        public bool AddPartialOrder(List<PurchaseOrderDetailsDto> purchaseDetailsDto)
        {
            var existingPurchaserOrder = dbContext.PurchaseOrderHeaders
                .First(poh => poh.PurchaseOrderRequestId == purchaseDetailsDto.First().PurchaseOrderRequestId);

            Guid purchaseOrderRequestId = Guid.NewGuid();

            PurchaseOrderHeader purchaseOrderHeader = new PurchaseOrderHeader();

            purchaseOrderHeader.PurchaseOrderRequestId = purchaseOrderRequestId;
            purchaseOrderHeader.PurchaseOrderNumber = GetPartialPurchaserOrderNumber(existingPurchaserOrder.PurchaseOrderNumber);
            purchaseOrderHeader.NetworkCompanyId = existingPurchaserOrder.NetworkCompanyId;
            purchaseOrderHeader.ProcurementRequestId = existingPurchaserOrder.ProcurementRequestId;
            purchaseOrderHeader.VendorId = existingPurchaserOrder.VendorId;
            purchaseOrderHeader.PogeneratedOn = DateTime.Now.ToUniversalTime();
            purchaseOrderHeader.RequestRaisedOn = existingPurchaserOrder.RequestRaisedOn;
            purchaseOrderHeader.RequestRaisedBy = existingPurchaserOrder.RequestRaisedBy;
            purchaseOrderHeader.UpdatedDate = purchaseOrderHeader.CreatedDate = DateTime.Now.ToUniversalTime();
            purchaseOrderHeader.CreatedBy = purchaseOrderHeader.UpdatedBy = LoggedInUser;

            dbContext.PurchaseOrderHeaders.Add(purchaseOrderHeader);

            foreach (PurchaseOrderDetailsDto purchaseOrder in purchaseDetailsDto)
            {
                PurchaseOrderDetail purchaseOrderDetail = new PurchaseOrderDetail();

                purchaseOrderDetail.PurchaseOrderDetailsId = Guid.NewGuid();
                purchaseOrderDetail.PurchaseOrderRequestId = purchaseOrderRequestId;
                purchaseOrderDetail.CategoryId = purchaseOrder.CategoryId;
                purchaseOrderDetail.ManufacturerId = purchaseOrder.ManufacturerId;
                purchaseOrderDetail.ModelNumber = purchaseOrder.ModelNumber;
                purchaseOrderDetail.Specifications = purchaseOrder.Specifications;
                purchaseOrderDetail.Quantity = purchaseOrder.Quantity;
                purchaseOrderDetail.RatePerQuantity = purchaseOrder.RatePerQuantity;
                purchaseOrderDetail.CreatedDate = purchaseOrderDetail.UpdatedDate = DateTime.Now.ToUniversalTime();
                purchaseOrderDetail.CreatedBy = purchaseOrderDetail.UpdatedBy = LoggedInUser;

                dbContext.PurchaseOrderDetails.Add(purchaseOrderDetail);
            }

            return dbContext.SaveChanges() > 0;

        }

        public Guid AddPurchaseOrder(List<RequestForQuoteDetailsDto> createPoDto)
        {
            List<RequestForQuoteDetail> purchaseOrderList = dbContext.RequestForQuoteDetails
                .Include(r => r.ProcurementRequest)
                .Where(r => r.ProcurementRequestId == createPoDto.First().ProcurementRequestId && r.VendorId == createPoDto.First().VendorId)
                .ToList();

            if (!purchaseOrderList.Any())
                return Guid.Empty;

            Guid purchaseOrderRequestId = Guid.NewGuid();

            PurchaseOrderHeader purchaseOrderHeader = new PurchaseOrderHeader();

            purchaseOrderHeader.PurchaseOrderRequestId = purchaseOrderRequestId;
            purchaseOrderHeader.PurchaseOrderNumber = GetPurchaseOrderNumber();
            purchaseOrderHeader.NetworkCompanyId = purchaseOrderList.First().ProcurementRequest.NetworkCompanyId;
            purchaseOrderHeader.UpdatedDate = purchaseOrderHeader.CreatedDate = DateTime.Now.ToUniversalTime();
            purchaseOrderHeader.RequestRaisedOn = purchaseOrderList.First().ProcurementRequest.RequestRaisedOn;
            purchaseOrderHeader.RequestRaisedBy = purchaseOrderList.First().ProcurementRequest.RequestRaisedBy;
            purchaseOrderHeader.VendorId = createPoDto.First().VendorId;
            purchaseOrderHeader.ProcurementRequestId = purchaseOrderList.First().ProcurementRequestId;
            purchaseOrderHeader.CreatedBy = purchaseOrderHeader.UpdatedBy = LoggedInUser;
            purchaseOrderHeader.PogeneratedOn = DateTime.Now.ToUniversalTime();

            dbContext.PurchaseOrderHeaders.Add(purchaseOrderHeader);

            foreach (RequestForQuoteDetailsDto purchaseOrder in createPoDto)
            { 

                PurchaseOrderDetail purchaseOrderDetail = new PurchaseOrderDetail();

                purchaseOrderDetail.PurchaseOrderDetailsId = Guid.NewGuid();
                purchaseOrderDetail.PurchaseOrderRequestId = purchaseOrderRequestId;
                purchaseOrderDetail.CategoryId = purchaseOrder.CategoryId;
                purchaseOrderDetail.ManufacturerId = purchaseOrder.ManufacturerId.Value;
                purchaseOrderDetail.ModelNumber = purchaseOrder.ModelNumber;
                purchaseOrderDetail.CreatedDate = purchaseOrderDetail.UpdatedDate = DateTime.Now.ToUniversalTime();
                purchaseOrderDetail.CreatedBy = LoggedInUser;
                purchaseOrderDetail.UpdatedBy = LoggedInUser;

                purchaseOrderDetail.Specifications = purchaseOrder.Specifications;
                purchaseOrderDetail.Quantity = purchaseOrder.Quantity;
                purchaseOrderDetail.RatePerQuantity = purchaseOrder.RatePerQuantity;

                dbContext.PurchaseOrderDetails.Add(purchaseOrderDetail);
            }

            return dbContext.SaveChanges() > 0 ? purchaseOrderRequestId : Guid.Empty;
        }

        public async Task<bool> UpdatePurchaserOrderDetails(List<PurchaseOrderDetailsDto> purchaseOrderDetails, bool? isHandover)
        {
            Guid? purchaseOrderRequestId = purchaseOrderDetails.First().PurchaseOrderRequestId;

            var invoice = await dbContext.Invoices
                    .FirstOrDefaultAsync(poh => poh.PurchaseOrderRequestId == purchaseOrderRequestId);

            if (invoice != null && invoice.IsHandedOver == true)
                throw new InvalidOperationException("The purchase order request is already handed over. No edit possible");

            List<PurchaseOrderDetail> purchaseOrders = await dbContext.PurchaseOrderDetails
                .Where(pod => pod.PurchaseOrderRequestId == purchaseOrderRequestId)
                .ToListAsync();

            foreach (PurchaseOrderDetailsDto purchaseOrderDetail in purchaseOrderDetails)
            {
                var purchaseOrder = purchaseOrders.FirstOrDefault(po => po.PurchaseOrderDetailsId == purchaseOrderDetail.PurchaseOrderDetailsId);

                if (purchaseOrder == null) continue;

                purchaseOrder.RatePerQuantity = purchaseOrderDetail.RatePerQuantity;
                purchaseOrder.Specifications = purchaseOrderDetail.Specifications;
                purchaseOrder.Quantity = purchaseOrderDetail.QuantityReceived.Value;
                purchaseOrder.QuantityReceived = purchaseOrderDetail?.QuantityReceived;
            }

            if (isHandover.HasValue && isHandover.Value == true)
            {
                if (invoice == null)
                    throw new NullReferenceException($"Couldn't find invoice id for purchaserOrderRequest:{purchaseOrderRequestId}");

                invoice.IsHandedOver = true;
                invoice.UpdatedDate = DateTime.Now.ToUniversalTime();
                invoice.UpdatedBy = LoggedInUser;
            }

            return await dbContext.SaveChangesAsync() > 0;
        }

        private string GetPurchaseOrderNumber()
        {
            _logger.Information($"Enter PO -  {DateTime.Now.ToString()}");
            var lastEntry = dbContext.PurchaseOrderHeaders
                .OrderByDescending(poh => poh.CreatedDate)
                .Where(poh => poh.PurchaseOrderNumber.Length == 11)
                .FirstOrDefault();
            var dateString = DateTime.Now.ToUniversalTime().ToString("MMy");
            var commonString = "VI" + "-";
            var purchaseOrderNumber = "";

            if (lastEntry == null || (DateTime.Today.Month != lastEntry.CreatedDate.Month) || (DateTime.Today.Year != lastEntry.CreatedDate.Year))
            {
                purchaseOrderNumber = commonString + "001/" + dateString;
            }
            else
            {
                var newNumber = (Int32.Parse(lastEntry.PurchaseOrderNumber[3..6]) + 1).ToString().PadLeft(3, '0');
                purchaseOrderNumber = commonString + newNumber + "/" + dateString;
            }

            _logger.Information($"Request Number PO -  {purchaseOrderNumber}");
            _logger.Information($"Exit PO -  {DateTime.Now.ToString()}");
            return purchaseOrderNumber;
        }

        private string GetPartialPurchaserOrderNumber(string purchaserOrderNumber)
        {
            var lastEntry = dbContext.PurchaseOrderHeaders
                .Where(poh => poh.PurchaseOrderNumber.StartsWith(purchaserOrderNumber))
                .OrderByDescending(x => x.CreatedDate)
                .Select(poh => poh.PurchaseOrderNumber)
                .FirstOrDefault();

            bool isAlreadyPartial = lastEntry.Length == 15;
            var partialPurchaserOrderNumber = "";

            if (isAlreadyPartial)
            {
                var newNumber = (Int32.Parse(lastEntry[^3..]) + 1).ToString().PadLeft(3, '0');
                partialPurchaserOrderNumber = lastEntry[..^3] + newNumber;
            }
            else
            {
                partialPurchaserOrderNumber = lastEntry + "_001";
            }


            return partialPurchaserOrderNumber;
        }

        public async Task<List<PurchaseOrderDetailsDto>> GetProcurementReport()
        {
            List<PurchaseOrderDetailsDto> purchaseDetails = await (from PD in dbContext.PurchaseOrderDetails
                                                                   join PH in dbContext.PurchaseOrderHeaders
                                                                   on PD.PurchaseOrderRequestId equals PH.PurchaseOrderRequestId
                                                                   join RH in dbContext.RequestForQuoteHeaders
                                                                   on PH.ProcurementRequestId equals RH.ProcurementRequestId
                                                                   join INV in dbContext.Invoices
                                                                   on PH.PurchaseOrderRequestId equals INV.PurchaseOrderRequestId
                                                                   select (new PurchaseOrderDetailsDto
                                                                   {
                                                                       PurchaseOrderNumber = PH.PurchaseOrderNumber,
                                                                       PogeneratedOn = PH.PogeneratedOn.Value.Date,
                                                                       ProcurementRequestNumber = RH.ProcurementRequestNumber,
                                                                       RequestRaisedBy = RH.RequestRaisedBy,
                                                                       RequestRaisedOn = RH.RequestRaisedOn.Value.Date,
                                                                       CategoryName = PD.Category.CategoryName,
                                                                       Specifications = PD.Specifications,
                                                                       Quantity = PD.Quantity,
                                                                       RatePerQuantity = PD.RatePerQuantity,
                                                                       VendorName = PH.Vendor.VendorName,
                                                                       InvoiceNumber = INV.InvoiceNumber
                                                                   })).ToListAsync();
            return purchaseDetails;
        }
    }
}

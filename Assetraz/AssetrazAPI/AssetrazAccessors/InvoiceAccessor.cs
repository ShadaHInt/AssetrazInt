using AssetrazAccessors.Common;
using AssetrazContracts.AccessorContracts;
using AssetrazContracts.DTOs;
using AssetrazDataProvider;
using AssetrazDataProvider.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace AssetrazAccessors
{
    public class InvoiceAccessor : AccessorCommon, IInvoiceAccessor
    {
        private readonly AssetrazContext _context;
        private readonly IMapper _mapper;

        public InvoiceAccessor(AssetrazContext context, IMapper mapper, IHttpContextAccessor httpContext) : base(httpContext)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<PurchaseInvoiceDto>> GetInvoicesHandedOver()
        {
            List<PurchaseInvoiceDto> purchaseInvoices = await _context.Invoices
                .Include(i => i.PurchaseOrderRequest).ThenInclude(i => i.Vendor)
                .Include(i => i.PurchaseOrderRequest).ThenInclude(i => i.NetworkCompany)
                .Where(i => i.IsHandedOver)
                .Select(i => new PurchaseInvoiceDto
                {
                    PurchaseOrderNumber = i.PurchaseOrderRequest.PurchaseOrderNumber,
                    RequestRaisedOn = i.PurchaseOrderRequest.PogeneratedOn,
                    InvoiceId = i.InvoiceId,
                    InvoiceFilePath = i.InvoiceFilePath,
                    InvoiceNumber = i.InvoiceNumber,
                    IsAssetAddedToInventory = i.IsAssetAddedToInventory,
                    Status = i.IsAssetAddedToInventory ? "Taken to stock" : String.Empty,
                    InvoiceDate = i.InvoiceDate,
                    UpdatedBy = i.UpdatedBy,
                    InvoiceUploadedBy = i.InvoiceUploadedBy,
                    UpdatedDate = i.UpdatedDate,
                    VendorName = i.PurchaseOrderRequest.Vendor.VendorName,
                    NetworkCompanyName = i.PurchaseOrderRequest.NetworkCompany.CompanyName,
                    CategoryList = _context.PurchaseOrderDetails.Include(c => c.Category).Where(x => x.PurchaseOrderRequestId == i.PurchaseOrderRequestId).Select(c => c.Category.CategoryName).Distinct().ToList(),
                }).OrderByDescending(c => c.UpdatedDate)
                .ToListAsync();

            return purchaseInvoices;
        }

        public async Task<InvoiceDto> AddInvoiceDetails(InvoiceDto invoiceDetails)
        {
            Invoice invoice = new()
            {
                InvoiceId = invoiceDetails.InvoiceId,
                PurchaseOrderRequestId = invoiceDetails?.PurchaseOrderRequestId,
                InventoryId = invoiceDetails?.InventoryId,
                InvoiceNumber = invoiceDetails?.InvoiceNumber,
                ReferenceNumber = invoiceDetails?.RefrenceNumber,
                InvoiceDate = invoiceDetails.InvoiceDate,
                InvoiceFilePath = invoiceDetails.InvoiceFilePath,
                InvoiceUploadedOn = DateTime.Now.ToUniversalTime(),
                InvoiceUploadedBy = LoggedInUserName,
                CreatedBy = LoggedInUser,
                UpdatedBy = LoggedInUser,
                CreatedDate = DateTime.Now.ToUniversalTime(),
                UpdatedDate = DateTime.Now.ToUniversalTime(),
            };

            _context.Invoices.Add(invoice);

            if (await _context.SaveChangesAsync() > 0)
                return invoiceDetails;
            return null;
        }

        public async Task<IEnumerable<InvoiceDto>?> AddInvoiceDetails(IEnumerable<InvoiceDto> invoiceDetailsList)
        {
            List<Invoice> invoices = invoiceDetailsList.Select(invoiceDetails => new Invoice
            {
                InvoiceId = invoiceDetails.InvoiceId,
                PurchaseOrderRequestId = invoiceDetails?.PurchaseOrderRequestId,
                InventoryId = invoiceDetails?.InventoryId,
                InvoiceNumber = invoiceDetails?.InvoiceNumber,
                ReferenceNumber = invoiceDetails?.RefrenceNumber,
                InvoiceDate = invoiceDetails?.InvoiceDate,
                InvoiceFilePath = invoiceDetails?.InvoiceFilePath,
                InvoiceUploadedOn = DateTime.Now.ToUniversalTime(),
                InvoiceUploadedBy = LoggedInUserName,
                CreatedBy = LoggedInUser,
                UpdatedBy = LoggedInUser,
                CreatedDate = DateTime.Now.ToUniversalTime(),
                UpdatedDate = DateTime.Now.ToUniversalTime()
            }).ToList();

            _context.Invoices.AddRange(invoices);

            if (await _context.SaveChangesAsync() > 0)
                return invoices.Select(invoice => new InvoiceDto
                {
                    InvoiceId = invoice.InvoiceId,
                    PurchaseOrderRequestId = invoice.PurchaseOrderRequestId,
                    InventoryId = invoice.InventoryId,
                    InvoiceNumber = invoice.InvoiceNumber,
                    RefrenceNumber = invoice.ReferenceNumber,
                    InvoiceDate = invoice.InvoiceDate,
                    InvoiceFilePath = invoice.InvoiceFilePath,
                    InvoiceUploadedOn = invoice.InvoiceUploadedOn,
                    InvoiceUploadedBy = invoice.InvoiceUploadedBy,
                    IsHandedOver = invoice.IsHandedOver,
                    IsAssetAddedToInventory = invoice.IsAssetAddedToInventory
                });

            return null;
        }

        public async Task<string> GetInvoiceFilePath(Guid invoiceId)
        {
            var invoiceDetails = await _context.Invoices
                .FirstOrDefaultAsync(i => i.InvoiceId == invoiceId);

            if (invoiceDetails == null)
            {
                throw new ArgumentNullException($"purchaseOrderRequest:{invoiceId} not valid:", nameof(invoiceId));
            }

            return invoiceDetails.InvoiceFilePath;
        }

        public async Task<bool> DeleteInvoiceDetails(Guid invoiceId)
        {
            var invoiceRecord = await _context.Invoices
                .FirstOrDefaultAsync(i => i.InvoiceId == invoiceId);
            if (invoiceRecord == null)
            {
                throw new NullReferenceException($"Couldn't find record for {invoiceId}");
            }
            _context.Invoices.Remove(invoiceRecord);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<PurchaseInvoiceDto> GetInvoiceDetailsUsingPurchaseOrder(Guid purchaseOrderRequestId)
        {
            return await _context.Invoices
                .Select(i => new PurchaseInvoiceDto
                {
                    PurchaseOrderRequestId = i.PurchaseOrderRequestId,
                    PurchaseOrderNumber = i.PurchaseOrderRequest.PurchaseOrderNumber,
                    RequestRaisedOn = i.PurchaseOrderRequest.RequestRaisedOn,
                    InvoiceNumber = i.InvoiceNumber,
                    IsAssetAddedToInventory = i.IsAssetAddedToInventory,
                    InvoiceDate = i.InvoiceDate,
                    InvoiceId = i.InvoiceId,
                    UpdatedBy = i.UpdatedBy,
                    UpdatedDate = i.UpdatedDate,
                    VendorName = i.PurchaseOrderRequest.Vendor.VendorName,
                }).FirstOrDefaultAsync(i => i.PurchaseOrderRequestId == purchaseOrderRequestId);
        }
    }
}

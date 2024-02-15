using AssetrazContracts.AccessorContracts;
using AssetrazContracts.DTOs;
using AssetrazContracts.EngineContracts;
using AssetrazContracts.ManagerContracts;
using AssetrazDataProvider.Entities;

namespace AssetrazManagers
{
    public class InvoiceManager : IInvoiceManager
    {
        private readonly IInvoiceAccessor _invoiceAccessor;
        private IInvoiceBlobEngine _invoiceBlobEngine;

        public InvoiceManager(IInvoiceAccessor invoiceAcessor, IInvoiceBlobEngine invoiceBlobeEngine)
        {
            _invoiceAccessor = invoiceAcessor;
            _invoiceBlobEngine = invoiceBlobeEngine;
        }
        public async Task<List<PurchaseInvoiceDto>> GetInvoicesHandedOver()
        {
            return await _invoiceAccessor.GetInvoicesHandedOver();
        }

        public async Task<PurchaseInvoiceDto> GetInvoiceDetailsUsingPurchaseOrder(Guid purchaseOrderRequestId)
        {
            return await _invoiceAccessor.GetInvoiceDetailsUsingPurchaseOrder(purchaseOrderRequestId);
        }

        public async Task<(Stream, string, string)> DownloadInvoice(Guid invoiceId)
        {
            string filePath = await _invoiceAccessor.GetInvoiceFilePath(invoiceId);
            string fileName = filePath.Split("/").LastOrDefault();

            var result = await _invoiceBlobEngine.DownloadInvoice(filePath);

            return (result.Item1, result.Item2, fileName);
        }

        public async Task<InvoiceDto> UploadInvoice(InvoiceDto invoiceDetails)
        {
            var response = await _invoiceBlobEngine.UploadInvoice(invoiceDetails);

            if (response != null)
            {
                return await _invoiceAccessor.AddInvoiceDetails(response);
            }
            return null;
        }

        public async Task<InvoiceDto?> UploadInvoiceForOldAssets(InvoiceRequestDto invoiceDetails)
        {
            Guid referenceNumber = Guid.NewGuid();
            invoiceDetails.RefrenceNumber = referenceNumber;
            List<InvoiceDto> invoices = new List<InvoiceDto>();
            bool allInvoicesUploaded = true;
            var response = await _invoiceBlobEngine.UploadInvoiceForOtherSource(invoiceDetails);

            foreach (Guid inventoryIdItem in invoiceDetails.InventoryIds)
            {
                Guid invoiceId = Guid.NewGuid();
                InvoiceDto invoice = new InvoiceDto
                {
                    InvoiceId = invoiceId,
                    InventoryId = inventoryIdItem,
                    RefrenceNumber = referenceNumber,
                    InvoiceNumber = invoiceDetails.InvoiceNumber,
                    InvoiceDate = invoiceDetails.InvoiceDate,
                    InvoiceFile = invoiceDetails.InvoiceFile,
                    InvoiceUploadedOn = invoiceDetails.InvoiceUploadedOn,
                    InvoiceUploadedBy = invoiceDetails.InvoiceUploadedBy,
                    IsHandedOver = invoiceDetails.IsHandedOver,
                    IsAssetAddedToInventory = invoiceDetails.IsAssetAddedToInventory
                };
                if (response != null)
                {
                    invoice.InvoiceFilePath = response.InvoiceFilePath;
                    invoices.Add(invoice);
                }
                else
                {
                    allInvoicesUploaded = false;
                }
            }
            var savedInvoices = await _invoiceAccessor.AddInvoiceDetails(invoices);

            if (allInvoicesUploaded && savedInvoices.Any())
            {
                return savedInvoices?.FirstOrDefault();
            }
            return null;
        }


        public async Task<bool> DeleteInvoice(Guid invoiceId)
        {
            string filePath = await _invoiceAccessor.GetInvoiceFilePath(invoiceId);
            var response = await _invoiceBlobEngine.DeleteInvoice(filePath);

            if (response)
                return await _invoiceAccessor.DeleteInvoiceDetails(invoiceId);

            return false;

        }
    }
}

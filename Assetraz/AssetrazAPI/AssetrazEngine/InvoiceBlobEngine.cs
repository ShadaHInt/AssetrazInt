using AssetrazContracts.DTOs;
using AssetrazContracts.EngineContracts;
using AssetrazContracts.Others;

namespace AssetrazEngine
{
    public class InvoiceBlobEngine : IInvoiceBlobEngine
    {
        private readonly IBlobEngine _blobEngine;
        private const StorageAccountContainer _invoiceContainer = StorageAccountContainer.Invoices;
        public InvoiceBlobEngine(IBlobEngine blobEngine)
        {
            _blobEngine = blobEngine;
        }

        public async Task<(Stream, string)> DownloadInvoice(string filePath)
        {
            return await _blobEngine.DownloadBlob(_invoiceContainer, filePath);

        }
        public async Task<bool> DeleteInvoice(string filePath)
        {
            return await _blobEngine.DeleteBlob(_invoiceContainer, filePath);
        }

        public async Task<InvoiceDto?> UploadInvoice(InvoiceDto invoiceDetails)
        {
            Guid invoiceId = Guid.NewGuid();

            string fileName = $"{invoiceId}/{invoiceDetails.InvoiceFile.FileName}";
            invoiceDetails.InvoiceFilePath = fileName;
            invoiceDetails.InvoiceId = invoiceId;

            var response =  await _blobEngine.UploadBlob(_invoiceContainer, fileName, invoiceDetails.InvoiceFile);

            if (response)
            {
                return invoiceDetails;
            }
            return null;
        }

        public async Task<InvoiceRequestDto?> UploadInvoiceForOtherSource(InvoiceRequestDto invoiceDetails)
        {
            string fileName = $"{invoiceDetails.RefrenceNumber}/{invoiceDetails.InvoiceFile.FileName}";
            invoiceDetails.InvoiceFilePath = fileName;

            var response = await _blobEngine.UploadBlob(_invoiceContainer, fileName, invoiceDetails.InvoiceFile);

            if (response)
            {
                return invoiceDetails;
            }
            return null;
        }
    }
}

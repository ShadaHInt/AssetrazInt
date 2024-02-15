using AssetrazContracts.EngineContracts;
using AssetrazContracts.LoggerContracts;
using AssetrazContracts.Others;
using Azure.Storage;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Specialized;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace AssetrazEngine
{
    public class BlobEngine: IBlobEngine
    {
        private readonly StorageAccountOptions _options;
        private readonly ILogAnalytics _logger;


        public BlobEngine(IOptions<StorageAccountOptions> options, ILogAnalytics logger)
        {
            _options = options.Value;
            _logger = logger;
        }

        private BlobContainerClient GetContainerClient(StorageAccountContainer storageAccountContainer)
        {
            var container = string.Empty;

            switch(storageAccountContainer)
            {
                case StorageAccountContainer.Quotes:
                    container = _options.VendorQuoteContainer;
                    break;
                case StorageAccountContainer.PurchaseOrders:
                    container = _options.PurchaseOrderContainer;
                    break;
                case StorageAccountContainer.Invoices:
                    container = _options.InvoiceContainer;
                    break;
                case StorageAccountContainer.Insurance:
                    container = _options.InsuranceContainer;
                    break;
                case StorageAccountContainer.InventoryDocument:
                    container = _options.InventoryDocumentContainer;
                    break;
            }

            string blobUri = $"https://{_options.Name}.blob.core.windows.net/{container}";

            StorageSharedKeyCredential credential = new StorageSharedKeyCredential(_options.Name, _options.AccessKey);

            return new BlobContainerClient(new Uri(blobUri), credential);
        }

        public async Task<bool> UploadBlob(StorageAccountContainer container, string fileName, IFormFile file)
        {
            try
            {
                var blobClient = GetContainerClient(container);

                using (var data = file.OpenReadStream())
                {
                    await blobClient.CreateIfNotExistsAsync();

                    if (!await blobClient.GetBlockBlobClient(fileName).ExistsAsync())
                    {
                        await blobClient.UploadBlobAsync(fileName, data);
                    }

                }
                return true;
            } catch(Exception ex)
            {
                _logger.Error(ex.ToString());
                return false;
            }
        }

        public async Task<(Stream, string)> DownloadBlob(StorageAccountContainer container, string filePath)
        {
            try
            {
                BlobClient blobClient;
                using (MemoryStream stream = new MemoryStream())
                {
                    var blobContainerClient = GetContainerClient(container);
                    blobClient = blobContainerClient.GetBlobClient(filePath);

                    await blobClient.DownloadToAsync(stream);
                }
                var contentType = blobClient.GetProperties().Value.ContentType;

                Stream blobStream = blobClient.OpenReadAsync().Result;
                return (blobStream, contentType);
            }
            catch (Exception ex)
            {
                _logger.Error(ex.ToString());
                return (null, null);
            }
        }

        public async Task<bool> DeleteBlob(StorageAccountContainer container, string filePath)
        {
            try
            {
                BlobClient blobClient = GetContainerClient(container).GetBlobClient(filePath);
                await blobClient.DeleteIfExistsAsync();
                return true;

            }
            catch (Exception ex)
            {
                _logger.Error(ex.ToString());
                return false;
            }
        }
    }
}
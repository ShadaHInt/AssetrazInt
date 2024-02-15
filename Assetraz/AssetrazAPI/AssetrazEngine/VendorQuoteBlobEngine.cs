using AssetrazContracts.DTOs;
using AssetrazContracts.EngineContracts;
using AssetrazContracts.Others;

namespace AssetrazEngine
{
    public class VendorQuoteBlobEngine : IVendorQuoteBlobEngine
    {
        private readonly IBlobEngine _blobEngine;
        private const StorageAccountContainer _quotesContainer = StorageAccountContainer.Quotes;


        public VendorQuoteBlobEngine(IBlobEngine blobEngine)
        {
            _blobEngine = blobEngine;
        }

        public async Task<bool> DeleteVendorQuote(string filePath)
        {
            return await _blobEngine.DeleteBlob(_quotesContainer, filePath);
        }

        public async Task<(Stream, string)> DownloadVendorQuote(string filePath)
        {
            return await _blobEngine.DownloadBlob(_quotesContainer, filePath);

        }

        public async Task<List<RequestForQuoteParticipantDto>> UploadQuotesToContainer(List<RequestForQuoteParticipantDto> requestForQuote)
        {
            await Parallel.ForEachAsync(requestForQuote, async (request, token) =>
            {
                if (request.QuoteFile == null) return;

                if (request.ProcurementRequestId == Guid.Empty || request.ProcurementVendorId == Guid.Empty || string.IsNullOrEmpty(request.QuoteFile.FileName))
                {
                    throw new NullReferenceException("ProcurementRequestId, ProcurementVendorId , FileName not valid");
                }
                string fileName = $"{request.ProcurementRequestId}/{request.ProcurementVendorId}/{request.QuoteFile.FileName}";

                await _blobEngine.UploadBlob(_quotesContainer, fileName, request.QuoteFile);

                request.QutoeFilePath = fileName;

            });

            return requestForQuote;
        }
    }
}

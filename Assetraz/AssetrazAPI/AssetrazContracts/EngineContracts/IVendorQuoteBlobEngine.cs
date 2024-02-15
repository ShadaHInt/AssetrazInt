using AssetrazContracts.DTOs;

namespace AssetrazContracts.EngineContracts
{
    public interface IVendorQuoteBlobEngine
    {
        Task<List<RequestForQuoteParticipantDto>> UploadQuotesToContainer(List<RequestForQuoteParticipantDto> requestForQuote);
        Task<(Stream, string)> DownloadVendorQuote(string filePath);
        Task<bool> DeleteVendorQuote(string filePath);
    }
}

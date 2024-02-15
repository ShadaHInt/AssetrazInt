using AssetrazContracts.DTOs;

namespace AssetrazContracts.ManagerContracts
{
    public interface IProcurementManager
    {
        Task<List<RequestQuoteDto>> GetAllProcurement();
        Task<List<RequestQuoteDto>> GetProcurementsForApprovalDashboard();
        Task<List<RequestForQuoteDetailsDto>> GetProcurementDetails(Guid procurementRequestId, Guid vendorId);
        Task<List<RequestQuoteDto>> GetProcurement(Guid procurementRequestId);
        Task<bool> UpdateRequestStatus(Guid procurementRequestId, bool? isDelete, bool? isApproved, string? comments, bool? cc);
        Task<bool> NewProcurementRequest(List<RequestQuoteDto> newRequest, bool request, bool cc);
        Task<string> NewProcurementForApprovedUserRequests(List<RequestQuoteDto> newRequest);
        Task<bool> UpdateProcurement(List<RequestQuoteDto> requests, bool statusUpdate, bool cc);
        Task<bool> UploadVendorQuotes(List<RequestForQuoteParticipantDto> vendorQuoteList);
        Task<(Stream, string, string)> DownloadVendorQuote(Guid procurementVendorId);
        Task<bool> DeleteVendorQuote(Guid procurementVendorId);
        Task<List<ITRequestNumberDto>> GetAllProcurementRequestNumbers();
    }
}

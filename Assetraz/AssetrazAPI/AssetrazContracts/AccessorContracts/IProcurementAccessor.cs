using AssetrazContracts.DTOs;

namespace AssetrazContracts.AccessorContracts
{
    public interface IProcurementAccessor
    {
        Task<List<RequestQuoteDto>> GetAllProcurement();
        Task<List<RequestQuoteDto>> GetProcurementsForApprovalDashboard();
        Task<List<RequestQuoteDto>> GetProcurement(Guid procurementRequestId);
        Task<List<RequestForQuoteDetailsDto>> GetProcurementDetails(Guid procurementRequestId, Guid vendorId);
        Task<bool> UpdateRequestStatus(Guid procurementRequestId, bool? isDelete, bool? isApproved, string? comments);
        Task<Guid> NewProcurementRequest(List<RequestQuoteDto> newRequest);
        Task<string> NewProcurementForApprovedUserRequests(List<RequestQuoteDto> newRequest);
        Task<bool> UpdateProcurement(List<RequestQuoteDto> requests);
        Task<bool> UpdateVendorDetails(List<RequestForQuoteParticipantDto> requests);
        Task<string> GetBlobFilePath(Guid procurementVendorId);
        Task<bool> DeleteVendorProcurementQuote(Guid procurementVendorId);
        Task<List<ITRequestNumberDto>> GetAllProcurementRequestNumbers();
        Task<RequestQuoteDto> GetRequestQuoteHeader(Guid procurementRequestId);
    }
}

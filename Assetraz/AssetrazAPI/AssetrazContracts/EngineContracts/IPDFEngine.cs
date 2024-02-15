using AssetrazContracts.DTOs;

namespace AssetrazContracts.EngineContracts
{
    public interface IPDFEngine
    {
        // Stream data, vendor details, PO number(file name)
        Task<(MemoryStream?, VendorDetailsDto?, string?)> GeneratePurchaseOrderPDFStream(Guid purchaseOrderRequestId);
        Task<(MemoryStream?, List<RequestForQuoteParticipantDto?>, string?)> GenerateQuoteHTMLStream(Guid procurementRequestId);
    }
}

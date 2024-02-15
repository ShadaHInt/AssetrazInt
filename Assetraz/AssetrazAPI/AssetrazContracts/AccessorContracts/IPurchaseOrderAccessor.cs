using AssetrazContracts.DTOs;

namespace AssetrazContracts.AccessorContracts
{
    public interface IPurchaseOrderAccessor
    {
        Task<List<PurchaseOrderDto>> GetPurchaseOrderList();
        Task<List<PurchaseOrderDetailsDto>> GetPurchaseDetails(Guid purchaseOrderRequestId, string? purchaseOrderNumber);
        Task<List<PurchaseOrderDetailsDto>> GetPurchaseOrder(Guid purchaseOrderRequestId);

        Guid AddPurchaseOrder(List<RequestForQuoteDetailsDto> createPoDto);
        bool AddPartialOrder(List<PurchaseOrderDetailsDto> purchaseDetailsDto);
        Task<bool> UpdatePurchaserOrderDetails(List<PurchaseOrderDetailsDto> purchaseOrderDetails, bool? isHandover);
        Task<List<PurchaseOrderDetailsFunctionDto>> GetPurchaseOrderDetailsForQuoteGeneration(Guid purchaseOrderRequestId);
        Task<List<PurchaseOrderDetailsDto>> GetProcurementReport();
    }
}

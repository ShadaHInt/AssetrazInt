using AssetrazContracts.DTOs;

namespace AssetrazContracts.ManagerContracts
{
    public interface IPurchaseOrderManager
    {
        Task<List<PurchaseOrderDto>> GetPurchaseOrderList();
        Task<List<PurchaseOrderDetailsDto>> GetPurchaseDetails(Guid purchaseOrderRequestId , string? purchaseOrderNumber);
        Task<bool> UpdatePurchaseOrderDetails(List<PurchaseOrderDetailsDto> purchaserOrderDetails, bool? isPartial, bool? isHandover);
        Task<List<PurchaseOrderDetailsDto>> GetPurchaseOrder(Guid purchaseOrderRequestId);

        Task<bool> AddPurchaseOrder(List<RequestForQuoteDetailsDto> createPoDto);
        Task<List<PurchaseOrderDetailsDto>> GetProcurementReport();
    }
}

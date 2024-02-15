using AssetrazContracts.DTOs;

namespace AssetrazContracts.EngineContracts
{
    public interface IPurchaseOrderEngine
    {
        Task<bool> ValidateUpdate(List<PurchaseOrderDetailsDto> purchaseOrderDetails, bool? isPartial, bool? isHandover);
    }
}

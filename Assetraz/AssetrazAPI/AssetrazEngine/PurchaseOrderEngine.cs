using AssetrazContracts.AccessorContracts;
using AssetrazContracts.DTOs;
using AssetrazContracts.EngineContracts;

namespace AssetrazEngine
{
    public class PurchaseOrderEngine : IPurchaseOrderEngine
    {
        private readonly IPurchaseOrderAccessor _purchaseOrderAccessor;

        public PurchaseOrderEngine(IPurchaseOrderAccessor purchaseOrderAccessor)
        {
            _purchaseOrderAccessor = purchaseOrderAccessor;
        }

        public async Task<bool> ValidateUpdate(List<PurchaseOrderDetailsDto> purchaseOrderDetails, bool? isPartial, bool? isHandover)
        {
            bool isAllItemsRecieved = purchaseOrderDetails.All(po => po.Quantity == po.QuantityReceived);

            if (!isAllItemsRecieved && isPartial.HasValue && isPartial.Value == true)
            {
                List<PurchaseOrderDetailsDto> partialOrderList = new(purchaseOrderDetails.Count);
                foreach (PurchaseOrderDetailsDto item in purchaseOrderDetails)
                {
                    if (item.Quantity != item.QuantityReceived)
                    {
                        PurchaseOrderDetailsDto partialOrder = new PurchaseOrderDetailsDto
                        {
                            Quantity = item.Quantity - item.QuantityReceived.Value,
                            QuantityReceived = 0,
                            PurchaseOrderRequestId = item.PurchaseOrderRequestId,
                            PurchaseOrderDetailsId = item.PurchaseOrderDetailsId,
                            CategoryId = item.CategoryId,
                            ManufacturerId = item.ManufacturerId,
                            CategoryName = item.CategoryName,
                            RatePerQuantity = item.RatePerQuantity,
                            ManufacturerName = item.ManufacturerName,
                            ModelNumber = item.ModelNumber,
                            Specifications = item.Specifications,
                            VendorId = item.VendorId
                        };
                        partialOrderList.Add(partialOrder);
                    }
                }

                var isPartialItemsCreated = _purchaseOrderAccessor.AddPartialOrder(partialOrderList);
                if (!isPartialItemsCreated) return false;
            }

            return await _purchaseOrderAccessor.UpdatePurchaserOrderDetails(purchaseOrderDetails, isHandover);

        }
    }
}

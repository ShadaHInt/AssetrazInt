using AssetrazContracts.AccessorContracts;
using AssetrazContracts.DTOs;
using AssetrazContracts.EngineContracts;
using AssetrazContracts.Enums;
using AssetrazContracts.ManagerContracts;

namespace AssetrazManagers
{
    public class PurchaseOrderManager : IPurchaseOrderManager
    {
        private IPurchaseOrderAccessor _purchaseOrderAccessor;
        private readonly IPurchaseOrderEngine _purchaseOrderEngine;
        private readonly IFunctionQueueEngine _functionQueueEngine;

        public PurchaseOrderManager(IPurchaseOrderAccessor purchaseOrderAccessor,
            IPurchaseOrderEngine purchaseOrderEngine,
            IFunctionQueueEngine functionQueueEngine)
        {
            _purchaseOrderAccessor = purchaseOrderAccessor;
            _purchaseOrderEngine = purchaseOrderEngine;
            _functionQueueEngine = functionQueueEngine;
        }

        public async Task<List<PurchaseOrderDto>> GetPurchaseOrderList()
        {
            return await _purchaseOrderAccessor.GetPurchaseOrderList();
        }

        public async Task<List<PurchaseOrderDetailsDto>> GetPurchaseDetails(Guid purchaseOrderRequestId, string? purchaseOrderNumber)
        {
            List<PurchaseOrderDetailsDto> purchaseDetails = await _purchaseOrderAccessor.GetPurchaseDetails(purchaseOrderRequestId, purchaseOrderNumber);
            if (purchaseDetails.Any())
            {
                return purchaseDetails;
            }
            else
            {
                throw new NullReferenceException($"Couldn't find record for {purchaseOrderRequestId}");
            }
        }
        public async Task<List<PurchaseOrderDetailsDto>> GetPurchaseOrder(Guid purchaseOrderRequestId)
        {
            List<PurchaseOrderDetailsDto> purchaseOrder = await _purchaseOrderAccessor.GetPurchaseOrder(purchaseOrderRequestId);
            if (purchaseOrder.Any())
            {
                return purchaseOrder;
            }
            else
            {
                throw new NullReferenceException($"Couldn't find record for {purchaseOrderRequestId}");
            }
        }

        public async Task<bool> AddPurchaseOrder(List<RequestForQuoteDetailsDto> createPoDto)
        {
            Guid purchaseOrderRequestId = _purchaseOrderAccessor.AddPurchaseOrder(createPoDto);
            if (purchaseOrderRequestId != Guid.Empty)
            {
                var result = await _functionQueueEngine.PushMessage(new QueueMessageDto
                {
                    Process = QueueProcess.PurchaseOrder,
                    ProcessId = purchaseOrderRequestId
                });
                return result;
            }
            else
                throw new NullReferenceException($"Couldn't find record for {createPoDto.First().ProcurementRequestId}");
        }

        public async Task<bool> UpdatePurchaseOrderDetails(List<PurchaseOrderDetailsDto> purchaserOrderDetails, bool? isPartial, bool? isHandover)
        {
            return await _purchaseOrderEngine.ValidateUpdate(purchaserOrderDetails, isPartial, isHandover);
        }

        public async Task<List<PurchaseOrderDetailsDto>> GetProcurementReport()
        {
            return await _purchaseOrderAccessor.GetProcurementReport();
        }

    }
}

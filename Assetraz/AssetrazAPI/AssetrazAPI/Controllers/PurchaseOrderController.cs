using AssetrazContracts.DTOs;
using AssetrazContracts.ManagerContracts;
using AssetrazManagers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AssetrazAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PurchaseOrderController : ControllerBase
    {
        private IPurchaseOrderManager _purchaseOrderManager;
        public PurchaseOrderController(IPurchaseOrderManager PurchaseOrderManager)
        {
            _purchaseOrderManager = PurchaseOrderManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetPurchaseOrders()
        {
            var orders = await _purchaseOrderManager.GetPurchaseOrderList();
            return Ok(orders);
        }

        [HttpGet("details/{purchaseOrderRequestId}")]
        public async Task<IActionResult> GetPurchaseDetails(Guid purchaseOrderRequestId, [FromQuery(Name = "purchaseOrderNumber")] string? purchaseOrderNumber)
        {
            return Ok(await _purchaseOrderManager.GetPurchaseDetails(purchaseOrderRequestId, purchaseOrderNumber));
        }

        [HttpGet("view/{purchaseOrderRequestId}")]
        public async Task<ActionResult<PurchaseOrderDetailsDto>> GetPurchaseOrder(Guid purchaseOrderRequestId)
        {
            return Ok(await _purchaseOrderManager.GetPurchaseOrder(purchaseOrderRequestId));
        }

        [HttpPut("update")]
        public async Task<ActionResult<bool>> UpdatePurchaseOrderDetails(List<PurchaseOrderDetailsDto> purchaseOrderDetails, bool? isPartial, bool? isHandover)
        {
            return Ok(await _purchaseOrderManager.UpdatePurchaseOrderDetails(purchaseOrderDetails, isPartial, isHandover));
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddPurchaseOrder(List<RequestForQuoteDetailsDto> createPoDto)
        {
            var purchaseOrder = await _purchaseOrderManager.AddPurchaseOrder(createPoDto);
            return Ok();
        }

        [HttpGet("report")]
        public async Task<IActionResult> GetProcurementReport()
        {
            return Ok(await _purchaseOrderManager.GetProcurementReport());
        }
    }
}

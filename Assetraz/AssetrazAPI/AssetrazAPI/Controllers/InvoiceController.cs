
using AssetrazContracts.DTOs;
using AssetrazContracts.ManagerContracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AssetrazAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class InvoiceController: ControllerBase
    {
        private readonly IInvoiceManager _invoiceManager;

        public InvoiceController(IInvoiceManager purchaseOrderManager)
        {
            _invoiceManager = purchaseOrderManager;
        }

        [HttpGet("handover")]
        public async Task<ActionResult> GetInvoicesHandedOver()
        {
            return Ok(await _invoiceManager.GetInvoicesHandedOver());
        }


        [HttpGet("download-invoice/{invoiceId}")]
        public async Task<IActionResult> DownloadInvoice(Guid invoiceId)
        {
            var response = await _invoiceManager.DownloadInvoice(invoiceId);

            if (response.Item1 == null || string.IsNullOrEmpty(response.Item2) || string.IsNullOrEmpty(response.Item3))
                return NotFound();

            return File(response.Item1, response.Item2, response.Item3);
        }

        [HttpPost("upload-invoice")]
        public async Task<ActionResult<InvoiceDto>> UploadInvoice([FromForm] InvoiceDto invoiceDetails)
        {
            return Ok(await _invoiceManager.UploadInvoice(invoiceDetails));
        }

        [HttpPost("upload-invoice-oldAsset")]
        public async Task<ActionResult<InvoiceDto>> UploadInvoiceForOldAssets([FromForm] InvoiceRequestDto invoiceDetails) 
        {
            return Ok(await _invoiceManager.UploadInvoiceForOldAssets(invoiceDetails));
        }

        [HttpDelete("delete-invoice/{invoiceId}")]
        public async Task<IActionResult> DeleteInvoice(Guid invoiceId)
        {
            var response = await _invoiceManager.DeleteInvoice(invoiceId);

            return Ok(response);
        }
    }
}

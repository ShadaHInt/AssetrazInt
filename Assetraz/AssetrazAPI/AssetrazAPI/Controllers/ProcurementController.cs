using AssetrazContracts.DTOs;
using AssetrazContracts.ManagerContracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AssetrazAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ProcurementController : ControllerBase
    {
        private IProcurementManager _procurementManager;
        public ProcurementController(IProcurementManager procurementManager)
        {
            _procurementManager = procurementManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProcurement()
        {
            return Ok(await _procurementManager.GetAllProcurement());
        }

        [HttpGet("approvals")]
        public async Task<IActionResult> GetProcurementsForApprovalDashboard()
        {
            return Ok(await _procurementManager.GetProcurementsForApprovalDashboard());
        }

        [HttpGet("{procurementRequestId}")]
        public async Task<ActionResult<List<RequestQuoteDto>>> GetProcurement(Guid procurementRequestId)
        {
            return Ok(await _procurementManager.GetProcurement(procurementRequestId));
        }


        [HttpPost("new")]
        public async Task<ActionResult<bool>> NewProcurementRequest(List<RequestQuoteDto> newRequest, bool requestForQuote, bool cc)
        {
            return Ok(await _procurementManager.NewProcurementRequest(newRequest, requestForQuote, cc));
        }

        [HttpPost("user-requests/procurement")]
        public async Task<ActionResult<string>> NewProcurementForApprovedUserRequests(List<RequestQuoteDto> newRequest)
        {
            return Ok(await _procurementManager.NewProcurementForApprovedUserRequests(newRequest));
        }

        [HttpPut("update")]
        public async Task<ActionResult<bool>> UpdateProcurement([FromBody] List<RequestQuoteDto> requests, bool statusUpdate, bool cc)
        {
            return Ok(await _procurementManager.UpdateProcurement(requests, statusUpdate, cc));
        }

        [HttpGet("details/{procurementRequestId}/{vendorId}")]
        public async Task<IActionResult> GetProcurementDetails(Guid procurementRequestId, Guid vendorId)
        {
            return Ok(await _procurementManager.GetProcurementDetails(procurementRequestId, vendorId));
        }

        [HttpPut("update-status/{procurementRequestId}")]
        public async Task<ActionResult<bool>> UpdateRequestStatus(Guid procurementRequestId, [FromBody] string? comments, bool? isDelete, bool? isApproved, bool? cc)
        {
            return Ok(await _procurementManager.UpdateRequestStatus(procurementRequestId, isDelete, isApproved, comments, cc));
        }


        [HttpPost("upload-quote")]
        public async Task<ActionResult<bool>> UploadVendorQuotes([FromForm] List<RequestForQuoteParticipantDto> vendorQuoteList)
        {
            return Ok(await _procurementManager.UploadVendorQuotes(vendorQuoteList));
        }

        [HttpGet("download-quote/{procurementVendorId}")]
        public async Task<IActionResult> DownloadVendorQuote(Guid procurementVendorId)
        {
            var response = await _procurementManager.DownloadVendorQuote(procurementVendorId);

            if (response.Item1 == null || string.IsNullOrEmpty(response.Item2) || string.IsNullOrEmpty(response.Item3))
                return NotFound();

            return File(response.Item1, response.Item2, response.Item3);
        }

        [HttpDelete("quote/{procurementVendorId}")]
        public async Task<IActionResult> DeleteVendorQuote(Guid procurementVendorId)
        {
            var response = await _procurementManager.DeleteVendorQuote(procurementVendorId);

            return Ok(response);
        }

        [HttpGet("requestNumber")]
        public async Task<IActionResult> GetAllProcurementRequestNumbers()
        {
            var procurementNumber = await _procurementManager.GetAllProcurementRequestNumbers();
            return Ok(procurementNumber);
        }
    }

}

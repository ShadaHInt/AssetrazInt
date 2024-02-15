using AssetrazContracts.DTOs;
using AssetrazContracts.ManagerContracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AssetrazAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PurchaseRequestController : ControllerBase
    {
        private IPurchaseRequestManager _requestManager;
        private IUserManager _userManager;
        public PurchaseRequestController(IPurchaseRequestManager requestManager, IUserManager userManager)
        {
            _requestManager = requestManager;
            _userManager = userManager;
        }

        [HttpGet("getPurchaseRequestByuser")]
        public async Task<IActionResult> GetpurchaseRequestByUser()
        {
            var requests = await _requestManager.GetPurchaseRequests();
            return Ok(requests);
        }

        [HttpPost("newAsset")]
        public async Task<ActionResult<bool>> NewAssetRequest(PurchaseRequestDto requestDto)
        {
            ADUserDto employeeDetails = await _userManager.GetEmployeeDetails();
            bool response = _requestManager.NewAssetRequest(requestDto, employeeDetails);

            return Ok(response);
        }

        [HttpPost("updateAssetRequest")]
        public async Task<ActionResult<bool>> UpdateAssetRequest(string requestNumber, PurchaseRequestDto requestDto)
        {
            ADUserDto manager = await _userManager.GetManagerDetails();
            bool response = await _requestManager.UpdateAssetRequest(requestDto, requestNumber, manager);

            return Ok(response);
        }

        [HttpPost("deleteAssetRequest")]
        public async Task<ActionResult<bool>> DeleteAssetRequest(string requestNumber)
        {
            bool response = await _requestManager.DeleteAssetRequest(requestNumber);

            return Ok(response);
        }

        [HttpPost("reviewAssetRequest")]
        public async Task<ActionResult<bool>> ReviewAssetRequest(string requestNumber, bool review, PurchaseRequestDto requestDto)
        {
            bool response = await _requestManager.ReviewAssetRequest(requestNumber, review, requestDto);

            return Ok(response);
        }

        [HttpGet("getPurchaseRequestBySupervisor")]
        public async Task<IActionResult> GetUserRequestsForSupervisor()
        {
            var requests = await _requestManager.GetUserRequestsByApproverId();
            return Ok(requests);
        }

        [HttpGet("approvedRequest")]
        public async Task<IActionResult> ApprovedUserRequests()
        {
            var userRequests = await _requestManager.ApprovedUserRequests();
            return Ok(userRequests);
        }

        [HttpGet("purchaseRequest/irq/{purchaseRequestNumber}")]
        public async Task<IActionResult> GetPurchaseRequestsForIRQ(string PurchaseRequestNumber)
        {
            return Ok(await _requestManager.GetPurchaseRequestsForIRQ(PurchaseRequestNumber));
        }
    }
}

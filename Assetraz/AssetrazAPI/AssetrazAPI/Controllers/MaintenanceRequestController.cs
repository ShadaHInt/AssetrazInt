using AssetrazContracts.DTOs;
using AssetrazContracts.ManagerContracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AssetrazAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MaintenanceRequestController : ControllerBase
    {
        private IMaintenanceRequestManager _requestManager;
        public MaintenanceRequestController(IMaintenanceRequestManager RequestManager)
        {
            _requestManager = RequestManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetMaintenanceRequestByUser()
        {
            return Ok(await _requestManager.GetMaintenanceRequests());
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllMaintenanceRequests()
        {
            return Ok(await _requestManager.GetAllMaintenanceRequests());
        }

        [HttpPost]
        public async Task<ActionResult<bool>> AddMaintenanceRequest(MaintenanceRequestDto maintenanceRequestDto)
        {
            return Ok (await _requestManager.AddMaintenanceRequest(maintenanceRequestDto));
        }

    }
}

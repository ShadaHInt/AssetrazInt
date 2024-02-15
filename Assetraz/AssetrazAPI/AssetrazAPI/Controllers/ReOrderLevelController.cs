using AssetrazContracts.DTOs;
using AssetrazContracts.ManagerContracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AssetrazAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ReOrderLevelController : ControllerBase
    {
        private IReorderLevelManager _reOrderLevelManager;
        public ReOrderLevelController(IReorderLevelManager reorderLevelManager)
        {
            _reOrderLevelManager = reorderLevelManager;
        }
        [HttpGet("reorder-level-master-data")]
        public async Task<ActionResult<List<ReOrderLevelsDto>>> GetReOrderLevels(Guid networkCompanyId)
        {
            return Ok(await _reOrderLevelManager.GetReOrderLevels(networkCompanyId));
        }

        [HttpPost("add")]
        public async Task<ActionResult<bool>> AddReOrderLevels(List<ReOrderLevelsDto> reOrderLevelList)
        {
            return Ok(await _reOrderLevelManager.AddReOrderLevels(reOrderLevelList));
        }

        [HttpPut("update")]
        public async Task<ActionResult<bool>> UpdateReOrderLevels(List<ReOrderLevelsDto> reOrderLevelList)
        {
            return Ok(await _reOrderLevelManager.UpdateReOrderLevels(reOrderLevelList));
        }
    }
}

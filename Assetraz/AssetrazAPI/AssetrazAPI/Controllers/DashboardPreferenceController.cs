using AssetrazContracts.DTOs;
using AssetrazContracts.ManagerContracts;
using AssetrazDataProvider.Entities;
using AssetrazManagers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AssetrazAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DashboardPreferenceController : ControllerBase
    {
        private IDashboardPreferenceManager _dashboardPreferenceManager;
        public DashboardPreferenceController(IDashboardPreferenceManager dashboardPreferenceManager)
        {
            _dashboardPreferenceManager = dashboardPreferenceManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetAssetCountForDashboard()
        {
            var dataForDashboard = await _dashboardPreferenceManager.GetAssetCountForDashboard();
            return Ok(dataForDashboard);
        }

        [HttpPost]
        public async Task<ActionResult<bool>> AddDashboardPreference(DashboardPreferenceDto newPreference)
        {
            var source = await _dashboardPreferenceManager.AddDashboardPreference(newPreference);
            return Ok(source);
        }

        [HttpPut]
        public async Task<ActionResult<bool>> DeleteDashboardPreference(Guid preferenceId)
        {
            var deletedSource = await _dashboardPreferenceManager.DeleteDashboardPreference(preferenceId);
            return Ok(deletedSource);
        }
    }
}

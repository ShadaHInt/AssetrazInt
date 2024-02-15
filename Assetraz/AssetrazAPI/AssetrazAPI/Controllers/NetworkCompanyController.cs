using AssetrazContracts.DTOs;
using AssetrazContracts.ManagerContracts;
using AssetrazManagers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AssetrazAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class NetworkCompanyController : ControllerBase
    {
        private INetworkCompanyManager _networkCompanyManager;
        public NetworkCompanyController(INetworkCompanyManager networkCompanyManager)
        {
            _networkCompanyManager = networkCompanyManager;
        }


        [HttpGet]
        public async Task<IActionResult> GetAllNetworkCompanies()
        {
            var companyNames = await _networkCompanyManager.GetAllNetworkCompanies();
            return Ok(companyNames);
        }

        [HttpGet("active")]
        public async Task<IActionResult> GetActiveNetworkCompanies()
        {
            var companyNames = await _networkCompanyManager.GetActiveNetworkCompanies();
            return Ok(companyNames);
        }

        [HttpPost]
        public async Task<ActionResult<bool>> AddNetworkCompany(NetworkCompanyDto newNetworkCompany)
        {
            var networkCompany = await _networkCompanyManager.AddNetworkCompany(newNetworkCompany);
            return Ok(networkCompany);
        }

        [HttpPut]
        public async Task<ActionResult<bool>> UpdateNetworkCompany(NetworkCompanyDto updatedNetworkCompany)
        {
            var editedNetworkCompany = await _networkCompanyManager.UpdateNetworkCompany(updatedNetworkCompany);
            return Ok(editedNetworkCompany);
        }

        [HttpDelete]
        public async Task<ActionResult<bool>> DeleteNetworkCompany(Guid networkCompanyId)
        {
            var deletedNetworkCompany = await _networkCompanyManager.DeleteNetworkCompany(networkCompanyId);
            return Ok(deletedNetworkCompany);
        }
    }
}

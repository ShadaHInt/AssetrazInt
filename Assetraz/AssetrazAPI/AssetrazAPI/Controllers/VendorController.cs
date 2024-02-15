using AssetrazContracts.DTOs;
using AssetrazContracts.ManagerContracts;
using Microsoft.AspNetCore.Authorization;   
using Microsoft.AspNetCore.Mvc;

namespace AssetrazAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class VendorController : ControllerBase
    {
        private IVendorManager _vendorManager;
        public VendorController(IVendorManager vendorManager)
        {
            _vendorManager = vendorManager;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllVendors()
        {
            var vendorNames = await _vendorManager.GetAllVendors();
            return Ok(vendorNames);
        }

        [HttpGet]
        public async Task<IActionResult> GetVendors()
        {
            var vendorNames = await _vendorManager.GetVendors();
            return Ok(vendorNames);
        }

        [HttpPost]
        public async Task<IActionResult> AddVendor([FromBody] VendorDetailsDto newVendor)
        {
            return Ok(await _vendorManager.AddVendor(newVendor));
        }

        [HttpPut]
        public async Task<IActionResult> UpdateVendor([FromBody] VendorDetailsDto newVendor)
        {
            return Ok(await _vendorManager.UpdateVendor(newVendor));
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteVendor(Guid vendorId)
        {
            return Ok(await _vendorManager.DeleteVendor(vendorId));
        }
    }
}

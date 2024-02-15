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
    public class ManufacturerController : ControllerBase
    {
        private IManufacturerManager _manufacturerManager;
        public ManufacturerController(IManufacturerManager manufacturerManager)
        {
            _manufacturerManager = manufacturerManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetManufacturers()
        {
            var manufacturerNames = await _manufacturerManager.GetManufacturers();
            return Ok(manufacturerNames);
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllManufacturers()
        {
            var manufacturerNames = await _manufacturerManager.GetAllManufacturers();
            return Ok(manufacturerNames);
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddManufacturer(ManufacturerDto manufacturer)
        {
            var result = await _manufacturerManager.AddManufacturer(manufacturer);
            return Ok(result);
        }

        [HttpPost("update")]
        public async Task<IActionResult> UpdateManufacturer(ManufacturerDto manufacturer)
        {
            var result = await _manufacturerManager.UpdateManufacturer(manufacturer);
            return Ok(result);
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteManufacturer(Guid manufacturerId)
        {
            return Ok(await _manufacturerManager.DeleteManufacturer(manufacturerId));
        }
    }
}

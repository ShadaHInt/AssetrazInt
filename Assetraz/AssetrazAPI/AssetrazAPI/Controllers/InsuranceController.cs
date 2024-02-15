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
    public class InsuranceController : ControllerBase
    {
        private IInsuranceManager insuranceManager;
        public InsuranceController(IInsuranceManager _insuranceManager)
        {
            insuranceManager = _insuranceManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetInsuredAssets()
        {
            var insuredItems = await insuranceManager.GetInsuredAssets();
            return Ok(insuredItems);
        }

        [HttpPut]
        public async Task<ActionResult<bool>> UpdateInsurance(List<AssetInsuranceDto> updatedData)
        {
            var response = await insuranceManager.UpdateInsurance(updatedData);
            if (response)
                return Ok(response);
            return BadRequest(response);
        }

        [HttpGet("insuranceDetails")]
        public async Task<IActionResult> GetInsuranceDetails([FromQuery]List<Guid> insuranceReferenceIds)
        {
            var insuranceDetails = await insuranceManager.GetInsuranceDetails(insuranceReferenceIds);
            return Ok(insuranceDetails);
        }

        [HttpPost("upload-policy")]
        public async Task<ActionResult<bool>> UploadInsurancePolicy([FromForm] InsurancePolicyDto insurancePolicy)
        {
            return Ok(await insuranceManager.UploadInsurancePolicy(insurancePolicy));
        }

        [HttpGet("download-policy/{referenceNumber}")]
        public async Task<IActionResult> DownloadInsurancePolicy(Guid referenceNumber)
        {
            var response = await insuranceManager.DownloadInsurancePolicy(referenceNumber);

            if (response.Item1 == null)
                return NotFound();

            return File(response.Item1,response.Item2,response.Item3);
        }

        [HttpDelete("policy/{referenceNumber}")]
        public async Task<IActionResult> DeleteInsurancePolicy(Guid referenceNumber)
        {
            var response = await insuranceManager.DeleteInsurancePolicy(referenceNumber);

            return Ok(response);
        }
    }
}

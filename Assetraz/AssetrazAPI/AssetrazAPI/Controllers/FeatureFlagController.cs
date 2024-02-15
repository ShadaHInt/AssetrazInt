using AssetrazContracts.ManagerContracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AssetrazAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class FeatureFlagController : ControllerBase
    {
        private IFeatureFlagManager _featureFlagManager;

        public FeatureFlagController(IFeatureFlagManager featureFlagManager)
        {
            _featureFlagManager = featureFlagManager;
        }

        [HttpGet("{featureFlag}")]
        public IActionResult GetIsActiveFeatureFlag(string featureFlag)
        {
            return Ok(_featureFlagManager.isActiveFeatureFlag(featureFlag));
        }
    }
}

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
    public class SourceController : ControllerBase
    {
        private ISourceManager _sourceManager;
        public SourceController(ISourceManager sourceManager)
        {
            _sourceManager = sourceManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetSources()
        {
            var sourceNames = await _sourceManager.GetSources();
            return Ok(sourceNames);
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllSources()
        {
            var allSources = await _sourceManager.GetAllSources();
            return Ok(allSources);
        }

        [HttpPost]
        public async Task<ActionResult<bool>> AddSource( SourceDto newSource)
        {
            var source = await _sourceManager.AddSource(newSource);
            return Ok(source);
        }

        [HttpPut]
        public async Task<ActionResult<bool>> UpdateSource(SourceDto updatedSource)
        {
            var editedSource = await _sourceManager.UpdateSource(updatedSource);
            return Ok(editedSource);
        }

        [HttpDelete]
        public async Task<ActionResult<bool>> DeleteSource(Guid sourceId)
        {
            var deletedSource = await _sourceManager.DeleteSource(sourceId);
            return Ok(deletedSource);
        }
    }
}


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
    public class CategoryController : ControllerBase
    {
        private ICategoryManager _categoryManager;
        public CategoryController(ICategoryManager categoryManager)
        {
            _categoryManager = categoryManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetCategories()
        {
            var categoryNames = await _categoryManager.GetCategories();
            return Ok(categoryNames);
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllCategories()
        {
            var allCategories = await _categoryManager.GetAllCategories();
            return Ok(allCategories);
        }

        [HttpPost]
        public async Task<ActionResult<bool>> AddCategory(CategoryDto newCategory)
        {
            var categoryAdded = await _categoryManager.AddCategory(newCategory);
            return Ok(categoryAdded);
        }

        [HttpPut]
        public async Task<ActionResult<bool>> UpdateCategory(CategoryDto updatedCategory)
        {
            var editedCategory = await _categoryManager.UpdateCategory(updatedCategory);
            return Ok(editedCategory);
        }

        [HttpDelete]
        public async Task<ActionResult<bool>> DeleteCategory(Guid categoryId)
        {
            var deletedCategory = await _categoryManager.DeleteCategory(categoryId);
            return Ok(deletedCategory);
        }
    }
}

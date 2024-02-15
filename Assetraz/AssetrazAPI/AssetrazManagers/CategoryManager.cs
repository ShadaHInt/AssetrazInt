using AssetrazContracts.AccessorContracts;
using AssetrazContracts.DTOs;
using AssetrazContracts.Exceptions;
using AssetrazContracts.ManagerContracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssetrazManagers
{
    public class CategoryManager : ICategoryManager
    {
        private ICategoryAccessor _categoryAccessor;
        public CategoryManager(ICategoryAccessor categoryAccessor)
        {
            _categoryAccessor = categoryAccessor;
        }

        public async Task<List<CategoryDto>> GetAllCategories()
        {
            return await _categoryAccessor.GetAllCategories();
        }

        public async Task<List<CategoryDto>> GetCategories()
        {
            return await _categoryAccessor.GetCategories();
        }

        public async Task<bool> AddCategory(CategoryDto newCategory)
        {
            var categories = _categoryAccessor.GetCategoryNames();
            var category = categories.ConvertAll(c => c.ToUpper()).Contains(newCategory.CategoryName.ToUpper());
            if (category == false)
            {
                return await _categoryAccessor.AddCategory(newCategory);
            }
            else
            {
                throw new DuplicateException("Duplicate category found in DB!");
            }
        }

        public async Task<bool> UpdateCategory(CategoryDto updatedCategory)
        {
            var currentCategoryName = _categoryAccessor.GetExcistingCategory(updatedCategory).CategoryName;
            var filteredCategories = _categoryAccessor.GetCategoryNames().Where(i => i != currentCategoryName).ToList(); 
            var isExistCategory = filteredCategories.ConvertAll(c => c.ToUpper()).Contains(updatedCategory.CategoryName.ToUpper());
            if (isExistCategory == false)
            {
                return await _categoryAccessor.UpdateCategory(updatedCategory);
            }
            else
            {
                throw new DuplicateException("Category already exists");
            }
        }

        public async Task<bool> DeleteCategory(Guid categoryId)
        {
            return await _categoryAccessor.DeleteCategory(categoryId);
        }
    }
}

using AssetrazContracts.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssetrazContracts.AccessorContracts
{
    public interface ICategoryAccessor
    {
        Task<List<CategoryDto>> GetCategories();
        Task<List<CategoryDto>> GetAllCategories();
        Task<bool> AddCategory(CategoryDto newCategory);
        List<string?> GetCategoryNames();
        CategoryDto GetExcistingCategory(CategoryDto updatedCategory);
        Task<bool> UpdateCategory(CategoryDto updatedCategory);
        Task<bool> DeleteCategory(Guid categoryId);
        Task<bool> IsCategoryReferred(Guid categoryId);
    }
}

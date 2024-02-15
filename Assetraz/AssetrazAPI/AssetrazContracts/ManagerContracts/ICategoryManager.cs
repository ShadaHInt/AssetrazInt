using AssetrazContracts.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssetrazContracts.ManagerContracts
{
    public interface ICategoryManager
    {
        Task<List<CategoryDto>> GetCategories();
        Task<List<CategoryDto>> GetAllCategories();
        Task<bool> AddCategory(CategoryDto newCategory);
        Task<bool> UpdateCategory(CategoryDto updatedCategory);
        Task<bool> DeleteCategory(Guid categoryId);
    }
}

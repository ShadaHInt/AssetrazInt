using AssetrazAccessors.Common;
using AssetrazContracts.AccessorContracts;
using AssetrazContracts.DTOs;
using AssetrazDataProvider;
using AssetrazDataProvider.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace AssetrazAccessors
{
    public class CategoryAccessor : AccessorCommon, ICategoryAccessor
    {
        private AssetrazContext _dbContext;
        private readonly IMapper mapper;
        public CategoryAccessor(AssetrazContext dbContext, IMapper _mapper, IHttpContextAccessor httpContext) : base(httpContext)
        {
            _dbContext = dbContext;
            mapper = _mapper;
        }

        public async Task<List<CategoryDto>> GetCategories()
        {
            var categories = await _dbContext.Categories.Where (c => c.Active == true) .OrderBy(c => c.CategoryName).ToListAsync();
            List<CategoryDto> categoryNames = mapper.Map<List<CategoryDto>>(categories);
            return categoryNames;
        }

        public async Task<bool> AddCategory(CategoryDto newCategory)
        {

                Category category = new()
                {
                    CategoryId = Guid.NewGuid(),
                    CategoryName = newCategory.CategoryName,
                    Issuable = newCategory.Issuable,
                    AssetTagRequired = newCategory.AssetTagRequired,
                    SerialNumberRequired = newCategory.SerialNumberRequired,
                    WarrantyRequired = newCategory.WarrantyRequired,
                    UnitOfMeasurement = newCategory.UnitOfMeasurement,
                    Active = newCategory.Active,
                    CreatedBy = LoggedInUser,
                    UpdatedBy = LoggedInUser,
                    CreatedDate = DateTime.Now.ToUniversalTime(),
                    UpdatedDate = DateTime.Now.ToUniversalTime(),
                };

                _dbContext.Categories.Add(category);

                return await _dbContext.SaveChangesAsync() > 0;
        }
       
        public List<string?> GetCategoryNames()
        {
            List<string?> existingCategories = _dbContext.Categories.Select(c => c.CategoryName).ToList();
            return existingCategories;
        }
        public CategoryDto GetExcistingCategory(CategoryDto updatedCategory)
        {
            Category existingCategory = _dbContext.Categories.FirstOrDefault(c => c.CategoryId == updatedCategory.CategoryId);
            CategoryDto category = mapper.Map<CategoryDto>(existingCategory);

            return category;
        }
        public async Task<List<CategoryDto>> GetAllCategories()
        {
            var allCategories = await _dbContext.Categories.OrderBy(c => c.CategoryName).ToListAsync();
            List<CategoryDto> categories = mapper.Map<List<CategoryDto>>(allCategories);
            return categories;
        }

        public async Task<bool> UpdateCategory(CategoryDto updatedCategory)
        {
            Category selectedCategory = await _dbContext.Categories.FirstOrDefaultAsync(c => c.CategoryId == updatedCategory.CategoryId);
            selectedCategory.CategoryName = updatedCategory.CategoryName;
            selectedCategory.Issuable = updatedCategory.Issuable;
            selectedCategory.AssetTagRequired = updatedCategory.AssetTagRequired;
            selectedCategory.WarrantyRequired = updatedCategory.WarrantyRequired;
            selectedCategory.SerialNumberRequired = updatedCategory.SerialNumberRequired;
            selectedCategory.UnitOfMeasurement = updatedCategory.UnitOfMeasurement;
            selectedCategory.Active = updatedCategory.Active;
            selectedCategory.UpdatedBy = LoggedInUser;
            selectedCategory.UpdatedDate = DateTime.Now.ToUniversalTime();

            _dbContext.Categories.Update(selectedCategory); 
            return await _dbContext.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteCategory(Guid categoryId)
        {
            bool isCategoryReferred = await IsCategoryReferred(categoryId);
            Category category = await _dbContext.Categories.FirstOrDefaultAsync(c => c.CategoryId == categoryId);
            if(category == null) { 
                return false; 
            }

            if(isCategoryReferred)
            {
                category.Active = false;
                _dbContext.Categories.Update(category);
            }
            else
            {
                _dbContext.Categories.Remove(category);
            }

            return await _dbContext.SaveChangesAsync() > 0;   
        }

        public async Task<bool> IsCategoryReferred(Guid categoryId)
        {
            bool isReferred = await _dbContext.DashboardPreferences.AnyAsync(d => d.CategoryId.Equals(categoryId))
                || await _dbContext.VendorsCategories.AnyAsync(v => v.CategoryId.Equals(categoryId))
                || await _dbContext.RequestForQuoteDetails.AnyAsync(r => r.CategoryId.Equals(categoryId))
                || await _dbContext.PurchaseRequests.AnyAsync(p => p.CategoryId.Equals(categoryId))
                || await _dbContext.PurchaseOrderDetails.AnyAsync(p => p.CategoryId.Equals(categoryId))
                || await _dbContext.Inventories.AnyAsync(i => i.CategoryId.Equals(categoryId));

            return isReferred;
        }

    }
}

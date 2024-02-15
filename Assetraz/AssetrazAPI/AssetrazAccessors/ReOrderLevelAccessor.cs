using AssetrazContracts.AccessorContracts;
using AssetrazContracts.DTOs;
using AssetrazDataProvider;
using AssetrazDataProvider.Entities;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace AssetrazAccessors
{
    public class ReOrderLevelAccessor : IReorderLevelAccessor
    {
        private readonly IMapper mapper;
        private AssetrazContext dbContext;
        public ReOrderLevelAccessor(AssetrazContext DbContext, IMapper Mapper)
        {
            dbContext = DbContext;
            mapper = Mapper;
        }
        public async Task<List<ReOrderLevelsDto>> GetReOrderLevels(Guid networkCompanyId)
        {
            List<ReOrderLevelsDto> reOrderLevelsDtoList = await dbContext.Categories.Where(i => i.Active == true).
                GroupJoin(dbContext.ReOrderLevels
                    .Include(i => i.NetworkCompany)
                    .Include(i => i.Category),
                c => new { c.CategoryId, NetworkCompanyId = networkCompanyId },
                r => new { r.CategoryId, r.NetworkCompanyId },
                (c, r) => new { Categories = c, ReorderLevels = r })
                .SelectMany(r => r.ReorderLevels.DefaultIfEmpty(),
                    (r, reorderLevel) => new ReOrderLevelsDto
                    {
                        ReOrderId = reorderLevel == null ? null : reorderLevel.ReOrderId,
                        CategoryId = r.Categories.CategoryId,
                        CategoryName = r.Categories.CategoryName,
                        NetworkCompanyId = networkCompanyId,
                        ReOrderLevel = reorderLevel == null ? 0 : reorderLevel.ReOrderLevel1,
                        WarningLevel = reorderLevel == null ? 0 : reorderLevel.WarningLevel,
                        CriticalLevel = reorderLevel == null ? 0 : reorderLevel.CriticalLevel,
                    })
                .OrderBy(i => i.CategoryName)
                .ToListAsync();
            return reOrderLevelsDtoList;
        }

        public async Task<bool> AddReOrderLevels(List<ReOrderLevelsDto> reOrderLevelDtoList)
        {
            List<ReOrderLevel> reOrderLevelList = new();
            foreach (var item in reOrderLevelDtoList)
            {
                ReOrderLevel reOrderLevel = new()
                {
                    ReOrderId = Guid.NewGuid(),
                    NetworkCompanyId = item.NetworkCompanyId,
                    CategoryId = item.CategoryId,
                    ReOrderLevel1 = item.ReOrderLevel,
                    CriticalLevel = item.CriticalLevel,
                    WarningLevel = item.WarningLevel,
                };
                reOrderLevelList.Add(reOrderLevel);
            }
            await dbContext.AddRangeAsync(reOrderLevelList);

            return await dbContext.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateReOrderLevels(List<ReOrderLevelsDto> reOrderLevelDtoList)
        {
            List<ReOrderLevel> reOrderLevelList = new();
            foreach (var item in reOrderLevelDtoList)
            {
                var reOrderLevel = await dbContext.ReOrderLevels.FindAsync(item.ReOrderId);
                if (reOrderLevel == null)
                {
                    return false;
                }
                reOrderLevel.WarningLevel = item.WarningLevel;
                reOrderLevel.CriticalLevel = item.CriticalLevel;
                reOrderLevel.ReOrderLevel1 = item.ReOrderLevel;
                reOrderLevelList.Add(reOrderLevel);
            }
            dbContext.UpdateRange(reOrderLevelList);

            return await dbContext.SaveChangesAsync() > 0;
        }
    }
}

using AssetrazContracts.AccessorContracts;
using AssetrazContracts.DTOs;
using AssetrazContracts.ManagerContracts;

namespace AssetrazManagers
{
    public class ReOrderLevelManager : IReorderLevelManager
    {
        private IReorderLevelAccessor _reOrderLevelAccessor;
        public ReOrderLevelManager(IReorderLevelAccessor reOrderLevelAccessor)
        {
            _reOrderLevelAccessor = reOrderLevelAccessor;
        }
        public async Task<List<ReOrderLevelsDto>> GetReOrderLevels(Guid networkCompanyId)
        {
            return await _reOrderLevelAccessor.GetReOrderLevels(networkCompanyId);
        }

        public async Task<bool> AddReOrderLevels(List<ReOrderLevelsDto> reOrderLevelList)
        {
            return await _reOrderLevelAccessor.AddReOrderLevels(reOrderLevelList);
        }

        public async Task<bool> UpdateReOrderLevels(List<ReOrderLevelsDto> reOrderLevelList)
        {
            return await _reOrderLevelAccessor.UpdateReOrderLevels(reOrderLevelList);
        }
    }
}

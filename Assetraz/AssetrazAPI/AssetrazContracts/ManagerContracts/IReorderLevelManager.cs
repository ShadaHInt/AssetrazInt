using AssetrazContracts.DTOs;

namespace AssetrazContracts.ManagerContracts
{
    public interface IReorderLevelManager
    {
        Task<List<ReOrderLevelsDto>> GetReOrderLevels(Guid networkCompanyId);
        Task<bool> AddReOrderLevels(List<ReOrderLevelsDto> reorderLevelsDto);
        Task<bool> UpdateReOrderLevels(List<ReOrderLevelsDto> reorderLevelsDto);
    }
}

using AssetrazContracts.DTOs;

namespace AssetrazContracts.ManagerContracts
{
    public interface IDashboardPreferenceManager
    {
        Task<List<AssetStatusDto>> GetAssetCountForDashboard();
        Task<bool> AddDashboardPreference(DashboardPreferenceDto newPreference);
        Task<bool> DeleteDashboardPreference(Guid preferenceId);
    }
}

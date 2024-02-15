using AssetrazContracts.DTOs;

namespace AssetrazContracts.AccessorContracts
{
    public interface IDashboardPreferenceAccessor
    {
        Task<List<AssetStatusDto>> GetAssetCountForDashboard(string? userEmail, bool isNotDeleting = true);
        Task<bool> AddDashboardPreference(DashboardPreferenceDto newPreference);
        Task<DashboardPreferenceDto?> CheckDashboardPreference(DashboardPreferenceDto newPreference);
        Task<bool> UpdateDashboardPreference(DashboardPreferenceDto preference);
        Task<bool> DeleteDashboardPreference(Guid preferenceId);
        Task<bool> DeleteDashboardPreferences(List<Guid> preferenceIds);
    }
}

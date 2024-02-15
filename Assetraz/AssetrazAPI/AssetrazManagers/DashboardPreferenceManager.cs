using AssetrazContracts.AccessorContracts;
using AssetrazContracts.DTOs;
using AssetrazContracts.ManagerContracts;

namespace AssetrazManagers
{
    public class DashboardPreferenceManager : IDashboardPreferenceManager
    {
        private IDashboardPreferenceAccessor _preferenceAccessor;

        public DashboardPreferenceManager(IDashboardPreferenceAccessor DashboardPreferenceAccessor)
        {
            _preferenceAccessor = DashboardPreferenceAccessor;
        }
        public async Task<List<AssetStatusDto>> GetAssetCountForDashboard()
        {
            return await _preferenceAccessor.GetAssetCountForDashboard(null);
        }

        public async Task<bool> AddDashboardPreference(DashboardPreferenceDto newPreference)
        {
            DashboardPreferenceDto existingpreference = await _preferenceAccessor.CheckDashboardPreference(newPreference);
            if (existingpreference != null)
            {
                if(existingpreference.IsDeleted == true)
                {
                    return await _preferenceAccessor.UpdateDashboardPreference(existingpreference);
                }else
                {
                    throw new Exception("Adding existing preference.");
                }
            }

            return await _preferenceAccessor.AddDashboardPreference(newPreference);
        }

        public async Task<bool> DeleteDashboardPreference(Guid preferenceId)
        {
            return await _preferenceAccessor.DeleteDashboardPreference(preferenceId);
        }
    }
}

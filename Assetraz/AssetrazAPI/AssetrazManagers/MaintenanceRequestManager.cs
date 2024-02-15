using AssetrazContracts.AccessorContracts;
using AssetrazContracts.DTOs;
using AssetrazContracts.ManagerContracts;

namespace AssetrazManagers
{
    public class MaintenanceRequestManager : IMaintenanceRequestManager
    {
        private IMaintenanceRequestAccessor requestAccessor;
        public MaintenanceRequestManager(IMaintenanceRequestAccessor RequestAccessor)
        {
            requestAccessor = RequestAccessor;
        }

        public async Task<List<MaintenanceRequestDto>> GetMaintenanceRequests()
        {
            return await requestAccessor.GetMaintenanceRequests();
        }

        public async Task<List<MaintenanceRequestDto>> GetAllMaintenanceRequests()
        {
            return await requestAccessor.GetAllMaintenanceRequests();
        }

        public async Task<bool> AddMaintenanceRequest(MaintenanceRequestDto maintenanceRequestDto)
        {
                return await requestAccessor.AddMaintenanceRequest(maintenanceRequestDto);
        }
    }
}

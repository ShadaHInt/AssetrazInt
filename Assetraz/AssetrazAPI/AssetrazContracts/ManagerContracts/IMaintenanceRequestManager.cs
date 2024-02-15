using AssetrazContracts.DTOs;

namespace AssetrazContracts.ManagerContracts
{
    public interface IMaintenanceRequestManager
    {
        Task<List<MaintenanceRequestDto>> GetMaintenanceRequests();
        Task<List<MaintenanceRequestDto>> GetAllMaintenanceRequests();
        Task<bool> AddMaintenanceRequest(MaintenanceRequestDto maintenanceRequestDto);
    }
}

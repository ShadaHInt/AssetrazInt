using AssetrazContracts.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssetrazContracts.AccessorContracts
{
    public interface IMaintenanceRequestAccessor
    {
        Task<List<MaintenanceRequestDto>> GetMaintenanceRequests();
        Task<List<MaintenanceRequestDto>> GetAllMaintenanceRequests();
        Task<bool> AddMaintenanceRequest(MaintenanceRequestDto maintenanceRequestDto);
    }
}

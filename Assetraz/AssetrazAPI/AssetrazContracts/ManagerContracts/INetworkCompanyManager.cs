using AssetrazContracts.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssetrazContracts.ManagerContracts
{
    public interface INetworkCompanyManager
    {
        Task<List<NetworkCompanyDto>> GetActiveNetworkCompanies();
        Task<List<NetworkCompanyDto>> GetAllNetworkCompanies();
        Task<bool> AddNetworkCompany(NetworkCompanyDto newNetworkCompany);
        Task<bool> UpdateNetworkCompany(NetworkCompanyDto updatedNetworkCompany);
        Task<bool> DeleteNetworkCompany(Guid networkCompanyId);
    }
}

using AssetrazContracts.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssetrazContracts.AccessorContracts
{
    public interface INetworkCompanyAccessor
    {
        Task<List<NetworkCompanyDto>> GetActiveNetworkCompanies();
        Task<List<NetworkCompanyDto>> GetAllNetworkCompanies();
        List<string?> GetNetworkCompaniesNames();
        bool IsPrimaryNetworkCompanyExists(NetworkCompanyDto updatedNetworkCompany);
        Task<bool> AddNetworkCompany(NetworkCompanyDto newNetworkCompany);
        Task<bool> UpdateNetworkCompany(NetworkCompanyDto updatedNetworkCompany);
        NetworkCompanyDto GetExistingNetworkCompany(NetworkCompanyDto updatedNetworkCompany);
        Task<bool> DeleteNetworkCompany(Guid networkCompanyId);

    }
}

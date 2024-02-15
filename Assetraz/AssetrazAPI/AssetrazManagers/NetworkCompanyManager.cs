using AssetrazContracts.AccessorContracts;
using AssetrazContracts.DTOs;
using AssetrazContracts.ManagerContracts;
using AssetrazContracts.Exceptions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssetrazManagers
{
    public class NetworkCompanyManager : INetworkCompanyManager
    {
        private INetworkCompanyAccessor _networkCompanyAccessor;
        private IAssetsAccessor _assetsAccessor;
        public NetworkCompanyManager(INetworkCompanyAccessor networkCompanyAccessor, IAssetsAccessor assetsAccessor)
        {
            _networkCompanyAccessor = networkCompanyAccessor;
            _assetsAccessor = assetsAccessor;
        }

        public async Task<List<NetworkCompanyDto>> GetActiveNetworkCompanies()
        {
            return await _networkCompanyAccessor.GetActiveNetworkCompanies();
        }

        public async Task<List<NetworkCompanyDto>> GetAllNetworkCompanies()
        {
            return await _networkCompanyAccessor.GetAllNetworkCompanies();
        }

        public async Task<bool> AddNetworkCompany(NetworkCompanyDto newNetworkCompany)
        {
            var companies = _networkCompanyAccessor.GetNetworkCompaniesNames();
            bool isPrimaryExists = _networkCompanyAccessor.IsPrimaryNetworkCompanyExists(newNetworkCompany);
            var company = companies.ConvertAll(c => c.ToUpper()).Contains(newNetworkCompany.CompanyName.ToUpper());
            if (company == false)
            {
                if (newNetworkCompany.IsPrimary==true&&
                    isPrimaryExists == true)
                {
                    throw new PrimaryCompanyException("Primary network company already exists!");
                }
                else
                {
                    return await _networkCompanyAccessor.AddNetworkCompany(newNetworkCompany);
                }
            }
            else
            {
                throw new DuplicateException("Duplicate network company found in DB!");
            }
        }

        public async Task<bool> UpdateNetworkCompany(NetworkCompanyDto updatedNetworkCompany)
        {
            var currentCompanyName = _networkCompanyAccessor.GetExistingNetworkCompany(updatedNetworkCompany).CompanyName;
            bool isPrimaryExists = _networkCompanyAccessor.IsPrimaryNetworkCompanyExists(updatedNetworkCompany);
            var filteredCompanies = _networkCompanyAccessor.GetNetworkCompaniesNames().Where(i => i != currentCompanyName).ToList();
            var isExistCompany = filteredCompanies.ConvertAll(c => c.ToUpper()).Contains(updatedNetworkCompany.CompanyName.ToUpper());
            if (isExistCompany == false)
            {
                if (updatedNetworkCompany.IsPrimary == true &&
                    isPrimaryExists == true)
                {
                    throw new PrimaryCompanyException("Primary network company already exists!");
                }
                else
                {
                return await _networkCompanyAccessor.UpdateNetworkCompany(updatedNetworkCompany);
                   
                }
            }
            else
            {
                throw new DuplicateException("Network company already exists");
            }
        }

        public async Task<bool> DeleteNetworkCompany(Guid networkCompanyId)
        {
            return await _networkCompanyAccessor.DeleteNetworkCompany(networkCompanyId);
        }
    }
}

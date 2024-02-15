using AssetrazContracts.AccessorContracts;
using AssetrazContracts.DTOs;
using AssetrazDataProvider;
using AssetrazDataProvider.Entities;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using AssetrazAccessors.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace AssetrazAccessors
{
    public class NetworkCompanyAccessor : AccessorCommon, INetworkCompanyAccessor
    {
        private AssetrazContext _dbContext;
        private readonly IMapper mapper;
        public NetworkCompanyAccessor(AssetrazContext dbContext, IMapper _mapper, IHttpContextAccessor httpContext) : base(httpContext)
        {
            _dbContext = dbContext;
            mapper = _mapper;
        }

        public async Task<List<NetworkCompanyDto>> GetActiveNetworkCompanies()
        {
            var networkCompanies = await _dbContext.NetworkCompanies
                .Where(i => i.Active == true)
                .OrderBy(i => i.CompanyName)
                .ToListAsync();
            List<NetworkCompanyDto> allCompanies = mapper.Map<List<NetworkCompanyDto>>(networkCompanies);
            return allCompanies;
        }

        public async Task<List<NetworkCompanyDto>> GetAllNetworkCompanies()
        {
            var networkCompanies = await _dbContext.NetworkCompanies.OrderBy(i => i.CompanyName).ToListAsync();
            List<NetworkCompanyDto> companyNames = mapper.Map<List<NetworkCompanyDto>>(networkCompanies);
            return companyNames;
        }

        public List<string?> GetNetworkCompaniesNames()
        {
            List<string?> existingNetworkCompanies = _dbContext.NetworkCompanies.Select(c => c.CompanyName).ToList();
            return existingNetworkCompanies;
        }

        public bool IsPrimaryNetworkCompanyExists(NetworkCompanyDto updatedNetworkCompany)
        {
            bool isPrimaryExists = _dbContext.NetworkCompanies.Any(i => i.IsPrimary == true && i.NetworkCompanyId!=updatedNetworkCompany.NetworkCompanyId);
            return isPrimaryExists;
        }

        public async Task<bool> AddNetworkCompany(NetworkCompanyDto newNetworkCompany)
        {

            NetworkCompany networkCompany = new()
            {
                NetworkCompanyId = Guid.NewGuid(),
                CompanyName = newNetworkCompany.CompanyName,
                CompanyAddressLine1 = newNetworkCompany.CompanyAddressLine1,
                CompanyAddressLine2 = newNetworkCompany.CompanyAddressLine2,
                City = newNetworkCompany.City,
                State = newNetworkCompany.State,
                Country = newNetworkCompany.Country,
                ContactNumber = newNetworkCompany.ContactNumber,
                IsPrimary = newNetworkCompany.IsPrimary,
                Active = true,
                CreatedBy = LoggedInUser,
                UpdatedBy = LoggedInUser,
                CreatedDate = DateTime.Now.ToUniversalTime(),
                UpdatedDate = DateTime.Now.ToUniversalTime()
            };

            _dbContext.NetworkCompanies.Add(networkCompany);

            return await _dbContext.SaveChangesAsync() > 0;
        }

        public NetworkCompanyDto GetExistingNetworkCompany(NetworkCompanyDto updatedNetworkCompany)
        {
            NetworkCompany existingNetworkCompanies = _dbContext.NetworkCompanies.FirstOrDefault(c => c.NetworkCompanyId == updatedNetworkCompany.NetworkCompanyId);
            NetworkCompanyDto company = mapper.Map<NetworkCompanyDto>(existingNetworkCompanies);

            return company;
        }

        public async Task<bool> UpdateNetworkCompany(NetworkCompanyDto updatedNetworkCompany)
        {
            NetworkCompany selectedCompany =  await _dbContext.NetworkCompanies.FirstOrDefaultAsync(c => c.NetworkCompanyId == updatedNetworkCompany.NetworkCompanyId);
            selectedCompany.CompanyName = updatedNetworkCompany.CompanyName;
            selectedCompany.CompanyAddressLine1 = updatedNetworkCompany.CompanyAddressLine1;
            selectedCompany.CompanyAddressLine2 = updatedNetworkCompany.CompanyAddressLine2;
            selectedCompany.City = updatedNetworkCompany.City;
            selectedCompany.State = updatedNetworkCompany.State;
            selectedCompany.Country = updatedNetworkCompany.Country;
            selectedCompany.ContactNumber = updatedNetworkCompany.ContactNumber;
            selectedCompany.IsPrimary = updatedNetworkCompany.IsPrimary;
            selectedCompany.Active = true;
            selectedCompany.UpdatedBy = LoggedInUser;
            selectedCompany.UpdatedDate = DateTime.Now.ToUniversalTime();

            _dbContext.NetworkCompanies.Update(selectedCompany);
            return await _dbContext.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteNetworkCompany(Guid networkCompanyId)
        {
            bool isReferred = await IsNetworkCompanyReferred(networkCompanyId);
            NetworkCompany company = await _dbContext.NetworkCompanies.FirstOrDefaultAsync(c => c.NetworkCompanyId == networkCompanyId);
            
            if(company == null)
            {
                return false;
            }

            if (isReferred)
            {
                company.Active = false;
                _dbContext.NetworkCompanies.Update(company);
            }
            else
            {
                _dbContext.NetworkCompanies.Remove(company);
            }

            return await _dbContext.SaveChangesAsync() > 0;

        }

        public async Task<bool> IsNetworkCompanyReferred(Guid networkCompanyId)
        {
            bool isReferred = await _dbContext.DashboardPreferences.AnyAsync(d => d.NetworkCompanyId.Equals(networkCompanyId)) ||
                await _dbContext.Inventories.AnyAsync(i => i.NetworkCompanyId.Equals(networkCompanyId)) ||
                await _dbContext.PurchaseOrderHeaders.AnyAsync(p => p.NetworkCompanyId.Equals(networkCompanyId)) ||
                await _dbContext.PurchaseRequests.AnyAsync(p => p.NetworkCompanyId.Equals(networkCompanyId)) ||
                await _dbContext.RequestForQuoteHeaders.AnyAsync(r => r.NetworkCompanyId.Equals(networkCompanyId));

            return isReferred;
        }
    }
}

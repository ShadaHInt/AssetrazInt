using AssetrazAccessors.Common;
using AssetrazContracts.AccessorContracts;
using AssetrazContracts.DTOs;
using AssetrazContracts.Enums;
using AssetrazDataProvider;
using AssetrazDataProvider.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace AssetrazAccessors
{
    public class DashboardPreferenceAccessor : AccessorCommon, IDashboardPreferenceAccessor
    {
        private AssetrazContext _dbContext;
        private readonly IMapper _mapper;
        public DashboardPreferenceAccessor(AssetrazContext dbContext, IMapper mapper, IHttpContextAccessor httpContext) : base(httpContext)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public async Task<List<AssetStatusDto>> GetAssetCountForDashboard(string? userEmail, bool isNotDeleting = true)
        {
            UserRoles itAdmin = UserRoles.ITAdmin;
            int roleId = (int)itAdmin;
            var user = await _dbContext.UserPrivilegesWithDefaults
                .FirstOrDefaultAsync(up => up.UserRoleId == roleId && up.UserEmailId == (userEmail != null ? userEmail : LoggedInUser));

            List<DashboardPreference> preferences = new List<DashboardPreference>();
            if (user != null)
            {
                preferences = await _dbContext.DashboardPreferences
                    .Include(p => p.NetworkCompany)
                    .Include(p => p.Category)
                    .Where(c => c.UserId == user.UserId && (!isNotDeleting || (isNotDeleting && c.IsDeleted != true)))
                    .OrderBy(c => c.CreatedDate)
                    .ToListAsync();
            }

            List<AssetStatusDto> dataForDashboard = new();

            foreach (var preference in preferences)
            {
                var assetStatusList = await _dbContext.Inventories
                    .Where(i => i.CategoryId == preference.CategoryId && i.NetworkCompanyId == preference.NetworkCompanyId)
                    .Select(i => i.AssetStatus)
                    .ToListAsync();

                AssetStatusDto assetStatusDto = new AssetStatusDto
                {
                    PreferenceId = preference.PreferenceId,
                    NetworkCompanyId = preference.NetworkCompanyId,
                    CategoryId = preference.CategoryId,
                    NetworkCompanyName = preference.NetworkCompany?.CompanyName ?? "",
                    CategoryName = preference.Category?.CategoryName ?? "",
                    Available = assetStatusList.Count(i => i == Enum.GetName(typeof(AssetStatus), 0)),
                    Issued = assetStatusList.Count(i => i == Enum.GetName(typeof(AssetStatus), 1)),
                    Returned = assetStatusList.Count(i => i == Enum.GetName(typeof(AssetStatus), 2))
                };

                dataForDashboard.Add(assetStatusDto);
            }
            return dataForDashboard;
        }
        public async Task<DashboardPreferenceDto?> CheckDashboardPreference(DashboardPreferenceDto newPreference)
        {
            UserRoles itAdmin = UserRoles.ITAdmin;
            int roleId = (int)itAdmin;
            var user = await _dbContext.UserPrivilegesWithDefaults
                .FirstOrDefaultAsync(up => up.UserRoleId == roleId && up.UserEmailId == LoggedInUser);

            if (user != null)
            {
                var preference = await _dbContext.DashboardPreferences
                    .Include(p => p.NetworkCompany)
                    .Include(p => p.Category)
                    .FirstOrDefaultAsync(c =>
                        c.UserId == user.UserId &&
                        c.NetworkCompanyId == newPreference.NetworkCompanyId &&
                        c.CategoryId == newPreference.CategoryId);

                if (preference != null)
                {
                    DashboardPreferenceDto existingPreference = new DashboardPreferenceDto
                    {
                        PreferenceId = preference.PreferenceId,
                        UserId = user.UserId,
                        NetworkCompanyId = preference.NetworkCompanyId,
                        CategoryId = preference.CategoryId,
                        IsDeleted= preference.IsDeleted,
                    };

                    return existingPreference;
                }
            }

            return null;
        }
        public async Task<bool> AddDashboardPreference(DashboardPreferenceDto newPreference)
        {
            UserRoles itAdmin = UserRoles.ITAdmin;
            int roleId = (int)itAdmin;
            var user = await _dbContext.UserPrivilegesWithDefaults
                .FirstOrDefaultAsync(up => up.UserRoleId == roleId && up.UserEmailId == LoggedInUser);

            DashboardPreference preference = new()
            {
                PreferenceId = Guid.NewGuid(),
                UserId = user!.UserId,
                NetworkCompanyId = newPreference.NetworkCompanyId,
                CategoryId = newPreference.CategoryId,
                CreatedBy = LoggedInUser,
                UpdatedBy = LoggedInUser,
                CreatedDate = DateTime.Now.ToUniversalTime(),
                UpdatedDate = DateTime.Now.ToUniversalTime()
            };
            try
            {
                _dbContext.DashboardPreferences.Add(preference);
            } catch(SqlException ex)
            {
                throw new Exception("sql exception");
            }

            return await _dbContext.SaveChangesAsync() > 0;
        }
        public async Task<bool> DeleteDashboardPreference(Guid preferenceId)
        {
            DashboardPreference selectedPreference = await _dbContext.DashboardPreferences.FirstOrDefaultAsync(p => p.PreferenceId == preferenceId);
            selectedPreference.UpdatedBy = LoggedInUser;
            selectedPreference.UpdatedDate = DateTime.Now.ToUniversalTime();
            selectedPreference.IsDeleted = true;
            _dbContext.DashboardPreferences.Update(selectedPreference);
            return await _dbContext.SaveChangesAsync() > 0;

        }

        public async Task<bool> UpdateDashboardPreference(DashboardPreferenceDto preference)
        {
            DashboardPreference selectedPreference = await _dbContext.DashboardPreferences.FirstOrDefaultAsync(p => p.PreferenceId == preference.PreferenceId);
            selectedPreference.UpdatedBy = LoggedInUser;
            selectedPreference.UpdatedDate = DateTime.Now.ToUniversalTime();
            selectedPreference.IsDeleted = false;
            _dbContext.DashboardPreferences.Update(selectedPreference);
            return await _dbContext.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteDashboardPreferences(List<Guid> preferenceIds)
        {
            var selectedPreferences = await _dbContext.DashboardPreferences
                .Where(p => preferenceIds.Contains(p.PreferenceId))
                .ToListAsync();

            _dbContext.DashboardPreferences.RemoveRange(selectedPreferences);
            return await _dbContext.SaveChangesAsync() > 0;
        }

    }
}

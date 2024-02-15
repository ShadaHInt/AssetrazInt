using AssetrazContracts.AccessorContracts;
using AssetrazContracts.Enums;
using AssetrazDataProvider;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Linq;
using System.Reflection;

namespace AssetrazAccessors
{
    public class UserAccessor : IUserAccessor
    {
        private readonly IMapper mapper;
        private AssetrazContext dbContext;
        public UserAccessor(AssetrazContext DbContext, IMapper Mapper)
        {
            dbContext = DbContext;
            mapper = Mapper;
        }
        public async Task<string[]> GetUserRoles(string email)
        {
            var userRole = await dbContext.UserPrivilegesWithDefaults
                         .Include(c => c.UserRole)
                         .Where(p => p.UserEmailId == email)
                         .Select(p => p.UserRole.RoleName).ToArrayAsync();

            return userRole;
        }

        public async Task<string[]> GetOpsAdminsEmails()
        {
            var roleName = GetRoleName(UserRoles.OpsAdmin);
            return await dbContext.UserPrivilegesWithDefaults
                 .Where(p => p.UserRole.RoleName.ToLower()
                 .Contains(roleName))
                 .Select(p => p.UserEmailId)
                 .ToArrayAsync();
        }

        public async Task<string[]> GetItAdminEnail()
        {
            var roleName = GetRoleName(UserRoles.ITAdmin);
            return await dbContext.UserPrivilegesWithDefaults
                 .Where(p => p.UserRole.RoleName.ToLower()
                 .Contains(roleName))
                 .Select(p => p.UserEmailId)
                 .ToArrayAsync();
        }

        public async Task<string[]> GetProcurementApproversEmail()
        {
            var roleName = GetRoleName(UserRoles.ProcurementApprover);
            return await dbContext.UserPrivilegesWithDefaults
                 .Where(p => p.UserRole.RoleName.ToLower()
                 .Contains(roleName))
                 .Select(p => p.UserEmailId)
                 .ToArrayAsync();
        }

        public async Task<string[]> GetAccountsAdminEmails()
        {
            var roleName = GetRoleName(UserRoles.AccountsAdmin);
            return await dbContext.UserPrivilegesWithDefaults
                 .Where(p => p.UserRole.RoleName.ToLower()
                 .Contains(roleName))
                 .Select(p => p.UserEmailId)
                 .ToArrayAsync();
        }
        private string GetRoleName(UserRoles role)
        {
            var memberInfo = typeof(UserRoles).GetMember(role.ToString());
            var attribute = memberInfo.FirstOrDefault()?.GetCustomAttribute<UserRoleInfoAttribute>();

            return attribute?.RoleName ?? role.ToString();
        }

    }
}

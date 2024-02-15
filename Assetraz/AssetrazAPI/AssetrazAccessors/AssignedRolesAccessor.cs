using AssetrazAccessors.Common;
using AssetrazContracts.AccessorContracts;
using AssetrazContracts.DTOs;
using AssetrazDataProvider;
using AssetrazDataProvider.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace AssetrazAccessors
{
    public class AssignedRolesAccessor : AccessorCommon, IAssignedRolesAccessor
    {
        private AssetrazContext dbContext;

        public AssignedRolesAccessor(AssetrazContext dbContext, IHttpContextAccessor httpAccessor) : base(httpAccessor)
        {
            this.dbContext = dbContext;
        }

        public async Task<List<AssignedRolesDto>> getAssignedRoles()
        {
            var assginedUserRoles = await dbContext.UserPrivilegesWithDefaults.Select((i) => new AssignedRolesDto
            {
                UserId = i.UserId,
                UserRoleId= i.UserRoleId,
                UserRole = i.UserRole.RoleName,
                UserEmailId= i.UserEmailId,
                UserName = i.UserName,
                IsDefaultRole = i.IsDefaultRole
            }).ToListAsync();
            return assginedUserRoles;
        }

        public async Task<List<AssignedRolesDto>> GetAssignedRolesForUser(bool isLoggedInUser = false, string ? userEmail = null)
        {
            var assginedUserRoleTemp = await dbContext.UserPrivilegesWithDefaults
          .Where(up => up.UserEmailId == "shadan@valorem.com").ToListAsync();
            var assginedUserRoles = await dbContext.UserPrivilegesWithDefaults
                .Where(up=> isLoggedInUser ? up.UserEmailId == LoggedInUser : up.UserEmailId == userEmail)
                .Select((i) => new AssignedRolesDto
                {
                    UserId = i.UserId,
                    UserRoleId = i.UserRoleId,
                    UserRole = i.UserRole.RoleName,
                    UserEmailId = i.UserEmailId,
                    UserName = i.UserName,
                    IsDefaultRole = i.IsDefaultRole
                })
                .OrderBy(up => up.UserRole)
                .ToListAsync();
            return assginedUserRoles!;
        }

        public async Task<List<UserRolesDto>> GetUserRoles()
        {
            var userRoles = await dbContext.UserRoles.Select(i=> new UserRolesDto
            {
                RoleId = i.RoleId, RoleName = i.RoleName,
            }).ToListAsync();
            return userRoles;
        }

        public async Task<bool> AssignRole(AssignRoleRequestDto assignRoleRequest)
        {
            var existingUserRoles = await GetAssignedRolesForUser(false,assignRoleRequest.UserEmailId!);
            if (existingUserRoles.Count > 0 && existingUserRoles.All(existingRole => assignRoleRequest.UserRoleIds!.Contains(existingRole.UserRoleId)))
            {
                return false; 
            }
            else
            {
                var rolesToAdd = assignRoleRequest.UserRoleIds!
                    .Where(roleId => existingUserRoles.All(existingRole => existingRole.UserRoleId != roleId))
                    .ToArray();
                assignRoleRequest.UserRoleIds = rolesToAdd;
                var userPrivileges = assignRoleRequest.UserRoleIds?.Select(roleId => new UserPrivilegesWithDefault
                {
                    UserId = Guid.NewGuid(),
                    UserRoleId = roleId,
                    UserEmailId = assignRoleRequest.UserEmailId!,
                    UserName = assignRoleRequest.UserName,
                    IsDefaultRole = roleId == assignRoleRequest.DefaultRoleId
                }).ToList();
            
                await dbContext.UserPrivilegesWithDefaults.AddRangeAsync(userPrivileges!);
                return await dbContext.SaveChangesAsync() > 0;
            }

        }

        public async Task<bool> MakeRoleDefault(int roleId, string userEmail, bool isDefault)
        {
            var userPrivilegesToRemove = await dbContext.UserPrivilegesWithDefaults
               .Where(up => up.UserEmailId == userEmail && up.UserRoleId == roleId)
               .FirstOrDefaultAsync();

            userPrivilegesToRemove!.IsDefaultRole = isDefault;
            return await dbContext.SaveChangesAsync() > 0;
        }

        public async Task<bool> RemoveRoles(List<Guid> userIdsToRemove)
        {
            var userPrivilegesToRemove = await dbContext.UserPrivilegesWithDefaults
               .Where(up => userIdsToRemove.Contains(up.UserId))
               .ToListAsync();

            dbContext.UserPrivilegesWithDefaults.RemoveRange(userPrivilegesToRemove);
            return await dbContext.SaveChangesAsync() > 0;
        }
    }
}

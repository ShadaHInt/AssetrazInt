using AssetrazContracts.AccessorContracts;
using AssetrazContracts.DTOs;
using AssetrazContracts.Enums;
using AssetrazContracts.ManagerContracts;

namespace AssetrazManagers
{
    public class AssignedRolesManager : IAssignedRolesManager
    {
        private IAssignedRolesAccessor assignedRolesAccessor;
        private IDashboardPreferenceAccessor dashboardPreferenceAccessor;
        public AssignedRolesManager(IAssignedRolesAccessor AssignedRolesAccessor, IDashboardPreferenceAccessor DashboardPreferenceAccessor) 
        {
            assignedRolesAccessor = AssignedRolesAccessor;
            dashboardPreferenceAccessor = DashboardPreferenceAccessor;
        }

        public async Task<List<AssignedRolesDto>> getAssignedRoles()
        {
            return await assignedRolesAccessor.getAssignedRoles();
        }

        public async Task<List<UserRolesDto>> getUserRoles()
        { 
            return await assignedRolesAccessor.GetUserRoles();
        }

        public async Task<List<AssignedRolesDto>> GetAssignedRolesForUser(bool isLoggedInUser)
        {
            return await assignedRolesAccessor.GetAssignedRolesForUser(isLoggedInUser,null);
        }

        public async Task<bool> AssignRole(AssignRoleRequestDto assignRoleRequest)
        {
            return await assignedRolesAccessor.AssignRole(assignRoleRequest);
        }

        public async Task<bool> EditAssignedRoles(AssignRoleRequestDto assignRoleRequest)
        {
            try
            {
                List<AssignedRolesDto> existingAssignedRoles = await assignedRolesAccessor.GetAssignedRolesForUser(false,assignRoleRequest.UserEmailId!);
                var existingRoles = existingAssignedRoles.Select(dto => dto.UserRoleId).ToHashSet();
                var defaultRole = existingAssignedRoles.FirstOrDefault(dto => dto.IsDefaultRole!.Value);

                List<int> rolesToAdd = assignRoleRequest.UserRoleIds!.Where(roleId => !existingRoles.Contains(roleId)).ToList();
                List<int> rolesToRemove = existingAssignedRoles
                    .Where(existingRole => !assignRoleRequest.UserRoleIds!.Contains(existingRole.UserRoleId))
                    .Select(existingRole => existingRole.UserRoleId)
                    .ToList();
                List<Guid> userIdsToRemove = existingAssignedRoles
                    .Where(existingRole => rolesToRemove.Contains(existingRole.UserRoleId))
                    .Select(existingRole => existingRole.UserId)
                    .ToList();

                if (defaultRole != null && defaultRole.UserRoleId != assignRoleRequest.DefaultRoleId && !rolesToAdd.Contains(assignRoleRequest.DefaultRoleId!.Value))
                {
                    await assignedRolesAccessor.MakeRoleDefault(assignRoleRequest.DefaultRoleId.Value, assignRoleRequest.UserEmailId!, true);
                    await assignedRolesAccessor.MakeRoleDefault(defaultRole.UserRoleId, assignRoleRequest.UserEmailId!, false);
                }

                if (rolesToAdd.Count > 0)
                {
                    if (defaultRole != null && defaultRole.UserRoleId != assignRoleRequest.DefaultRoleId)
                    {
                        await assignedRolesAccessor.MakeRoleDefault(defaultRole.UserRoleId, assignRoleRequest.UserEmailId!, false);
                    }
                    assignRoleRequest.UserRoleIds = rolesToAdd.ToArray();
                    await assignedRolesAccessor.AssignRole(assignRoleRequest);
                }

                if (rolesToRemove.Count > 0)
                {
                    UserRoles itAdmin = UserRoles.ITAdmin;
                    int roleId = (int)itAdmin;
                    if (rolesToRemove.Contains(roleId))
                    {
                        List<AssetStatusDto> dashboardPreferences = await dashboardPreferenceAccessor.GetAssetCountForDashboard(assignRoleRequest.UserEmailId, false);
                        if (dashboardPreferences.Count > 0)
                        {
                            List<Guid> preferenceIds = dashboardPreferences.Select(dto => dto.PreferenceId).ToList();
                            await dashboardPreferenceAccessor.DeleteDashboardPreferences(preferenceIds);
                        }
                    }
                    await assignedRolesAccessor.RemoveRoles(userIdsToRemove);
                }

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }

        }

        public async Task<bool> SetDefaultRole(int defaultRoleId, AssignedRolesDto newDefaultRole)
        {
            var userEmailId = newDefaultRole.UserEmailId;
            var result = await assignedRolesAccessor.MakeRoleDefault(newDefaultRole.UserRoleId, userEmailId!, true);
            if (result)
                return await assignedRolesAccessor.MakeRoleDefault(defaultRoleId, userEmailId!, false);
            else 
                return false;
        }

        public async Task<bool> RemoveRoles(string userEmail, bool confirmedDeletePreferences)
        {
            List<AssignedRolesDto> existingAssignedRoles = await assignedRolesAccessor.GetAssignedRolesForUser(false, userEmail);
            List<AssetStatusDto> dashboardPreferences = await dashboardPreferenceAccessor.GetAssetCountForDashboard(userEmail, false);
            if(dashboardPreferences.Count > 0)
            {
                List<Guid> preferenceIds = dashboardPreferences.Select(dto => dto.PreferenceId).ToList();
                await dashboardPreferenceAccessor.DeleteDashboardPreferences(preferenceIds);
            }
            List<Guid> userIdsToRemove = existingAssignedRoles
                   .Select(existingRole => existingRole.UserId)
                   .ToList();
            return await assignedRolesAccessor.RemoveRoles(userIdsToRemove);
        }
    }
}

using AssetrazContracts.DTOs;

namespace AssetrazContracts.ManagerContracts
{
    public interface IAssignedRolesManager
    {
        Task<List<AssignedRolesDto>> getAssignedRoles();
        Task<List<UserRolesDto>> getUserRoles();
        Task<List<AssignedRolesDto>> GetAssignedRolesForUser(bool isLoggedInUser);
        Task<bool> AssignRole(AssignRoleRequestDto assignRoleRequest);
        Task<bool> EditAssignedRoles(AssignRoleRequestDto assignRoleRequest);
        Task<bool> SetDefaultRole(int defaultRoleId, AssignedRolesDto newDefaultRole);
        Task<bool> RemoveRoles(string userEmail, bool confirmedDeletePreferences);
    }
}

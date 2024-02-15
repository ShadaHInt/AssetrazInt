using AssetrazContracts.DTOs;

namespace AssetrazContracts.AccessorContracts
{
    public interface IAssignedRolesAccessor
    {
        Task<List<AssignedRolesDto>> getAssignedRoles();
        Task<List<AssignedRolesDto>> GetAssignedRolesForUser(bool isLoggedInUser, string? userEmail);
        Task<List<UserRolesDto>> GetUserRoles();
        Task<bool> AssignRole(AssignRoleRequestDto assignRoleRequest);
        Task<bool> MakeRoleDefault(int roleId, string userEmail, bool isDefault);
        Task<bool> RemoveRoles(List<Guid> userIdsToRemove);
    }
}

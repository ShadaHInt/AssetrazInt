using AssetrazContracts.DTOs;
using AssetrazContracts.ManagerContracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AssetrazAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AssignedRolesController : ControllerBase
    {
        private IAssignedRolesManager assignedRolesManager;
        public AssignedRolesController(IAssignedRolesManager AssignedRolesManager)
        {
            assignedRolesManager = AssignedRolesManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetAssignedUserRoles()
        {
            return Ok(await assignedRolesManager.getAssignedRoles());
        }

        [HttpGet("users/assigned-roles")]
        public async Task<IActionResult> GetAssignedRolesForUser(bool isLoggedInUser)
        {
            return Ok(await assignedRolesManager.GetAssignedRolesForUser(isLoggedInUser));
        }

        [HttpGet("Roles")]
        public async Task<IActionResult> GetUserRoles()
        {
            return Ok(await assignedRolesManager.getUserRoles());
        }

        [HttpPost]
        public async Task<IActionResult> AssignRole(AssignRoleRequestDto assignRoleRequest)
        {
            return Ok(await assignedRolesManager.AssignRole(assignRoleRequest));
        }

        [HttpPut]
        public async Task<IActionResult> EditAssignedRoles(AssignRoleRequestDto assignRoleRequest)
        {
            return Ok(await assignedRolesManager.EditAssignedRoles(assignRoleRequest));
        }

        [HttpPut("{defaultRoleId}")]
        public async Task<IActionResult> SetDefaultRole(int defaultRoleId, AssignedRolesDto newDefaultRole)
        {
            return Ok(await assignedRolesManager.SetDefaultRole(defaultRoleId, newDefaultRole));
        }

        [HttpDelete]
        public async Task<IActionResult> RemoveRoles([FromBody] DeleteUserRoleRequestDto deleteRequest)
        {
            ArgumentNullException.ThrowIfNull(deleteRequest.UserEmail);
            return Ok(await assignedRolesManager.RemoveRoles(deleteRequest.UserEmail, deleteRequest.ConfirmedDeletePreferences));
        }
    }
}

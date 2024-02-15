using AssetrazContracts.ManagerContracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Web.Resource;

namespace AssetrazAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController: ControllerBase
    {
        private readonly IUserManager _userManager;

        public UserController(IUserManager userManager)
        {
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<ActionResult> GetUsers()
        {
            return Ok(await _userManager.GetEmployees());
        }

        [HttpGet("all-users")]
        public async Task<ActionResult> GetAllUsers()
        {
            return Ok(await _userManager.GetAllEmployees());
        }

        [HttpGet("getUserRoles")]
        public async Task<ActionResult> GetUserRoles(string email)
        {            
            return Ok(await _userManager.GetUserRoles(email));
        }
    }
}

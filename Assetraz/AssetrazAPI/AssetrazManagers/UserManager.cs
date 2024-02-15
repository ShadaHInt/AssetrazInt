using AssetrazContracts.AccessorContracts;
using AssetrazContracts.DTOs;
using AssetrazContracts.ManagerContracts;
using AssetrazAccessors.Common;
using Microsoft.AspNetCore.Http;
using AssetrazContracts.EngineContracts;

namespace AssetrazManagers
{
    public class UserManager : AccessorCommon, IUserManager
    {
        private IUserAccessor _userAccessor;
        private readonly IGraphApiEngine _graphApiEngine;

        public UserManager(IUserAccessor userAccessor, IHttpContextAccessor httpAccessor, IGraphApiEngine graphApiEngine) : base(httpAccessor)
        {
            _userAccessor = userAccessor;
            _graphApiEngine = graphApiEngine;
        }
        public async Task<List<ADUserDto>> GetEmployees()
        {
            return await _graphApiEngine.GetEmployees();
        }

        public async Task<List<ADUserDto>> GetAllEmployees()
        {
            return await _graphApiEngine.GetEmployees(true);
        }

        public async Task<string[]> GetUserRoles(string email)
        {
            return await _userAccessor.GetUserRoles(email);
        }

        public async Task<ADUserDto> GetManagerDetails()
        {
            return await _graphApiEngine.GetManagerDetails(LoggedInUser);
        }

        public async Task<ADUserDto> GetEmployeeDetails()
        {
            return await _graphApiEngine.GetEmployeeDetails(LoggedInUser);
        }

        public async Task<List<string>> GetEmployeesForSupervisor(string email)
        {
            return await _graphApiEngine.GetEmployeesForSupervisor(LoggedInUser);
        }
    }
}

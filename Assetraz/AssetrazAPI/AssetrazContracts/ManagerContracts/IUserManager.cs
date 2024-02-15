using AssetrazContracts.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssetrazContracts.ManagerContracts
{
    public interface IUserManager
    {
        Task<List<ADUserDto>> GetEmployees();
        Task<List<ADUserDto>> GetAllEmployees();
        Task<string[]> GetUserRoles(string email);
        Task<ADUserDto> GetManagerDetails();
        Task<ADUserDto> GetEmployeeDetails();
        Task<List<string>> GetEmployeesForSupervisor(string email);
    }
}

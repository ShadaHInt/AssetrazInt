using AssetrazContracts.DTOs;

namespace AssetrazContracts.EngineContracts
{
    public interface IGraphApiEngine
    {
        Task<List<ADUserDto>> GetEmployees(bool includeDisabledUsers = false);
        //Task<List<ADUserDto>> GetEmployees();

        Task<ADUserDto> GetManagerDetails(string email);
        Task<ADUserDto> GetEmployeeDetails(string email);
        Task<List<string>> GetEmployeesForSupervisor(string email);
    }
}

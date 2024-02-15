using AssetrazAPI.Common;
using AssetrazContracts.DTOs;
using AssetrazContracts.EngineContracts;
using AssetrazContracts.LoggerContracts;
using AutoMapper;
using Azure.Identity;
using Microsoft.Extensions.Options;
using Microsoft.Graph;

namespace AssetrazEngine
{
    public class GraphApiEngine : IGraphApiEngine
    {
        private readonly IMapper _mapper;
        private readonly ILogAnalytics _log;
        private readonly AzureAdOptions _azureAdOptions;

        public GraphApiEngine(IMapper mapper, IOptions<AzureAdOptions> azureAdOptions, ILogAnalytics logAnalytics)
        {
            _mapper = mapper;
            _log = logAnalytics;
            _azureAdOptions = azureAdOptions.Value;
        }

        private GraphServiceClient GetGraphClient()
        {
            ClientSecretCredential clientSecurityCredential = new ClientSecretCredential(_azureAdOptions.TenantId, _azureAdOptions.ClientId, _azureAdOptions.ClientSecret);
            return new GraphServiceClient(clientSecurityCredential);
        }

        public async Task<ADUserDto> GetEmployeeDetails(string email)
        {
            GraphServiceClient graphClient = GetGraphClient();
            ADUserDto employeeDetail = new ADUserDto();

            try
            {
                var employee = new DirectoryObject();
                var manager = new DirectoryObject();
                employee = await graphClient.Users[email].Request().Expand(e => e.Manager).GetAsync();
                manager = ((User)employee).Manager;
                employeeDetail.DisplayName = ((User)employee).DisplayName;
                employeeDetail.Mail = ((User)employee).Mail;
                employeeDetail.ManagerName = ((User)manager).DisplayName;
                employeeDetail.ManagerEmail = ((User)manager).Mail;
            }
            catch (Exception ex)
            {
                _log.Error($"Failed to fetch GetEmployeeDetails. Error: {ex.Message}");
            }

            return employeeDetail;
        }

        public async Task<List<ADUserDto>> GetEmployees(bool includeDisabledUsers=false)
        {
            GraphServiceClient graphClient = GetGraphClient();

            string filterString = "";

            if (includeDisabledUsers)
            {   filterString = $"City eq 'Kochi'";  }
            else { filterString = $"City eq 'Kochi' and accountEnabled eq true"; }

            var usersRequest = graphClient.Users
                                .Request()
                                .Filter(filterString)
                                .Expand("manager")
                                .Select("displayName,mail,companyName,jobTitle,department");

            var users = await usersRequest.GetAsync();

            List<ADUserDto> employees = new List<ADUserDto>();

            while (true)
            {
                IList<User> currentPageUsers = users.CurrentPage;
                employees.AddRange(_mapper.Map<List<ADUserDto>>(currentPageUsers));

                if (currentPageUsers.Count != 100) break;

                users = await users.NextPageRequest.GetAsync();
            }

            return employees.Where(e => e.Mail != null && e.DisplayName != null && !e.Mail.EndsWith("@reply.com")).OrderBy(e => e.DisplayName).ToList();
        }

        public async Task<List<string>> GetEmployeesForSupervisor(string email)
        {
            GraphServiceClient graphClient = GetGraphClient();
            List<string> employeeList = new List<string>();

            try
            {
                List<User> users = new List<User>();
                string filterString = $"City eq 'Kochi' and accountEnabled eq true";
                var allUsers = await graphClient.Users.Request().Filter(filterString).Expand(e => e.Manager).GetAsync();
                users.AddRange(allUsers.CurrentPage);

                // Fetch each page and add those results to the list
                while (allUsers.NextPageRequest != null)
                {
                    allUsers = await allUsers.NextPageRequest.GetAsync();
                    users.AddRange(allUsers.CurrentPage);
                }
                employeeList = users.Where(p => p.Manager != null && ((User)p.Manager).Mail == email).Select(p => p.Mail).ToList();
            }
            catch (Exception ex)
            {
                _log.Error($"Failed to fetch GetEmployeesForSupervisor. Error: {ex.Message}");
            }

            return employeeList;
        }

        public async Task<ADUserDto> GetManagerDetails(string email)
        {
            GraphServiceClient graphClient = GetGraphClient();
            ADUserDto managerData = new ADUserDto();

            try
            {
                var manager = new DirectoryObject();
                manager = await graphClient.Users[email].Manager.Request().GetAsync();
                managerData.DisplayName = ((User)manager).DisplayName;
                managerData.Mail = ((User)manager).Mail;
            }
            catch (Exception ex)
            {
                _log.Error($"Failed to fetch GetManager. Error: {ex.Message}");
            }

            return managerData;
        }
    }
}

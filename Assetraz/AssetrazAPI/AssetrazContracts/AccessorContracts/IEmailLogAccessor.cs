using AssetrazContracts.DTOs;

namespace AssetrazContracts.AccessorContracts
{
    public interface IEmailLogAccessor
    {
        Task<bool> AddEmailLog(EmailLogDto newEmailLog);
        Task<bool> AddEmailLog(string message, string toList, string ccList);
    }
}

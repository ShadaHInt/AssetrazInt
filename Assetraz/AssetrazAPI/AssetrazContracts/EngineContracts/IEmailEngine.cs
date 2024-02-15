using AssetrazContracts.DTOs;

namespace AssetrazContracts.EngineContracts
{
    public interface IEmailEngine
    {
        Task<bool> SendEmail(EmailDto sendEmailDto);
    }
}

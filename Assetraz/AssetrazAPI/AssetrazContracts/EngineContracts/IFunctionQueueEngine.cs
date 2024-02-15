using AssetrazContracts.DTOs;

namespace AssetrazContracts.EngineContracts
{
    public interface IFunctionQueueEngine
    {
        Task<bool> PushMessage(QueueMessageDto message);
    }
}

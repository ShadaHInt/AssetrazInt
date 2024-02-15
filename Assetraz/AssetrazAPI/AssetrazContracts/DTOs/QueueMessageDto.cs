using AssetrazContracts.Enums;

namespace AssetrazContracts.DTOs
{
    public class QueueMessageDto
    {
        public QueueProcess Process { get; set; }
        public Guid ProcessId { get; set; }
        public bool? isCc { get; set; }
    }
}

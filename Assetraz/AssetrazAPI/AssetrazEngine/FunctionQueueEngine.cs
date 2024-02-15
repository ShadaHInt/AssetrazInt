using AssetrazContracts.DTOs;
using AssetrazContracts.EngineContracts;
using AssetrazContracts.LoggerContracts;
using Azure.Storage.Queues;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System.Text;

namespace AssetrazEngine
{
    public class FunctionQueueEngine : IFunctionQueueEngine
    {
        private readonly IConfiguration _configuration;
        private readonly ILogAnalytics _logger;

        public FunctionQueueEngine(IConfiguration configuration, ILogAnalytics logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public QueueClient QueueClient()
        {
            string queueName = _configuration.GetSection("Queue:Name").Value;
            string queueConnectionString = _configuration.GetSection("NotifyAppString").Value;
            return new QueueClient(queueConnectionString, queueName);
        }

        public async Task<bool> PushMessage(QueueMessageDto message)
        {
            try
            {
                QueueClient queueClient = QueueClient();

                await queueClient.CreateIfNotExistsAsync();

                if (queueClient.Exists())
                {
                    var bytes = Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(message));
                    await queueClient.SendMessageAsync(Convert.ToBase64String(bytes));
                    return true;
                }
            } catch(Exception ex)
            {
                _logger.Error(ex.ToString());
            }
            return false;
        }
    }
}

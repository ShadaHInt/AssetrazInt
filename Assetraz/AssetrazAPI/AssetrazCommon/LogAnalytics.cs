using AssetrazContracts.LoggerContracts;
using Microsoft.Extensions.Logging;

namespace AssetrazCommon
{
    public class LogAnalytics : ILogAnalytics
    {

        private readonly ILogger<LogAnalytics> _logger;


        public LogAnalytics(ILogger<LogAnalytics> logger)
        {
            _logger = logger;
        }

        public void Debug(string message)
        {
            _logger.LogDebug(message);
        }

        public void Information(string message)
        {
            _logger.LogInformation(message);
        }

        public void Warning(string message)
        {
            _logger.LogWarning(message);
        }

        public void Error(string message)
        {
            _logger.LogError(message);
        }

        public void Critical(string message)
        {
            _logger.LogCritical(message);
        }

    }
}
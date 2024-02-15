using AssetrazContracts.AccessorContracts;
using AssetrazContracts.DTOs;
using AssetrazContracts.ManagerContracts;
using Microsoft.Azure.WebJobs;
using Newtonsoft.Json;
using System;
using System.Threading.Tasks;
using QueueProcess = AssetrazContracts.Enums.QueueProcess;

namespace AssetrazFunction
{
    public class Notifier
    {
        private readonly INotifierFunctionManager _notifierFunctionManager;
        private readonly IEmailLogAccessor _emailLogAccessor;

        public Notifier(INotifierFunctionManager notifierFunctionManager
            , IEmailLogAccessor emailLogAccessor)
        {
            _notifierFunctionManager = notifierFunctionManager;
            _emailLogAccessor = emailLogAccessor;
        }

        [FunctionName("sendNotification")]
        public async Task Run([QueueTrigger("requestdetails", Connection = "StorageConnection")] string myQueueItem)
        {
            var message = JsonConvert.DeserializeObject<QueueMessageDto>(myQueueItem);

            switch (message.Process)
            {
                case QueueProcess.PurchaseOrder:
                    await _emailLogAccessor.AddEmailLog($"Generate PO Send Email - Start : {message.ProcessId}", "", "");

                    await _notifierFunctionManager.GeneratePOSendEmail(message.ProcessId);

                    await _emailLogAccessor.AddEmailLog($"Generate PO Send Email - End : {message.ProcessId}", "", "");
                    break;
                case QueueProcess.RequestForQuote:
                    await _emailLogAccessor.AddEmailLog($"Generate Quote Send Email - Start : {message.ProcessId}", "", "");

                    await _notifierFunctionManager.GenerateQuoteSendEmail(message.ProcessId, message.isCc);

                    await _emailLogAccessor.AddEmailLog($"Generate Quote Send Email - End : {message.ProcessId}", "", "");
                    break;
                case QueueProcess.RequestForApproval:
                    var environmentName = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
                    if (String.IsNullOrEmpty(environmentName) || environmentName == "Development")
                        environmentName = "dev";

                    await _emailLogAccessor.AddEmailLog($"Notify Approver - Start : {message.ProcessId}", "", "");

                    await _notifierFunctionManager.NotifyApprover(message.ProcessId, environmentName);

                    await _emailLogAccessor.AddEmailLog($"Notify Approver - End : {message.ProcessId}", "", "");
                    break;
                case QueueProcess.AccountsTeamNotification:
                    await _emailLogAccessor.AddEmailLog($"Payment Notification - Start : {message.ProcessId}", "", "");

                    await _notifierFunctionManager.PurchaseOrderPayementEmailNotification(message.ProcessId);

                    await _emailLogAccessor.AddEmailLog($"Payment Notification - End : {message.ProcessId}", "", "");
                    break;

            }
        }
    }
}

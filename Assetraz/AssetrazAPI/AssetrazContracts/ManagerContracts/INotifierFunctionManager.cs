namespace AssetrazContracts.ManagerContracts
{
    public interface INotifierFunctionManager
    {
        Task<bool> GeneratePOSendEmail(Guid purchaseOrderRequestId);
        Task PurchaseOrderPayementEmailNotification(Guid purchaseOrderRequestId);
        Task<bool> GenerateQuoteSendEmail(Guid procurementRequestId, bool? isItAdminsCc);
        Task NotifyApprover(Guid procurementRequestId, string env);
    }
}

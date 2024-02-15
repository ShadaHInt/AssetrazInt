using AssetrazContracts.DTOs;

namespace AssetrazContracts.ManagerContracts
{
    public interface IInvoiceManager
    {
        Task<List<PurchaseInvoiceDto>> GetInvoicesHandedOver();
        Task<(Stream, string, string)> DownloadInvoice(Guid invoiceId);
        Task<InvoiceDto> UploadInvoice(InvoiceDto invoiceDetails);
        Task<InvoiceDto?> UploadInvoiceForOldAssets(InvoiceRequestDto invoiceDetails);
        Task<bool> DeleteInvoice(Guid invoiceId);
        Task<PurchaseInvoiceDto> GetInvoiceDetailsUsingPurchaseOrder(Guid purchaseOrderRequestId);
    }
}

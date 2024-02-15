using AssetrazContracts.DTOs;

namespace AssetrazContracts.AccessorContracts
{
    public interface IInvoiceAccessor
    {
        Task<List<PurchaseInvoiceDto>> GetInvoicesHandedOver();
        Task<string> GetInvoiceFilePath(Guid invoiceId);
        Task<InvoiceDto> AddInvoiceDetails(InvoiceDto invoiceDetails);
        Task<IEnumerable<InvoiceDto>?> AddInvoiceDetails(IEnumerable<InvoiceDto> invoiceDetailsList);
        Task<bool> DeleteInvoiceDetails(Guid invoiceId);
        Task<PurchaseInvoiceDto> GetInvoiceDetailsUsingPurchaseOrder(Guid purchaseOrderRequestId);
    }
}

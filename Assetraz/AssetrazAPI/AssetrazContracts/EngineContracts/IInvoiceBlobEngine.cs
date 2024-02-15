using AssetrazContracts.DTOs;

namespace AssetrazContracts.EngineContracts
{
    public interface IInvoiceBlobEngine
    {
        Task<(Stream, string)> DownloadInvoice(string filePath);
        Task<InvoiceDto?> UploadInvoice(InvoiceDto invoiceDetails);

        Task<InvoiceRequestDto?> UploadInvoiceForOtherSource(InvoiceRequestDto invoiceDetails);
        Task<bool> DeleteInvoice(string filePath);
    }
}

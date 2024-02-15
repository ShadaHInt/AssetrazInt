namespace AssetrazContracts.DTOs
{
    public class PurchaseInvoiceDto
    {
        public Guid? PurchaseOrderRequestId { get; set; }
        public string? PurchaseOrderNumber { get; set; }
        public DateTime? RequestRaisedOn { get; set; }
        public string? InvoiceNumber { get; set; }
        public Guid? InvoiceId { get; set; }
        public string? InvoiceFilePath { get; set; }
        public string? InvoiceFileName
        {
            get
            {
                return InvoiceFilePath != null ? InvoiceFilePath.Split("/").LastOrDefault() : String.Empty;
            }
        }
        public bool IsAssetAddedToInventory { get; set; }
        public DateTime? InvoiceDate { get; set; }
        public string? UpdatedBy { get; set; }
        public string? InvoiceUploadedBy { get; set; }
        public string VendorName { get; set; }
        public Guid VendorId { get; set; }
        public List<string> CategoryList { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string? Status { get; set; }
        public string? NetworkCompanyName { get; set; }
    }
}

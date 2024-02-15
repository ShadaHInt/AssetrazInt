namespace AssetrazContracts.DTOs
{
    public class PurchaseOrderDto
    {
        public Guid? PurchaseOrderRequestId { get; set; }
        public string? PurchaseOrderNumber { get; set; }
        public Guid NetworkCompanyId { get; set; }
        public string? NetworkCompanyName { get; set; }
        public DateTime? RequestRaisedOn { get; set; }
        public Guid? ProcurementVendorId { get; set; }
        public string? RequestRaisedBy { get; set; }
        public string? Comments { get; set; }
        public string? Notes { get; set; }
        public Guid? VendorId { get; set; }
        public Guid ProcurementRequestId { get; set; }
        public string? QuoteFilePath { get; set; }
        public string? InvoiceFilePath { get; set; }
        public bool? IsHandedOver { get; set; }
        public string? QuoteFileName
        {
            get
            {
                return QuoteFilePath != null ? QuoteFilePath.Split("/").LastOrDefault() : String.Empty;
            }
        }
        public string? InvoiceFileName
        {
            get
            {
                return InvoiceFilePath != null ? InvoiceFilePath.Split("/").LastOrDefault() : String.Empty;
            }
        }
        public string RequestNumber { get; set; }
        public string VendorName { get; set; }
        public DateTime? QuoteReceivedOn { get; set; }
        public List<string>? VendorList { get; set; }
        public string? ApprovedBy { get; set; }
        public DateTime? ApprovedOn { get; set; }
        public Guid? InvoiceId { get; set; }
        public string? InvoiceNumber { get; set; }
        public DateTime? InvoiceDate { get; set; }

        public DateTime? PoDate { get; set; }

    }
}

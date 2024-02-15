namespace AssetrazContracts.DTOs
{
    public class RequestQuoteDto
    {
        public Guid ProcurementDetailsId { get; set; }
        public Guid? ProcurementVendorId { get; set; }
        public Guid ProcurementRequestId { get; set; }
        public Guid? VendorId { get; set; }
        public List<Guid>? VendorList { get; set; }
        public List<string>? CategoryList { get; set; }
        public List<string>? VendorNameList { get; set; }
        public string? VendorName { get; set; } = null!;
        public string? Notes { get; set; }
        public Guid CategoryId { get; set; }
        public string? CategoryName { get; set; }
        public Guid? ManfacturerId { get; set; }
        public string? ManufacturerName { get; set; }
        public string? ModelNumber { get; set; }
        public string Specifications { get; set; }
        public decimal Quantity { get; set; }
        public decimal? RatePerQuantity { get; set; } = 0;
        public string? QutoeFilePath { get; set; }
        public DateTime? QuoteReceivedOn { get; set; }
        public List<string>? QuoteReceivedOnList { get; set; }
        public string? QuoteUploadedBy { get; set; }
        public bool? IsShortListed { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string? CreatedBy { get; set; } = null!;
        public DateTime? UpdatedDate { get; set; }
        public string? UpdatedBy { get; set; } = null!;
        public string? RequestNumber { get; set; }
        public Guid NetworkCompanyId { get; set; }
        public string? NetworkCompany { get; set; }
        public DateTime? RequestRaisedOn { get; set; }
        public string? RequestRaisedBy { get; set; }
        public bool? ApprovalRequired { get; set; }
        public DateTime? ApprovedOn { get; set; }
        public string? ApprovedBy { get; set; }
        public string? Comments { get; set; }
        public string? Status { get; set; }
        public DateTime? POGeneratedOn { get; set; }
        public List<string>? POGeneratedOnList { get; set; }
        public List<RequestForQuoteParticipantDto>? Vendors { get; set; }
        public List<PurchaseOrderDto>? PurchaseOrders { get; set; }
        public List<string>? PurchaseOrderNumberList { get; set; }
    }
}

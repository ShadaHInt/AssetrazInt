namespace AssetrazContracts.DTOs
{
    public class AssetDetailsDto : AssetDto
    {
        public string? PurchaseOrderNumber { get; set; }
        public DateTime? RequestRaisedOn { get; set; }
        public string? InvoiceNumber { get; set; }
        public DateTime? InvoiceDate { get; set; }
        public string? EmployeeId { get; set; }
        public decimal Quantity { get; set; }
        public string? NetworkCompany { get; set; }
        public Guid? NetworkCompanyId { get; set; }

        public string? Vendor { get; set; }
        public string? WarrentyStatus
        {
            get
            {
                return WarrentyDate != null ? WarrentyDate > DateTime.Now.ToUniversalTime() ? "In warranty" : "Out of warranty" : String.Empty;
            }
        }
    }
}

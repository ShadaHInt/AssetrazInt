namespace AssetrazContracts.DTOs
{
    public class PurchaseOrderDetailsDto
    {
        public Guid CategoryId { get; set; }
        public Guid? PurchaseOrderRequestId { get; set; }
        public Guid? PurchaseOrderDetailsId { get; set; }
        public Guid VendorId { get; set; }
        public string? CategoryName { get; set; }
        public Guid ManufacturerId { get; set; }
        public string? ManufacturerName { get; set; }
        public string? ModelNumber { get; set; }
        public string? Specifications { get; set; } = null!;
        public decimal Quantity { get; set; }
        public decimal RatePerQuantity { get; set; }
        public decimal? QuantityReceived { get; set; }
        public string? PurchaseOrderNumber { get; set; }
        public DateTime? PogeneratedOn { get; set; }
        public string? ProcurementRequestNumber { get; set; } = null!;
        public DateTime? RequestRaisedOn { get; set; }
        public string? RequestRaisedBy { get; set; }
        public string? VendorName { get; set; } = null!;
        public string? InvoiceNumber { get; set; }
        public decimal? TotalOrderValue { get; set; }
    }
}

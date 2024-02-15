namespace AssetrazContracts.DTOs
{
    public class RequestForQuoteDetailsDto
    {
        public Guid CategoryId { get; set; }
        public Guid ProcurementRequestId { get; set; }
        public Guid? ProcurementDetailsId { get; set; }
        public Guid VendorId { get; set; }
        public string? CategoryName { get; set; }
        public Guid? ManufacturerId { get; set; }
        public string? ManufacturerName { get; set; }
        public string? ModelNumber { get; set; }
        public string? Specifications { get; set; } = null!;
        public decimal Quantity { get; set; }
        public decimal RatePerQuantity { get; set; }
    }
}

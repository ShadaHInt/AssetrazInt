namespace AssetrazContracts.DTOs
{
    public class PurchaseOrderDetailsFunctionDto
    {
        public string PurchaseOrderNumber { get; set; }
        public Guid VendorID { get; set; }
        public DateTime? POGeneratedOn { get; set; }
        public string Specifications { get; set; }
        public decimal Quantity { get; set; }
        public decimal RatePerQuantity { get; set; }
    }
}

namespace AssetrazContracts.DTOs
{
    public class VendorDetailsDto
    {
        public Guid? VendorId { get; set; }
        public string VendorName { get; set; }
        public string VendorAddressLine1 { get; set; }
        public string VendorAddressLine2 { get; set; }
        public string Gstin { get; set; } = string.Empty;
        public string EmailAddress { get; set; } = null!;
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Country { get; set; }
        public bool PreferredVendor { get; set; }
        public string ContactPerson { get; set; } = string.Empty;
        public string ContactNumber { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
        public DateTime? UpdatedDate { get; set; }
        public string? UpdatedBy { get; set; } = string.Empty;
        public bool? Active { get; set; }
    }
}

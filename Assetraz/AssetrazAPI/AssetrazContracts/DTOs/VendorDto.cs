
namespace AssetrazContracts.DTOs
{
    public class VendorDto
    {
        public Guid VendorId { get; set; }
        public string VendorName { get; set; } = null!;
        public string VendorAddressLine1 { get; set; } = null!;
        public string? VendorAddressLine2 { get; set; }
        public string City { get; set; } = null!;
        public bool PreferredVendor { get; set; }
        public string ContactPerson { get; set; } = null!;
        public string ContactNumber { get; set; } = null!;
        public string EmailAddress { get; set; } = null!;
        public bool? Active { get; set; }
    }
}

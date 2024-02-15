using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssetrazContracts.DTOs
{
    public class AssetDto
    {
        public Guid? InventoryId { get; set; }
        public Guid? TrackId { get; set; }
        public Guid? PurchaseOrderRequestId { get; set; }
        public Guid CategoryId { get; set; }
        public string? CategoryName { get; set; }
        public Guid ManufacturerId { get; set; }
        public string? ManufacturerName { get; set; }
        public string? NetworkCompanyName { get; set; }
        public string? ModelNumber { get; set; }
        public string? Specifications { get; set; }
        public DateTime? WarrentyDate { get; set; }
        public string? SerialNumber { get; set; }
        public string? AssetTagNumber { get; set; }
        public bool Issuable { get; set; }
        public string IsIssuable { get { return Issuable ? "Yes" : "No"; } }
        public decimal AssetValue { get; set; }
        public bool InsuranceRequired { get; set; }
        public string? AssetStatus { get; set; }
        public string? userRequestNumber { get; set; }
        public string? IssuedTo { get; set; }
        public string? IssuedBy { get; set; }
        public string? EmailId { get; set; }
        public DateTime? IssuedDate { get; set; }
        public decimal Quantity { get; set; }
        public DateTime? ReturnDate { get; set; }
        public string? Reason { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssetrazContracts.DTOs
{
    public class RefurbishedAssetDto
    {
        public Guid? RefurbishAssetId { get; set; }
        public Guid? InventoryId { get; set; }
        public string CategoryName { get; set; } = null!;
        public string ManufacturerName { get; set; } = null!;
        public string? ModelNumber { get; set; }
        public DateTime? WarrentyDate { get; set; }
        public string? SerialNumber { get; set; }
        public string? AssetTagNumber { get; set; }
        public DateTime? ReturnDate { get; set; }
        public string ReturnedBy { get; set; } = null!;
        public string? Reason { get; set; }
        public string Status { get; set; } = null!;
        public DateTime? RefurbishedDate { get; set; }
        public bool Issuable { get; set; }
        public string? Remarks { get; set; }
        public bool AddToScrap { get; set; }
        public DateTime? ScrappedDate { get; set; }
        public string? NetworkCompanyName { get; set;}
        public bool? IsLatestEntry { get; set; }
        public string? IssuedBy { get; set; }
    }
}

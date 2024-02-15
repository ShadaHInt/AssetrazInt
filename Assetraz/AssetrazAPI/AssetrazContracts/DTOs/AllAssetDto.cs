using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssetrazContracts.DTOs
{
    public class AllAssetDto
    {
        public Guid InventoryId { get; set; }
        public Guid NetworkCompanyId { get; set; }
        public string NetworkCompanyName { get; set; } = string.Empty;
        public Guid CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public Guid ManufacturerId { get; set; }
        public string ManufacturerName { get; set; } = string.Empty;
        public string? SerialNumber { get; set; }
        public string? AssetTagNumber { get; set; }
        public string? ModelNumber { get; set; }
        public DateTime? WarrantyDate { get; set; }

    }
}

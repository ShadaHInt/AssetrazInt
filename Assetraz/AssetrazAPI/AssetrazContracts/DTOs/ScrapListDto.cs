using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssetrazContracts.DTOs
{
    public class ScrapListDto
    {
        public Guid ScrapAssetId { get; set; }
        public Guid InventoryId { get; set; }
        public Guid? RefurbishedAssetId { get; set; }
        public string CategoryName { get; set; }
        public string ManufacturerName { get; set; }
        public string ModelNumber { get; set; }
        public DateTime? WarrentyDate { get; set; }
        public string SerialNumber { get; set; }
        public string AssetTagNumber { get; set; }
        public DateTime ScrappedDate { get; set; }
        public string MarkedBy { get; set; }
        public string Status { get; set; }
        public string Remarks { get; set; }
        public string NetworkCompanyName { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime UpdatedDate {get; set;}
        public bool? RemovedFromScrap { get; set; }

    }
}

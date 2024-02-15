using System;
using System.Collections.Generic;

namespace AssetrazDataProvider.Entities
{
    public partial class ScrapList
    {
        public Guid ScrapAssetId { get; set; }
        public Guid InventoryId { get; set; }
        public Guid? RefurbishedAssetId { get; set; }
        public DateTime RefurbishedDate { get; set; }
        public string RefurbishedBy { get; set; } = null!;
        public string Status { get; set; } = null!;
        public bool? RemovedFromScrap { get; set; }
        public DateTime? ScrappedDate { get; set; }
        public string? Remarks { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; } = null!;
        public DateTime? UpdatedDate { get; set; }
        public string? UpdatedBy { get; set; }

        public virtual Inventory Inventory { get; set; } = null!;
    }
}

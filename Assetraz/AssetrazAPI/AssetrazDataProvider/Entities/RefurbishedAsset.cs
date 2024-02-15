using System;
using System.Collections.Generic;

namespace AssetrazDataProvider.Entities
{
    public partial class RefurbishedAsset
    {
        public Guid RefurbishAssetId { get; set; }
        public Guid InventoryId { get; set; }
        public DateTime ReturnedDate { get; set; }
        public DateTime? RefurbishedDate { get; set; }
        public string? RefurbishedBy { get; set; }
        public string Status { get; set; } = null!;
        public string? Reason { get; set; }
        public string? ReturnedBy { get; set; }
        public string? Remarks { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; } = null!;
        public DateTime? UpdatedDate { get; set; }
        public string? UpdatedBy { get; set; }

        public virtual Inventory Inventory { get; set; } = null!;
    }
}

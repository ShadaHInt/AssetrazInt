using System;
using System.Collections.Generic;

namespace AssetrazDataProvider.Entities
{
    public partial class Inventory
    {
        public Inventory()
        {
            InsuranceItems = new HashSet<InsuranceItem>();
            InventoryTrackRegisters = new HashSet<InventoryTrackRegister>();
            MaintenanceRequests = new HashSet<MaintenanceRequest>();
            RefurbishedAssets = new HashSet<RefurbishedAsset>();
            ScrapLists = new HashSet<ScrapList>();
        }

        public Guid InventoryId { get; set; }
        public Guid? PurchaseOrderRequestId { get; set; }
        public Guid? NetworkCompanyId { get; set; }
        public Guid? InventoryOtherSourceId { get; set; }
        public Guid CategoryId { get; set; }
        public Guid ManufacturerId { get; set; }
        public string? ModelNumber { get; set; }
        public string? Specifications { get; set; }
        public DateTime? WarrentyDate { get; set; }
        public string? SerialNumber { get; set; }
        public string? AssetTagNumber { get; set; }
        public bool Issuable { get; set; }
        public bool? CutOverStock { get; set; }
        public decimal AssetValue { get; set; }
        public bool InsuranceRequired { get; set; }
        public string AssetStatus { get; set; } = null!;
        public string? Remarks { get; set; }
        public string? UserRequestNumber { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; } = null!;
        public DateTime UpdatedDate { get; set; }
        public string UpdatedBy { get; set; } = null!;

        public virtual Category Category { get; set; } = null!;
        public virtual Manufacturer Manufacturer { get; set; } = null!;
        public virtual PurchaseOrderHeader? PurchaseOrderRequest { get; set; }
        public virtual ICollection<InsuranceItem> InsuranceItems { get; set; }
        public virtual ICollection<InventoryTrackRegister> InventoryTrackRegisters { get; set; }
        public virtual ICollection<MaintenanceRequest> MaintenanceRequests { get; set; }
        public virtual ICollection<RefurbishedAsset> RefurbishedAssets { get; set; }
        public virtual ICollection<ScrapList> ScrapLists { get; set; }
    }
}

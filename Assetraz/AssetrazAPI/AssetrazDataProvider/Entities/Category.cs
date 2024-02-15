using System;
using System.Collections.Generic;

namespace AssetrazDataProvider.Entities
{
    public partial class Category
    {
        public Category()
        {
            CategoriesManufacturers = new HashSet<CategoriesManufacturer>();
            DashboardPreferences = new HashSet<DashboardPreference>();
            Inventories = new HashSet<Inventory>();
            PurchaseOrderDetails = new HashSet<PurchaseOrderDetail>();
            PurchaseRequests = new HashSet<PurchaseRequest>();
            ReOrderLevels = new HashSet<ReOrderLevel>();
            RequestForQuoteDetails = new HashSet<RequestForQuoteDetail>();
            VendorsCategories = new HashSet<VendorsCategory>();
        }

        public Guid CategoryId { get; set; }
        public string CategoryName { get; set; } = null!;
        public string? UnitOfMeasurement { get; set; }
        public bool Active { get; set; }
        public bool? Issuable { get; set; }
        public bool? AssetTagRequired { get; set; }
        public bool? SerialNumberRequired { get; set; }
        public bool? WarrantyRequired { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; } = null!;
        public DateTime UpdatedDate { get; set; }
        public string UpdatedBy { get; set; } = null!;

        public virtual ICollection<CategoriesManufacturer> CategoriesManufacturers { get; set; }
        public virtual ICollection<DashboardPreference> DashboardPreferences { get; set; }
        public virtual ICollection<Inventory> Inventories { get; set; }
        public virtual ICollection<PurchaseOrderDetail> PurchaseOrderDetails { get; set; }
        public virtual ICollection<PurchaseRequest> PurchaseRequests { get; set; }
        public virtual ICollection<ReOrderLevel> ReOrderLevels { get; set; }
        public virtual ICollection<RequestForQuoteDetail> RequestForQuoteDetails { get; set; }
        public virtual ICollection<VendorsCategory> VendorsCategories { get; set; }
    }
}

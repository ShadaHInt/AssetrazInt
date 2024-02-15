using System;
using System.Collections.Generic;

namespace AssetrazDataProvider.Entities
{
    public partial class Manufacturer
    {
        public Manufacturer()
        {
            CategoriesManufacturers = new HashSet<CategoriesManufacturer>();
            Inventories = new HashSet<Inventory>();
            PurchaseOrderDetails = new HashSet<PurchaseOrderDetail>();
            RequestForQuoteDetails = new HashSet<RequestForQuoteDetail>();
        }

        public Guid ManfacturerId { get; set; }
        public string ManufacturerName { get; set; } = null!;
        public bool PreferredManufacturer { get; set; }
        public bool Active { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; } = null!;
        public DateTime UpdatedDate { get; set; }
        public string UpdatedBy { get; set; } = null!;

        public virtual ICollection<CategoriesManufacturer> CategoriesManufacturers { get; set; }
        public virtual ICollection<Inventory> Inventories { get; set; }
        public virtual ICollection<PurchaseOrderDetail> PurchaseOrderDetails { get; set; }
        public virtual ICollection<RequestForQuoteDetail> RequestForQuoteDetails { get; set; }
    }
}

using System;
using System.Collections.Generic;

namespace AssetrazDataProvider.Entities
{
    public partial class CategoriesManufacturer
    {
        public Guid CategroyId { get; set; }
        public Guid ManfacturerId { get; set; }
        public bool Active { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; } = null!;
        public DateTime UpdatedDate { get; set; }
        public string UpdatedBy { get; set; } = null!;

        public virtual Category Categroy { get; set; } = null!;
        public virtual Manufacturer Manfacturer { get; set; } = null!;
    }
}

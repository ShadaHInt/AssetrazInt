using System;
using System.Collections.Generic;

namespace AssetrazDataProvider.Entities
{
    public partial class VendorsCategory
    {
        public Guid VendorId { get; set; }
        public Guid CategoryId { get; set; }
        public bool Active { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; } = null!;
        public DateTime UpdatedDate { get; set; }
        public string UpdatedBy { get; set; } = null!;

        public virtual Category Category { get; set; } = null!;
        public virtual Vendor Vendor { get; set; } = null!;
    }
}

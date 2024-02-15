using System;
using System.Collections.Generic;

namespace AssetrazDataProvider.Entities
{
    public partial class RequestForQuoteDetail
    {
        public Guid ProcurementDetailsId { get; set; }
        public Guid ProcurementRequestId { get; set; }
        public Guid? VendorId { get; set; }
        public Guid CategoryId { get; set; }
        public Guid? ManufacturerId { get; set; }
        public string? ModelNumber { get; set; }
        public string Specifications { get; set; } = null!;
        public decimal Quantity { get; set; }
        public decimal RatePerQuantity { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; } = null!;
        public DateTime UpdatedDate { get; set; }
        public string UpdatedBy { get; set; } = null!;

        public virtual Category Category { get; set; } = null!;
        public virtual Manufacturer? Manufacturer { get; set; }
        public virtual RequestForQuoteHeader ProcurementRequest { get; set; } = null!;
        public virtual Vendor? Vendor { get; set; }
    }
}

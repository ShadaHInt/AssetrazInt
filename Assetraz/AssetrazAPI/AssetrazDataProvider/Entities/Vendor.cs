using System;
using System.Collections.Generic;

namespace AssetrazDataProvider.Entities
{
    public partial class Vendor
    {
        public Vendor()
        {
            PurchaseOrderHeaders = new HashSet<PurchaseOrderHeader>();
            RequestForQuoteDetails = new HashSet<RequestForQuoteDetail>();
            RequestForQuoteParticipants = new HashSet<RequestForQuoteParticipant>();
            VendorsCategories = new HashSet<VendorsCategory>();
        }

        public Guid VendorId { get; set; }
        public string VendorName { get; set; } = null!;
        public string VendorAddressLine1 { get; set; } = null!;
        public string? VendorAddressLine2 { get; set; }
        public string City { get; set; } = null!;
        public string State { get; set; } = null!;
        public string Country { get; set; } = null!;
        public string? Gstin { get; set; }
        public bool PreferredVendor { get; set; }
        public string ContactPerson { get; set; } = null!;
        public string ContactNumber { get; set; } = null!;
        public string EmailAddress { get; set; } = null!;
        public bool? Active { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; } = null!;
        public DateTime UpdatedDate { get; set; }
        public string UpdatedBy { get; set; } = null!;

        public virtual ICollection<PurchaseOrderHeader> PurchaseOrderHeaders { get; set; }
        public virtual ICollection<RequestForQuoteDetail> RequestForQuoteDetails { get; set; }
        public virtual ICollection<RequestForQuoteParticipant> RequestForQuoteParticipants { get; set; }
        public virtual ICollection<VendorsCategory> VendorsCategories { get; set; }
    }
}

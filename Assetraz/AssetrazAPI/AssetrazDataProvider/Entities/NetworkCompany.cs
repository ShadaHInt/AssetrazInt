using System;
using System.Collections.Generic;

namespace AssetrazDataProvider.Entities
{
    public partial class NetworkCompany
    {
        public NetworkCompany()
        {
            DashboardPreferences = new HashSet<DashboardPreference>();
            PurchaseOrderHeaders = new HashSet<PurchaseOrderHeader>();
            PurchaseRequests = new HashSet<PurchaseRequest>();
            ReOrderLevels = new HashSet<ReOrderLevel>();
            RequestForQuoteHeaders = new HashSet<RequestForQuoteHeader>();
        }

        public Guid NetworkCompanyId { get; set; }
        public string CompanyName { get; set; } = null!;
        public string CompanyAddressLine1 { get; set; } = null!;
        public string? CompanyAddressLine2 { get; set; }
        public string City { get; set; } = null!;
        public string State { get; set; } = null!;
        public string Country { get; set; } = null!;
        public string ContactNumber { get; set; } = null!;
        public bool? IsPrimary { get; set; }
        public bool? Active { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; } = null!;
        public DateTime UpdatedDate { get; set; }
        public string UpdatedBy { get; set; } = null!;

        public virtual ICollection<DashboardPreference> DashboardPreferences { get; set; }
        public virtual ICollection<PurchaseOrderHeader> PurchaseOrderHeaders { get; set; }
        public virtual ICollection<PurchaseRequest> PurchaseRequests { get; set; }
        public virtual ICollection<ReOrderLevel> ReOrderLevels { get; set; }
        public virtual ICollection<RequestForQuoteHeader> RequestForQuoteHeaders { get; set; }
    }
}

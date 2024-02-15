using System;
using System.Collections.Generic;

namespace AssetrazDataProvider.Entities
{
    public partial class PurchaseOrderHeader
    {
        public PurchaseOrderHeader()
        {
            Inventories = new HashSet<Inventory>();
            Invoices = new HashSet<Invoice>();
            PurchaseOrderDetails = new HashSet<PurchaseOrderDetail>();
        }

        public Guid PurchaseOrderRequestId { get; set; }
        public string? PurchaseOrderNumber { get; set; }
        public Guid NetworkCompanyId { get; set; }
        public DateTime? RequestRaisedOn { get; set; }
        public string? RequestRaisedBy { get; set; }
        public Guid VendorId { get; set; }
        public Guid ProcurementRequestId { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; } = null!;
        public DateTime UpdatedDate { get; set; }
        public string UpdatedBy { get; set; } = null!;
        public DateTime? PogeneratedOn { get; set; }

        public virtual NetworkCompany NetworkCompany { get; set; } = null!;
        public virtual RequestForQuoteHeader ProcurementRequest { get; set; } = null!;
        public virtual Vendor Vendor { get; set; } = null!;
        public virtual ICollection<Inventory> Inventories { get; set; }
        public virtual ICollection<Invoice> Invoices { get; set; }
        public virtual ICollection<PurchaseOrderDetail> PurchaseOrderDetails { get; set; }
    }
}

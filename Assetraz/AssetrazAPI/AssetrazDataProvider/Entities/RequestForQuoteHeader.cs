using System;
using System.Collections.Generic;

namespace AssetrazDataProvider.Entities
{
    public partial class RequestForQuoteHeader
    {
        public RequestForQuoteHeader()
        {
            PurchaseOrderHeaders = new HashSet<PurchaseOrderHeader>();
            RequestForQuoteDetails = new HashSet<RequestForQuoteDetail>();
            RequestForQuoteParticipants = new HashSet<RequestForQuoteParticipant>();
        }

        public Guid ProcurementRequestId { get; set; }
        public string ProcurementRequestNumber { get; set; } = null!;
        public Guid NetworkCompanyId { get; set; }
        public DateTime? RequestRaisedOn { get; set; }
        public string? RequestRaisedBy { get; set; }
        public bool ApprovalRequired { get; set; }
        public DateTime? ApprovedOn { get; set; }
        public string? ApprovedBy { get; set; }
        public string? Notes { get; set; }
        public string? Comments { get; set; }
        public string Status { get; set; } = null!;
        public bool Active { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; } = null!;
        public DateTime UpdatedDate { get; set; }
        public string UpdatedBy { get; set; } = null!;
        public string? AssociateName { get; set; }

        public virtual NetworkCompany NetworkCompany { get; set; } = null!;
        public virtual ICollection<PurchaseOrderHeader> PurchaseOrderHeaders { get; set; }
        public virtual ICollection<RequestForQuoteDetail> RequestForQuoteDetails { get; set; }
        public virtual ICollection<RequestForQuoteParticipant> RequestForQuoteParticipants { get; set; }
    }
}

using System;
using System.Collections.Generic;

namespace AssetrazDataProvider.Entities
{
    public partial class RequestForQuoteParticipant
    {
        public Guid ProcurementVendorId { get; set; }
        public Guid ProcurementRequestId { get; set; }
        public Guid VendorId { get; set; }
        public string? QutoeFilePath { get; set; }
        public DateTime? QuoteUploadedOn { get; set; }
        public string? QuoteUploadedBy { get; set; }
        public bool IsShortListed { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; } = null!;
        public DateTime UpdatedDate { get; set; }
        public string UpdatedBy { get; set; } = null!;

        public virtual RequestForQuoteHeader ProcurementRequest { get; set; } = null!;
        public virtual Vendor Vendor { get; set; } = null!;
    }
}

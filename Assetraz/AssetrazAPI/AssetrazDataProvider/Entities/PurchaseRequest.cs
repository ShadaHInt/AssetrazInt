using System;
using System.Collections.Generic;

namespace AssetrazDataProvider.Entities
{
    public partial class PurchaseRequest
    {
        public Guid RequestId { get; set; }
        public string PurchaseRequestNumber { get; set; } = null!;
        public Guid NetworkCompanyId { get; set; }
        public Guid? InventoryId { get; set; }
        public string Purpose { get; set; } = null!;
        public string Status { get; set; } = null!;
        public string? Comments { get; set; }
        public string? AdminComments { get; set; }
        public bool Active { get; set; }
        public DateTime SubmittedOn { get; set; }
        public string SubmittedBy { get; set; } = null!;
        public DateTime? ApprovedOn { get; set; }
        public string? ApprovedBy { get; set; }
        public DateTime? FullfilledOn { get; set; }
        public string? FullfilledBy { get; set; }
        public string? ItrequestNumber { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; } = null!;
        public DateTime UpdatedDate { get; set; }
        public string UpdatedBy { get; set; } = null!;
        public string? ApproverName { get; set; }
        public string? EmployeeName { get; set; }
        public string? Priority { get; set; }
        public Guid CategoryId { get; set; }

        public virtual Category Category { get; set; } = null!;
        public virtual NetworkCompany NetworkCompany { get; set; } = null!;
    }
}

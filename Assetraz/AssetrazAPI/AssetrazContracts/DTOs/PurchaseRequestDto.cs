using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssetrazContracts.DTOs
{
    public class PurchaseRequestDto
    {
        public Guid RequestId { get; set; }
        public string? PurchaseRequestNumber { get; set; } = null!;
        public Guid NetworkCompanyId { get; set; }
        public Guid? InventoryId { get; set; }
        public string? NetworkCompanyName { get; set; }  
        public string? Purpose { get; set; } = null!;
        public string? Status { get; set; } = null!;
        public string? Comments { get; set; }
        public string? AdminComments { get; set; }
        public bool Active { get; set; } = true;
        public DateTime SubmittedOn { get; set; }
        public string? SubmittedBy { get; set; }
        public DateTime? ApprovedOn { get; set; }
        public string? ApproverName { get; set; }
        public string? ApprovedBy { get; set; }
        public DateTime? FullfilledOn { get; set; }
        public string? FullfilledBy { get; set; }
        public string? ItrequestNumber { get; set; }
        public DateTime CreatedDate { get; set; }
        public string? CreatedBy { get; set; } = null!;
        public DateTime UpdatedDate { get; set; }
        public string? UpdatedBy { get; set; }
        public string? AssociateName { get; set; }
        public string Priority { get; set; } = string.Empty;
        public Guid CategoryId { get; set; }
        public string? CategoryName { get; set; }
    }
}

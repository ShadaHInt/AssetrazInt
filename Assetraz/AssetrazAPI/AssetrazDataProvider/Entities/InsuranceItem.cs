using System;
using System.Collections.Generic;

namespace AssetrazDataProvider.Entities
{
    public partial class InsuranceItem
    {
        public Guid InsuranceReferenceId { get; set; }
        public Guid InventoryId { get; set; }
        public Guid? ReferenceNumber { get; set; }
        public string? InsuranceOffice { get; set; }
        public string? PolicyNumber { get; set; }
        public DateTime? PolicyStartDate { get; set; }
        public DateTime? PolicyEndDate { get; set; }
        public string? PolicyFilePath { get; set; }
        public string? InsuredBy { get; set; }
        public DateTime? RequestRaisedOn { get; set; }
        public string Status { get; set; } = null!;
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; } = null!;
        public DateTime UpdatedDate { get; set; }
        public string UpdatedBy { get; set; } = null!;

        public virtual Inventory Inventory { get; set; } = null!;
    }
}

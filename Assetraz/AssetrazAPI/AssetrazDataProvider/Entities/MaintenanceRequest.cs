using System;
using System.Collections.Generic;

namespace AssetrazDataProvider.Entities
{
    public partial class MaintenanceRequest
    {
        public Guid RequestId { get; set; }
        public string MaintenanceRequestNumber { get; set; } = null!;
        public Guid InventoryId { get; set; }
        public string Priority { get; set; } = null!;
        public string Status { get; set; } = null!;
        public string? SubStatus { get; set; }
        public string Description { get; set; } = null!;
        public string Address { get; set; } = null!;
        public string PhoneNumber { get; set; } = null!;
        public string? Remarks { get; set; }
        public DateTime SubmittedDate { get; set; }
        public string SubmittedBy { get; set; } = null!;
        public string EmployeeName { get; set; } = null!;
        public DateTime? ResolvedDate { get; set; }
        public DateTime? FaultyAssetSentDate { get; set; }
        public DateTime? FaultyAssetReceivedDate { get; set; }
        public DateTime? RepairedAssetReceivedDate { get; set; }
        public DateTime? ReplacementAssetReceivedDate { get; set; }
        public string? SupportCallTrackId { get; set; }
        public DateTime? SupportCallDate { get; set; }
        public DateTime? TargetDate { get; set; }
        public string? ReplacementAssetCourierProvider { get; set; }
        public DateTime? ReplacementAssetCourierSentDate { get; set; }
        public string? ReplacementAssetCourierReference { get; set; }
        public string? RepairedAssetCourierProvider { get; set; }
        public DateTime? RepairedAssetCourierSentDate { get; set; }
        public string? RepairedAssetCourierReference { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; } = null!;
        public DateTime UpdatedDate { get; set; }
        public string UpdatedBy { get; set; } = null!;

        public virtual Inventory Inventory { get; set; } = null!;
    }
}

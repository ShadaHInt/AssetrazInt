using System;
using System.Collections.Generic;

namespace AssetrazDataProvider.Entities
{
    public partial class InventoryTrackRegister
    {
        public Guid TrackId { get; set; }
        public Guid InventoryId { get; set; }
        public string? IssuedTo { get; set; }
        public string? EmailId { get; set; }
        public string? EmployeeId { get; set; }
        public DateTime? IssuedDate { get; set; }
        public string? Reason { get; set; }
        public DateTime? ReturnDate { get; set; }
        public string? Remarks { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; } = null!;
        public DateTime UpdatedDate { get; set; }
        public string UpdatedBy { get; set; } = null!;

        public virtual Inventory Inventory { get; set; } = null!;
    }
}

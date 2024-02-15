using System;
using System.Collections.Generic;

namespace AssetrazDataProvider.Entities
{
    public partial class InventoriesOtherSourcesHeader
    {
        public Guid InventoryOtherSourceId { get; set; }
        public Guid? SourceId { get; set; }
        public string DocumentId { get; set; } = null!;
        public string? DocumentNumber { get; set; }
        public string? SupportingDocumentFilePath { get; set; }
        public string? Notes { get; set; }
        public DateTime ReceivedDate { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; } = null!;
        public DateTime UpdatedDate { get; set; }
        public string UpdatedBy { get; set; } = null!;

        public virtual Source? Source { get; set; }
    }
}

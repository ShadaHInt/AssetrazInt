using System;
using System.Collections.Generic;

namespace AssetrazDataProvider.Entities
{
    public partial class Invoice
    {
        public Guid InvoiceId { get; set; }
        public Guid? PurchaseOrderRequestId { get; set; }
        public Guid? InventoryId { get; set; }
        public Guid? ReferenceNumber { get; set; }
        public string? InvoiceNumber { get; set; }
        public DateTime? InvoiceDate { get; set; }
        public string? InvoiceFilePath { get; set; }
        public DateTime? InvoiceUploadedOn { get; set; }
        public string? InvoiceUploadedBy { get; set; }
        public bool IsHandedOver { get; set; }
        public bool IsAssetAddedToInventory { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; } = null!;
        public DateTime UpdatedDate { get; set; }
        public string UpdatedBy { get; set; } = null!;

        public virtual PurchaseOrderHeader? PurchaseOrderRequest { get; set; }
    }
}

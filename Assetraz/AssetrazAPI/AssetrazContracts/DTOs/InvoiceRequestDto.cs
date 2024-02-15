using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssetrazContracts.DTOs
{
    public class InvoiceRequestDto
    {
        public Guid InvoiceId { get; set; }
        public Guid? PurchaseOrderRequestId { get; set; }
        public Guid?[] InventoryIds { get; set; }
        public string? InvoiceNumber { get; set; }
        public Guid? RefrenceNumber { get; set; }
        public DateTime? InvoiceDate { get; set; }
        public string? InvoiceFilePath { get; set; }
        public IFormFile? InvoiceFile { get; set; }
        public string? InvoiceFileName
        {
            get
            {
                return InvoiceFilePath != null ? InvoiceFilePath.Split("/").LastOrDefault() : String.Empty;
            }
        }
        public DateTime? InvoiceUploadedOn { get; set; }
        public string? InvoiceUploadedBy { get; set; }
        public bool IsHandedOver { get; set; }
        public bool IsAssetAddedToInventory { get; set; }

    }
}

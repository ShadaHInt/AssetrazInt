using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssetrazContracts.DTOs
{
    public class AssetRegisterDto
    {
        public Guid? InventoryId { get; set; }
        public string? ModelNumber { get; set; }
        public string? SerialNumber { get; set; }
        public string? AssetTagNumber { get; set; }
        public string? UserRequestNumber { get; set; }
        public Guid? NetworkCompanyId { get; set; }
        public string? NetworkCompanyName { get; set; }
        public string? CategoryName { get; set; }
        public string? ManufacturerName { get; set; }
        public Guid? InventoryOtherSourceId { get; set; }
        public string? DocumentID { get; set; }
        public string? DocumentNumber { get; set; }
        public string? SupportingDocumentFilePath { get; set; }
        public string? SupportingFileName
        {
            get
            {
                return SupportingDocumentFilePath != null ? SupportingDocumentFilePath.Split("/").LastOrDefault() : String.Empty;
            }
        }
        public Guid? InvoiceId { get; set; }    
        public string? InvoiceNumber { get; set; }
        public DateTime? InvoiceDate { get; set; }
        public string? InvoiceFilePath { get; set; }
        public string? InvoiceFileName
        {
            get
            {
                return InvoiceFilePath != null ? InvoiceFilePath.Split("/").LastOrDefault() : String.Empty;
            }
        }
        public Guid? PurchaseOrderRequestId { get; set; }
        public string? PurchaseOrderNumber { get; set; }
        public DateTime? POGeneratedOn { get; set; }

    }
}

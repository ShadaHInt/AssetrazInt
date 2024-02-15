using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssetrazContracts.DTOs
{
    public class OtherSourcesInventoryDto
    {
        public Guid? InventoryOtherSourceId { get; set; }
        public Guid? InventoryId { get; set; }
        public string? DocumentID { get; set; }
        public string? DocumentNumber { get; set; }
        public Guid NetworkCompanyId { get; set; }
        public string? NetworkCompanyName { get; set; }
        public DateTime ReceivedDate { get; set; }
        public Guid? SourceId { get; set; }
        public string? SourceName { get; set; }
        public List<string>? CategoryList { get; set; }
        public string? Notes { get; set; }
        public string? AssetStatus { get; set; }
        public Guid ManufacturerId { get; set; }
        public string? ManufacturerName { get; set; }
        public string? ModelNumber { get; set; }
        public DateTime? WarrantyDate { get; set; }
        public string? SerialNumber  { get; set; }
        public string? Specifications { get; set; }
        public string? AssetTagNumber { get; set; }
        public bool? Issuable { get;set; }
        public bool? CutOverStock { get; set; }
        public decimal AssetValue { get; set; }
        public Guid CategoryId { get; set; }
        public string? CategoryName { get; set; }
        public string? SupportingDocumentFilePath { get; set; }
        public string? FileName
        {
            get
            {
                return SupportingDocumentFilePath != null ? SupportingDocumentFilePath.Split("/").LastOrDefault() : String.Empty;
            }
        }
    }
}

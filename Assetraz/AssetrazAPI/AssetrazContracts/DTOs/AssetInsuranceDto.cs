using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssetrazContracts.DTOs
{
    public class AssetInsuranceDto
    {
        public Guid? InsuranceReferenceId { get; set; }
        public Guid? ReferenceNumber { get; set; }
        public string? PurchaseOrderNumber { get; set; }
        public string? InvoiceNumber { get; set; }
        public string? CategoryName { get; set; } 
        public string? ManufacturerName { get; set; }
        public string? NetworkCompanyName { get; set; }
        public string? ModelNumber { get; set; }
        public DateTime? WarrentyDate { get; set; }
        public string? SerialNumber { get; set; }
        public decimal? AssetValue { get; set; }
        public string? Status { get; set; } = null!;
        public DateTime? PogeneratedOn { get; set; }
        public DateTime? InvoiceDate { get; set; }
        public string? AssetTagNumber { get; set; }
        public decimal? Quantity { get; set; }
        public string? InsuranceOffice { get; set; }
        public string? PolicyNumber { get; set; }
        public DateTime? PolicyStartDate { get; set; }
        public DateTime? PolicyEndDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string? UpdatedBy { get; set; }
        public string? PolicyFilePath { get; set; }
        public string? PolicyFileName
        {
            get
            {
                return PolicyFilePath != null ? PolicyFilePath.Split("/").LastOrDefault() : String.Empty;
            }
        }

    }
}

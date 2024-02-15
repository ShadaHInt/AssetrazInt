using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssetrazContracts.DTOs
{
    public class NetworkCompanyDto
    {
        public Guid NetworkCompanyId { get; set; }
        public string? CompanyName { get; set; } = null!;
        public string? CompanyAddressLine1 { get; set; } = null!;
        public string? CompanyAddressLine2 { get; set; }
        public string? City { get; set; } = null!;
        public string? State { get; set; } = null!;
        public string? Country { get; set; } = null!;
        public string? ContactNumber { get; set; } = null!;
        public bool? IsPrimary { get; set; } = false;
        public DateTime? CreatedDate { get; set; }
        public string? CreatedBy { get; set; } = null!;
        public DateTime? UpdatedDate { get; set; }
        public string? UpdatedBy { get; set; } = null!;
        public bool? Active { get; set; }
    }
}
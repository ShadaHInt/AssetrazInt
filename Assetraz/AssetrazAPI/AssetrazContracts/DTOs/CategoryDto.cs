using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssetrazContracts.DTOs
{
    public class CategoryDto
    {
        public Guid CategoryId { get; set; }
        public string? CategoryName { get; set; } = null!;
        public string? UnitOfMeasurement { get; set; } = null!;
        public bool? Issuable { get; set; } = false;
        public string? CreatedBy { get; set; } = null!;
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string? UpdatedBy { get; set; } = null!;
        public bool? AssetTagRequired { get; set; } = false;
        public bool? SerialNumberRequired { get; set; } = false;
        public bool? WarrantyRequired { get; set; } = false;
        public bool Active { get; set; }
    }
}

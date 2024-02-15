using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssetrazContracts.DTOs
{
    public class MaintenanceRequestDto
    {
        public Guid? RequestId { get; set; }
        public Guid? InventoryId { get; set; }
        public string? MaintenanceRequestNumber { get; set; } 
        public string? CategoryName { get; set; }
        public string? AssetTagNumber { get; set; }
        public string? SerialNumber { get; set; }
        public string? ModelNumber { get; set; }
        public string? Status { get; set; } = null!;
        public DateTime? IssuedDate { get; set; }
        public DateTime? SubmittedDate { get; set; }
        public String? Priority { get; set; }
        public String? Description { get; set; }
        public String? Address { get; set; }
        public String? PhoneNumber { get; set; }
        public string? SubStatus { get; set; }
        public DateTime? ResolvedDate { get; set; }

    }
}

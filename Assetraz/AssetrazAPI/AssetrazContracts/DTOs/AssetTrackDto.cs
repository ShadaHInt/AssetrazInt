using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssetrazContracts.DTOs
{
    public class AssetTrackDto
    {
        public Guid InventoryId { get; set; }
        public string? IssuedTo { get; set; }
        public string? EmailId { get; set; }
        public string? userRequestNumber { get; set; }
        public string? Status { get; set; }
        public string? Reason { get; set; }
        public string? Remarks { get; set; }
        public DateTime? IssuedDate { get; set; }
        public DateTime? ReturnDate { get; set; }
        public DateTime? IssuedOrReturnedDate { get; set; }
        public string? ActivityStatus { get; set; }
        public string? UpdatedBy { get; set; } = null!;
        public string? AssetStatus { get; set; } = null!;
        public string? ModelNumber { get; set; }
        public string? CategoryName { get; set; } = null!;
        public string? SerialNumber { get; set; }
        public string? AssetTagNumber { get; set; }

    }
}

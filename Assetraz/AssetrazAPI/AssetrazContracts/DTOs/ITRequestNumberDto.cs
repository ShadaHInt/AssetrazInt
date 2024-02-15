using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssetrazContracts.DTOs
{
    public class ITRequestNumberDto
    {
        public Guid ProcurementRequestId { get; set; }
        public string ProcurementRequestNumber { get; set; } = null!;
    }
}

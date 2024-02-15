using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssetrazContracts.DTOs
{
    public class ReOrderLevelsDto
    {
        public Guid? ReOrderId { get; set; }
        public Guid CategoryId { get; set; }
        public string? CategoryName { get; set; }
        public Guid NetworkCompanyId { get; set; }
        public string? NetworkCompanyName { get; set; }
        public int ReOrderLevel { get; set; }
        public int CriticalLevel { get; set; }
        public int WarningLevel { get; set; }
        public int? Available { get; set; }
    }
}

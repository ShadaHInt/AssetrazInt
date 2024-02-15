using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssetrazContracts.DTOs
{
    public class AssetStatusDto
    {
        public Guid PreferenceId { get; set; }
        public Guid NetworkCompanyId { get; set; }
        public Guid CategoryId { get; set; }
        public string? NetworkCompanyName { get; set; }
        public string? CategoryName { get; set; }
        public decimal Available { get; set; }
        public decimal Issued { get; set; }
        public decimal Returned { get; set; }
    }
}

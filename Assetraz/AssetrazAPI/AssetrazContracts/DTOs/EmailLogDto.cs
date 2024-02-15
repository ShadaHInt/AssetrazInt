using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssetrazContracts.DTOs
{
    public class EmailLogDto
    {
        public Guid LogId { get; set; }
        public string Message { get; set; } = null!;
        public string? ToList { get; set; }
        public string? CcList { get; set; }
        public DateTime? CreatedOn { get; set; }
    }
}

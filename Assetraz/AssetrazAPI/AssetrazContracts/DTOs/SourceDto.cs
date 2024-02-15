using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssetrazContracts.DTOs
{
    public class SourceDto
    {
        public Guid SourceId { get; set; }
        public string SourceName { get; set; } = null!;
        public bool Active { get; set; }
    }
}

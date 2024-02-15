using System;
using System.Collections.Generic;

namespace AssetrazDataProvider.Entities
{
    public partial class EmailLog
    {
        public Guid LogId { get; set; }
        public string Message { get; set; } = null!;
        public string? ToList { get; set; }
        public string? CcList { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}

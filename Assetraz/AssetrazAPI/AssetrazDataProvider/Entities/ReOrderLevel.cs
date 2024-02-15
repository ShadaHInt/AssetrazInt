using System;
using System.Collections.Generic;

namespace AssetrazDataProvider.Entities
{
    public partial class ReOrderLevel
    {
        public Guid ReOrderId { get; set; }
        public Guid CategoryId { get; set; }
        public Guid NetworkCompanyId { get; set; }
        public int ReOrderLevel1 { get; set; }
        public int CriticalLevel { get; set; }
        public int WarningLevel { get; set; }

        public virtual Category Category { get; set; } = null!;
        public virtual NetworkCompany NetworkCompany { get; set; } = null!;
    }
}

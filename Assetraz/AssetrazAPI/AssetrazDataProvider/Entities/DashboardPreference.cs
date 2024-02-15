using System;
using System.Collections.Generic;

namespace AssetrazDataProvider.Entities
{
    public partial class DashboardPreference
    {
        public Guid PreferenceId { get; set; }
        public Guid UserId { get; set; }
        public Guid NetworkCompanyId { get; set; }
        public Guid CategoryId { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; } = null!;
        public DateTime UpdatedDate { get; set; }
        public string UpdatedBy { get; set; } = null!;
        public bool IsDeleted { get; set; }

        public virtual Category Category { get; set; } = null!;
        public virtual NetworkCompany NetworkCompany { get; set; } = null!;
        public virtual UserPrivilegesWithDefault User { get; set; } = null!;
    }
}

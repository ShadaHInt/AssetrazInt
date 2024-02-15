using System;
using System.Collections.Generic;

namespace AssetrazDataProvider.Entities
{
    public partial class UserPrivilegesWithDefault
    {
        public UserPrivilegesWithDefault()
        {
            DashboardPreferences = new HashSet<DashboardPreference>();
        }

        public Guid UserId { get; set; }
        public string? UserDomainId { get; set; }
        public string UserEmailId { get; set; } = null!;
        public string? UserName { get; set; }
        public int UserRoleId { get; set; }
        public bool IsDefaultRole { get; set; }

        public virtual UserRole UserRole { get; set; } = null!;
        public virtual ICollection<DashboardPreference> DashboardPreferences { get; set; }
    }
}

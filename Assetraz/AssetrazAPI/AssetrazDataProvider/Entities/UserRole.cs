using System;
using System.Collections.Generic;

namespace AssetrazDataProvider.Entities
{
    public partial class UserRole
    {
        public UserRole()
        {
            UserPrivilegesWithDefaults = new HashSet<UserPrivilegesWithDefault>();
        }

        public int RoleId { get; set; }
        public string RoleName { get; set; } = null!;
        public bool Active { get; set; }

        public virtual ICollection<UserPrivilegesWithDefault> UserPrivilegesWithDefaults { get; set; }
    }
}

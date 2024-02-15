namespace AssetrazContracts.Enums
{
    public class UserRoleInfoAttribute : Attribute
    {
        public string RoleName { get; }

        public UserRoleInfoAttribute(string roleName)
        {
            RoleName = roleName;
        }
    }
}
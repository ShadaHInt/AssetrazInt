
namespace AssetrazContracts.DTOs
{
    public class AssignedRolesDto
    {
        public Guid UserId { get; set; }
        public string? UserDomainId { get; set; }
        public string? UserEmailId { get; set; }
        public string? UserName { get; set; }
        public bool? IsDefaultRole { get; set; }
        public int UserRoleId { get; set; }
        public string? UserRole { get; set; }
    }
}

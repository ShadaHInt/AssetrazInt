namespace AssetrazContracts.DTOs
{
    public class AssignRoleRequestDto
    {
        public Guid? UserId { get; set; }
        public string? UserEmailId { get; set; }
        public string? UserName { get; set; }
        public int[]? UserRoleIds { get; set; }
        public int? DefaultRoleId { get; set; }
    }
}

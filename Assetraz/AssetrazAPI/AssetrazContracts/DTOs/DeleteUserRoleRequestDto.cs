
namespace AssetrazContracts.DTOs
{
    public class DeleteUserRoleRequestDto
    {
        public string? UserEmail { get; set; }
        public bool ConfirmedDeletePreferences {  get; set; }
    }
}

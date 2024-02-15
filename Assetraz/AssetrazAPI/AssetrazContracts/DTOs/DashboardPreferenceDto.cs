
namespace AssetrazContracts.DTOs
{
    public class DashboardPreferenceDto
    {
        public Guid? PreferenceId { get; set; }
        public Guid? UserId { get; set; }
        public Guid NetworkCompanyId { get; set; }
        public Guid CategoryId { get; set; }
        public bool? IsDeleted {  get; set; }

    }
}

namespace AssetrazContracts.AccessorContracts
{
    public interface IUserAccessor
    {
        Task<string[]> GetUserRoles(string email);
        Task<string[]> GetOpsAdminsEmails();
        Task<string[]> GetItAdminEnail();
        Task<string[]> GetProcurementApproversEmail();
        Task<string[]> GetAccountsAdminEmails();
    }
}

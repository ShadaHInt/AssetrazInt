
namespace AssetrazContracts.Enums
{
    public enum UserRoles
    {
        [UserRoleInfo("IT Administrator")]
        ITAdmin = 1,
        [UserRoleInfo("Operations Executive")]
        OpsAdmin = 2,
        [UserRoleInfo("Supervisor")]
        Supervisor = 3,
        [UserRoleInfo("IT Procurement Approver")]
        ProcurementApprover = 4,
        [UserRoleInfo("Accounts Executive")]
        AccountsAdmin = 5,
        [UserRoleInfo("IT Admin - Manager")]
        ITAdminManager = 6,
        [UserRoleInfo("Administrator")]
        Administrator = 1,
    }
}

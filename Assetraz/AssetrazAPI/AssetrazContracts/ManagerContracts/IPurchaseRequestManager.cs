using AssetrazContracts.DTOs;

namespace AssetrazContracts.ManagerContracts
{
    public interface IPurchaseRequestManager
    {
        Task<List<PurchaseRequestDto>> GetPurchaseRequests();
        Task<List<PurchaseRequestDto>> GetUserRequestsByApproverId();
        bool NewAssetRequest(PurchaseRequestDto requestDto, ADUserDto employeeDetails);
        Task<bool> UpdateAssetRequest(PurchaseRequestDto requestDto, string requestNumber, ADUserDto manager);
        Task<bool> DeleteAssetRequest(string requestNumber);
        Task<bool> ReviewAssetRequest(string requestNumber, bool review, PurchaseRequestDto requestDto);
        Task<List<PurchaseRequestDto>> ApprovedUserRequests();
        Task<PurchaseRequestDto?> GetPurchaseRequestsForIRQ(string PurchaseRequestNumber);
    }
}

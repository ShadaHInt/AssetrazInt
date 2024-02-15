using AssetrazContracts.AccessorContracts;
using AssetrazContracts.DTOs;
using AssetrazContracts.ManagerContracts;

namespace AssetrazManagers
{
    public class PurchaseRequestManager : IPurchaseRequestManager
    {
        private IPurchaseRequestAccessor requestAccessor;
        public PurchaseRequestManager(IPurchaseRequestAccessor RequestAccessor)
        {
            requestAccessor = RequestAccessor;
        }

        public async Task<List<PurchaseRequestDto>> GetPurchaseRequests()
        {
            return await requestAccessor.GetPurchaseRequests();
        }

        public bool NewAssetRequest(PurchaseRequestDto requestDto, ADUserDto employeeDetails)
        {
            if ((requestDto.Priority == null) || (requestDto.CategoryId == null) || (requestDto.Purpose == null))
            {
                throw new ArgumentNullException("priority, category and purpose is required");
            }
            else
            {
                return requestAccessor.NewAssetRequest(requestDto, employeeDetails);
            }
        }

        public async Task<bool> UpdateAssetRequest(PurchaseRequestDto requestDto, string requestNumber, ADUserDto manager)
        {
            if ((requestDto.Priority == null) || (requestDto.CategoryId == null) || (requestDto.Purpose == null))
            {
                throw new ArgumentNullException("priority, category and purpose is required");
            }
            else
            {
                return await requestAccessor.UpdateAssetRequest(requestDto, requestNumber, manager);
            }
        }

        public async Task<bool> DeleteAssetRequest(string requestNumber)
        {
            return await requestAccessor.DeleteAssetRequest(requestNumber);
        }

        public async Task<bool> ReviewAssetRequest(string requestNumber, bool review, PurchaseRequestDto requestDto)
        {
            if ((requestDto.Priority == null) || (requestDto.Comments == null))
            {
                throw new ArgumentNullException("Priority and comments are required");
            }
            else
            {
                return await requestAccessor.ReviewAssetRequest(requestNumber, review, requestDto);
            }
        }

        public async Task<List<PurchaseRequestDto>> GetUserRequestsByApproverId()
        {
            return await requestAccessor.GetUserRequestsByApproverId();
        }

        public async Task<List<PurchaseRequestDto>> ApprovedUserRequests()
        {
            return await requestAccessor.ApprovedUserRequests();
        }

        public async Task<PurchaseRequestDto?> GetPurchaseRequestsForIRQ(string PurchaseRequestNumber)
        {
            return await requestAccessor.GetPurchaseRequestsForIRQ(PurchaseRequestNumber);
        }
    }
}

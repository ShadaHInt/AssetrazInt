using AssetrazAccessors.Common;
using AssetrazContracts.AccessorContracts;
using AssetrazContracts.DTOs;
using AssetrazContracts.Enums;
using AssetrazContracts.LoggerContracts;
using AssetrazDataProvider;
using AssetrazDataProvider.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace AssetrazAccessors
{
    public class PurchaseRequestAccessor : AccessorCommon, IPurchaseRequestAccessor
    {
        private readonly IMapper mapper;
        private AssetrazContext dbContext;
        private readonly ILogAnalytics _log;

        public PurchaseRequestAccessor(AssetrazContext DbContext, IMapper Mapper, IHttpContextAccessor httpAccessor, ILogAnalytics log) : base(httpAccessor)
        {
            dbContext = DbContext;
            mapper = Mapper;
            _log = log;
        }

        public async Task<List<PurchaseRequestDto>> GetPurchaseRequests()
        {
            var requests = await (from p in dbContext.PurchaseRequests
                .Include(c => c.Category)
                .Where(p => p.SubmittedBy.ToLower() == LoggedInUser)
                                  select new PurchaseRequestDto
                                  {
                                      PurchaseRequestNumber = p.PurchaseRequestNumber,
                                      CategoryName = p.Category.CategoryName,
                                      NetworkCompanyId = p.NetworkCompanyId,
                                      NetworkCompanyName = p.NetworkCompany.CompanyName,
                                      ApproverName = p.ApproverName,
                                      Status = p.Status,
                                      Purpose = p.Purpose,
                                      Priority = p.Priority,
                                      CategoryId = p.CategoryId,
                                      Comments = p.Comments,
                                  })
                .OrderByDescending(p => p.PurchaseRequestNumber).ToListAsync();

            return requests;
        }

        public async Task<List<PurchaseRequestDto>> GetUserRequestsByApproverId()
        {
            var requests = await (from p in dbContext.PurchaseRequests
            .Include(c => c.Category)
            .Where(p => p.ApprovedBy == LoggedInUser)
                                  select new PurchaseRequestDto
                                  {
                                      PurchaseRequestNumber = p.PurchaseRequestNumber,
                                      AssociateName = p.EmployeeName,
                                      ApproverName = p.ApproverName,
                                      SubmittedBy = p.SubmittedBy,
                                      SubmittedOn = p.SubmittedOn,
                                      Priority = p.Priority,
                                      ApprovedOn = p.ApprovedOn,
                                      Status = p.Status,
                                      Comments = p.Comments,
                                      Purpose = p.Purpose,
                                      CategoryName = p.Category.CategoryName,
                                      NetworkCompanyId = p.NetworkCompanyId,
                                      NetworkCompanyName = p.NetworkCompany.CompanyName
                                  }
            )
            .OrderByDescending(p => p.SubmittedOn).ThenByDescending(p => p.PurchaseRequestNumber).ToListAsync();

            return requests;
        }

        public async Task<List<PurchaseRequestDto>> ApprovedUserRequests()
        {

            var approvedRequests = await (from p in dbContext.PurchaseRequests
                .Where(p => p.Status == RequestStatus.Issued.ToString() || p.Status == RequestStatus.Procurement.ToString() || p.Status == RequestStatus.Approved.ToString() || p.Status == RequestStatus.Submitted.ToString())
                                          select new PurchaseRequestDto
                                          {
                                              PurchaseRequestNumber = p.PurchaseRequestNumber,
                                              AssociateName = p.EmployeeName,
                                              ApproverName = p.ApproverName,
                                              CreatedDate = p.CreatedDate,
                                              Purpose = p.Purpose,
                                              ApprovedOn = p.ApprovedOn,
                                              ItrequestNumber = p.ItrequestNumber,
                                              Status = p.Status,
                                              Priority = p.Priority,
                                              CategoryId = p.CategoryId,
                                              CategoryName = p.Category.CategoryName,
                                              Comments = p.Comments,
                                              SubmittedBy = p.SubmittedBy,
                                              NetworkCompanyId= p.NetworkCompanyId,
                                              NetworkCompanyName=p.NetworkCompany.CompanyName,
                                              AdminComments= p.AdminComments,
                                              InventoryId= p.InventoryId,
                                          })
                .OrderBy(c => c.CreatedDate).ThenBy(c => c.PurchaseRequestNumber).ToListAsync();
            return approvedRequests;
        }

        public bool NewAssetRequest(PurchaseRequestDto requestDto, ADUserDto employeeDetails)
        {
            var purachseRequestData = new PurchaseRequest();

            purachseRequestData.RequestId = Guid.NewGuid();
            purachseRequestData.SubmittedOn = DateTime.Now.ToUniversalTime();
            purachseRequestData.SubmittedBy = LoggedInUser;
            purachseRequestData.CreatedDate = DateTime.Now.ToUniversalTime();
            purachseRequestData.CreatedBy = LoggedInUser;
            purachseRequestData.UpdatedDate = DateTime.Now.ToUniversalTime();
            purachseRequestData.UpdatedBy = LoggedInUser;
            purachseRequestData.Status = RequestStatus.Submitted.ToString();
            purachseRequestData.Purpose = requestDto.Purpose;
            purachseRequestData.PurchaseRequestNumber = GetRequestNumber();
            purachseRequestData.ApprovedBy = employeeDetails.ManagerEmail;
            purachseRequestData.ApproverName = employeeDetails.ManagerName;
            purachseRequestData.EmployeeName = employeeDetails.DisplayName;
            purachseRequestData.NetworkCompanyId = requestDto.NetworkCompanyId;
            purachseRequestData.Priority = requestDto.Priority;
            purachseRequestData.CategoryId = requestDto.CategoryId;

            dbContext.PurchaseRequests.Add(purachseRequestData);
            return dbContext.SaveChanges() > 0;
        }

        public async Task<bool> UpdateAssetRequest(PurchaseRequestDto requestDto, string requestNumber, ADUserDto manager)
        {
            var assetRequest = await dbContext.PurchaseRequests.FirstAsync(a => a.PurchaseRequestNumber == requestNumber);
            assetRequest.Purpose = requestDto.Purpose;
            assetRequest.Priority = requestDto.Priority;
            assetRequest.CategoryId = requestDto.CategoryId;
            assetRequest.UpdatedDate = DateTime.Now.ToUniversalTime();
            assetRequest.UpdatedBy = LoggedInUser;
            assetRequest.ItrequestNumber = requestDto.ItrequestNumber;
            assetRequest.Status = requestDto.Status;
            assetRequest.AdminComments= requestDto.AdminComments;
            assetRequest.InventoryId = requestDto.InventoryId;

            if (assetRequest.ApprovedOn == null)
            {
                assetRequest.Comments = "Apprvoed by IT Admin - " + LoggedInUser + " On " + DateTime.UtcNow.ToUniversalTime();
                assetRequest.ApprovedOn = DateTime.UtcNow.ToUniversalTime();
                assetRequest.ApprovedBy = LoggedInUser;
            }

            dbContext.PurchaseRequests.Update(assetRequest);

            var response = await dbContext.SaveChangesAsync() > 0;
            return response;
        }

        public async Task<bool> DeleteAssetRequest(string requestNumber)
        {
            var assetRequest = await dbContext.PurchaseRequests.FirstAsync(a => a.PurchaseRequestNumber == requestNumber);
            assetRequest.Status = RequestStatus.Withdrawn.ToString();
            var response = await dbContext.SaveChangesAsync() > 0;

            return response;
        }

        public async Task<bool> ReviewAssetRequest(string requestNumber, bool review, PurchaseRequestDto requestDto)
        {
            var assetRequest = await dbContext.PurchaseRequests.FirstOrDefaultAsync(a => a.PurchaseRequestNumber == requestNumber);

            if (assetRequest == null)
                throw new NullReferenceException("Request details not found");

            var status = review ? RequestStatus.Approved.ToString() : RequestStatus.Rejected.ToString();

            assetRequest.Status = status;
            assetRequest.ApprovedBy = LoggedInUser;
            assetRequest.ApprovedOn = DateTime.Now.ToUniversalTime();
            assetRequest.Comments = requestDto.Comments;
            assetRequest.Priority = requestDto.Priority;
            assetRequest.NetworkCompanyId = requestDto.NetworkCompanyId;

            var response = await dbContext.SaveChangesAsync() > 0;

            return response;
        }

        private string GetRequestNumber()
        {
            _log.Information($"Enter PR -  {DateTime.Now.ToString()}");
            var lastEntry = dbContext.PurchaseRequests.OrderByDescending(x => x.SubmittedOn).FirstOrDefault();
            var dateString = DateTime.Now.ToUniversalTime().ToString("yyyyMMdd");
            var isTodayApril = DateTime.Today.Month == 4;
            var isLastEntryNotApril = lastEntry?.SubmittedOn.Month != 4;
            var commonString = "URQ" + "-" + dateString + "-";
            var requestNumber = "";

            if (lastEntry == null || (isTodayApril && isLastEntryNotApril))
            {
                requestNumber = commonString + "00001";
            }
            else
            {
                var newNumber = (Int32.Parse(lastEntry.PurchaseRequestNumber[^5..]) + 1).ToString().PadLeft(5, '0');
                requestNumber = commonString + newNumber;
            }
            _log.Information($"Request Number PR -  {requestNumber}");
            _log.Information($"Exit PR -  {DateTime.Now.ToString()}");
            return requestNumber;

        }

        public async Task<PurchaseRequestDto?> GetPurchaseRequestsForIRQ(string PurchaseRequestNumber)
        {
            var requests = await (from p in dbContext.PurchaseRequests
               .Include(c => c.Category)
                                  select new PurchaseRequestDto
                                  {
                                      PurchaseRequestNumber = p.PurchaseRequestNumber,
                                      CategoryName = p.Category.CategoryName,
                                      NetworkCompanyId = p.NetworkCompanyId,
                                      NetworkCompanyName = p.NetworkCompany.CompanyName,
                                      ApproverName = p.ApproverName,
                                      Status = p.Status,
                                      Purpose = p.Purpose,
                                      Priority = p.Priority,
                                      CategoryId = p.CategoryId,
                                      Comments = p.Comments,
                                      ItrequestNumber = p.ItrequestNumber,
                                  })
               .Where(p=>p.ItrequestNumber == PurchaseRequestNumber).FirstOrDefaultAsync();
            
            return requests;
        }
    }
}

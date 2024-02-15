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
    public class MaintenanceRequestAccessor : AccessorCommon, IMaintenanceRequestAccessor
    {
        private readonly IMapper mapper;
        private AssetrazContext dbContext;
        private readonly ILogAnalytics _log;

        public MaintenanceRequestAccessor(AssetrazContext DbContext, IMapper Mapper, IHttpContextAccessor httpAccessor, ILogAnalytics log) : base(httpAccessor)
        {
            dbContext = DbContext;
            mapper = Mapper;
            _log = log;
        }

        public async Task<List<MaintenanceRequestDto>> GetMaintenanceRequests()
        {
            var requests = await (from p in dbContext.MaintenanceRequests
                                  .Include(i => i.Inventory)
                                  .ThenInclude(c => c.Category)
                                  join t in dbContext.InventoryTrackRegisters on p.InventoryId equals t.InventoryId
                                  where p.SubmittedBy.ToLower() == LoggedInUser && t.ReturnDate == null
                                  select new MaintenanceRequestDto
                                  {
                                      RequestId = p.RequestId,
                                      MaintenanceRequestNumber = p.MaintenanceRequestNumber,
                                      CategoryName = p.Inventory.Category.CategoryName,
                                      AssetTagNumber = p.Inventory.AssetTagNumber,
                                      SerialNumber = p.Inventory.SerialNumber,  
                                      ModelNumber = p.Inventory.ModelNumber,
                                      Status = p.Status,
                                      IssuedDate = t.IssuedDate,
                                      SubmittedDate = p.SubmittedDate
                                  })
                .ToListAsync();

            return requests;
        }

        public async Task<List<MaintenanceRequestDto>> GetAllMaintenanceRequests()
        {
            var requests = await (from p in dbContext.MaintenanceRequests
                                  .Include(i => i.Inventory)
                                  .ThenInclude(c => c.Category)
                                  join t in dbContext.InventoryTrackRegisters on p.InventoryId equals t.InventoryId
                                  where t.ReturnDate == null
                                  select new MaintenanceRequestDto
                                  {
                                      RequestId = p.RequestId,
                                      MaintenanceRequestNumber = p.MaintenanceRequestNumber,
                                      CategoryName = p.Inventory.Category.CategoryName,
                                      AssetTagNumber = p.Inventory.AssetTagNumber,
                                      SerialNumber = p.Inventory.SerialNumber,
                                      ModelNumber = p.Inventory.ModelNumber,
                                      Status = p.Status,
                                      SubStatus = p.SubStatus,
                                      IssuedDate = t.IssuedDate,
                                      SubmittedDate = p.SubmittedDate,
                                      ResolvedDate = p.ResolvedDate
                                  })
                .ToListAsync();

            return requests;
        }

        public async Task<bool> AddMaintenanceRequest(MaintenanceRequestDto maintenanceRequestDto)
        {
            var maintenanceRequest = new MaintenanceRequest();

            maintenanceRequest.RequestId = Guid.NewGuid();
            maintenanceRequest.MaintenanceRequestNumber = GetMaintenanceRequestNumber();
            maintenanceRequest.InventoryId = (Guid)maintenanceRequestDto.InventoryId;
            maintenanceRequest.Priority = maintenanceRequestDto.Priority;
            maintenanceRequest.Description = maintenanceRequestDto.Description;
            maintenanceRequest.Address = maintenanceRequestDto.Address;
            maintenanceRequest.PhoneNumber = maintenanceRequestDto.PhoneNumber;
            maintenanceRequest.Status = MaintenanceRequestStatus.Submitted.ToString();
            maintenanceRequest.SubmittedDate = maintenanceRequest.CreatedDate = maintenanceRequest.UpdatedDate = DateTime.Now.ToUniversalTime();
            maintenanceRequest.EmployeeName = LoggedInUserName;
            maintenanceRequest.CreatedBy = maintenanceRequest.UpdatedBy = maintenanceRequest.SubmittedBy = LoggedInUser;

            dbContext.MaintenanceRequests.Add(maintenanceRequest);
            return await dbContext.SaveChangesAsync() > 0;
        }

        private string GetMaintenanceRequestNumber()
        {
            _log.Information($"Enter MaintenanceReqId -  {DateTime.Now.ToString()}");
            var lastEntry = dbContext.MaintenanceRequests.OrderByDescending(x => x.CreatedDate).FirstOrDefault();
            var dateString = DateTime.Now.ToUniversalTime().ToString("yyyyMMdd");
            var isTodayApril = DateTime.Today.Month == 4;
            var isLastEntryNotApril = lastEntry?.CreatedDate.Month != 4;
            var commonString = "MNT" + "-" + dateString + "-";
            var requestNumber = "";

            if (lastEntry == null || (isTodayApril && isLastEntryNotApril))
            {
                requestNumber = commonString + "00001";
            }
            else
            {
                var newNumber = (Int32.Parse(lastEntry.MaintenanceRequestNumber[^5..]) + 1).ToString().PadLeft(5, '0');
                requestNumber = commonString + newNumber;
            }

            _log.Information($"Request Number MaintenanceReqId -  {requestNumber}");
            _log.Information($"Exit MaintenanceReqId -  {DateTime.Now.ToString()}");
            return requestNumber;
        }
    }
}

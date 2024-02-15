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
    public class ProcurementAccessor : AccessorCommon, IProcurementAccessor
    {
        private readonly IMapper _mapper;
        private AssetrazContext _dbContext;
        private readonly ILogAnalytics _logger;

        public ProcurementAccessor(IMapper mapper, AssetrazContext dbContext, IHttpContextAccessor httpAccessor, ILogAnalytics logger) : base(httpAccessor)
        {
            _mapper = mapper;
            _dbContext = dbContext;
            _logger = logger;
        }

        public async Task<List<RequestQuoteDto>> GetAllProcurement()
        {
            List<RequestQuoteDto> procurements = new List<RequestQuoteDto>();
            var vendors = await _dbContext.RequestForQuoteParticipants.Include(v => v.Vendor).Select(v => _mapper.Map<RequestForQuoteParticipantDto>(v)).ToListAsync();
            var requetQuoteDetails = await _dbContext.RequestForQuoteDetails.Include(c => c.Category).ToListAsync();
            var allPurchaseOrders = await _dbContext.PurchaseOrderHeaders.Select(p => _mapper.Map<PurchaseOrderDto>(p)).ToListAsync();

            procurements = await _dbContext.RequestForQuoteHeaders
                                  .Select(RH => new RequestQuoteDto
                                  {
                                      ProcurementRequestId = RH.ProcurementRequestId,
                                      Status = RH.Status,
                                      RequestNumber = RH.ProcurementRequestNumber,
                                      CreatedOn = RH.CreatedDate,
                                      RequestRaisedOn = RH.RequestRaisedOn,
                                      ApprovedOn = RH.ApprovedOn,
                                      ApprovedBy = RH.ApprovedBy,
                                      Comments = RH.Comments,
                                      Notes = RH.Notes,
                                      NetworkCompany = RH.NetworkCompany.CompanyName,
                                  }).OrderByDescending(c => c.RequestRaisedOn).ToListAsync();

            foreach (var procurement in procurements)
            {
                procurement.Vendors = vendors.Where(v => v.ProcurementRequestId == procurement.ProcurementRequestId).ToList();
                procurement.VendorNameList = vendors.Where(v => v.ProcurementRequestId == procurement.ProcurementRequestId).Select(v => v.VendorName).ToList();
                procurement.QuoteReceivedOnList = vendors.Select(v => v.QuoteUploadedOn != null ? Convert.ToDateTime(v.QuoteUploadedOn).ToString("dd/MM/yyyy") : "").ToList();
                procurement.CategoryList = requetQuoteDetails.Where(r => r.ProcurementRequestId == procurement.ProcurementRequestId).Select(r => r.Category.CategoryName).Distinct().ToList();
                procurement.PurchaseOrders = allPurchaseOrders.Where(p => p.ProcurementRequestId == procurement.ProcurementRequestId).ToList();
                procurement.PurchaseOrderNumberList = allPurchaseOrders.Where(p => p.ProcurementRequestId == procurement.ProcurementRequestId).Select(p => p.PurchaseOrderNumber).ToList();
                procurement.POGeneratedOnList = allPurchaseOrders.Select(p => p.PoDate != null ? Convert.ToDateTime(p.PoDate).ToString("dd/MM/yyyy") : "").ToList();
            }

            return procurements;
        }

        public async Task<RequestQuoteDto> GetRequestQuoteHeader(Guid procurementRequestId)
        {
            var procurementHeader = await _dbContext.RequestForQuoteHeaders
                    .FirstOrDefaultAsync(rqh => rqh.ProcurementRequestId == procurementRequestId);

            var procurmentHeaderMapped = _mapper.Map<RequestQuoteDto>(procurementHeader);
            procurmentHeaderMapped.Vendors = await _dbContext.RequestForQuoteParticipants
                .Include(rqp => rqp.Vendor)
                .Where(x => x.ProcurementRequestId == procurementRequestId)
                .Select(v => _mapper.Map<RequestForQuoteParticipantDto>(v))
                .ToListAsync();

            return procurmentHeaderMapped;
        }

        public async Task<Guid> NewProcurementRequest(List<RequestQuoteDto> newRequest)
        {
            Guid ProcurementRequestId = Guid.NewGuid();

            RequestForQuoteHeader requestForQuoteHeader = new RequestForQuoteHeader();

            requestForQuoteHeader.ProcurementRequestNumber = GetProcurementRequestNumber();
            requestForQuoteHeader.ProcurementRequestId = ProcurementRequestId;
            requestForQuoteHeader.NetworkCompanyId = newRequest.First().NetworkCompanyId;
            requestForQuoteHeader.Notes = newRequest.First().Notes;
            requestForQuoteHeader.ApprovalRequired = true;
            requestForQuoteHeader.Active = true;
            requestForQuoteHeader.Status = QuoteStatus.Submitted.ToString();
            requestForQuoteHeader.CreatedDate = requestForQuoteHeader.UpdatedDate = DateTime.Now.ToUniversalTime();
            requestForQuoteHeader.CreatedBy = requestForQuoteHeader.UpdatedBy = LoggedInUser;
            requestForQuoteHeader.AssociateName = LoggedInUserName;

            _dbContext.RequestForQuoteHeaders.Add(requestForQuoteHeader);

            foreach (Guid vendorId in newRequest.First().VendorList)
            {
                RequestForQuoteParticipant requestForQuoteParticipant = new RequestForQuoteParticipant();

                requestForQuoteParticipant.ProcurementVendorId = Guid.NewGuid();
                requestForQuoteParticipant.ProcurementRequestId = ProcurementRequestId;
                requestForQuoteParticipant.VendorId = vendorId;
                requestForQuoteParticipant.IsShortListed = false;
                requestForQuoteParticipant.CreatedDate = requestForQuoteParticipant.UpdatedDate = DateTime.Now.ToUniversalTime();
                requestForQuoteParticipant.CreatedBy = requestForQuoteParticipant.UpdatedBy = LoggedInUser;

                _dbContext.RequestForQuoteParticipants.Add(requestForQuoteParticipant);
            }

            foreach (RequestQuoteDto quoteDetails in newRequest)
            {
                RequestForQuoteDetail quoteData = new RequestForQuoteDetail();

                quoteData.ProcurementDetailsId = Guid.NewGuid();
                quoteData.ProcurementRequestId = ProcurementRequestId;
                quoteData.CategoryId = quoteDetails.CategoryId;
                quoteData.ManufacturerId = quoteDetails.ManfacturerId;
                quoteData.ModelNumber = quoteDetails.ModelNumber;
                quoteData.Specifications = quoteDetails.Specifications;
                quoteData.Quantity = quoteDetails.Quantity;
                quoteData.CreatedDate = quoteData.UpdatedDate = DateTime.Now.ToUniversalTime();
                quoteData.CreatedBy = quoteData.UpdatedBy = LoggedInUser;

                _dbContext.RequestForQuoteDetails.Add(quoteData);
            }
            await _dbContext.SaveChangesAsync();

            return ProcurementRequestId;
        }

        public async Task<string> NewProcurementForApprovedUserRequests(List<RequestQuoteDto> newRequest)
        {
            Guid ProcurementRequestId = Guid.NewGuid();

            RequestForQuoteHeader requestForQuoteHeader = new RequestForQuoteHeader();

            var procurementRequestNumber = GetProcurementRequestNumber();
            requestForQuoteHeader.ProcurementRequestNumber = procurementRequestNumber;
            requestForQuoteHeader.ProcurementRequestId = ProcurementRequestId;
            requestForQuoteHeader.NetworkCompanyId = newRequest.First().NetworkCompanyId;
            requestForQuoteHeader.Notes = newRequest.First().Notes;
            requestForQuoteHeader.ApprovalRequired = true;
            requestForQuoteHeader.Active = true;
            requestForQuoteHeader.Status = QuoteStatus.Submitted.ToString();
            requestForQuoteHeader.CreatedDate = requestForQuoteHeader.UpdatedDate = DateTime.Now.ToUniversalTime();
            requestForQuoteHeader.CreatedBy = requestForQuoteHeader.UpdatedBy = LoggedInUser;
            requestForQuoteHeader.AssociateName = LoggedInUserName;

            _dbContext.RequestForQuoteHeaders.Add(requestForQuoteHeader);

            foreach (RequestQuoteDto quoteDetails in newRequest)
            {
                RequestForQuoteDetail quoteData = new RequestForQuoteDetail();

                quoteData.ProcurementDetailsId = Guid.NewGuid();
                quoteData.ProcurementRequestId = ProcurementRequestId;
                quoteData.CategoryId = quoteDetails.CategoryId;
                quoteData.ManufacturerId = quoteDetails.ManfacturerId;
                quoteData.ModelNumber = quoteDetails.ModelNumber;
                quoteData.Specifications = quoteDetails.Specifications;
                quoteData.Quantity = quoteDetails.Quantity;
                quoteData.CreatedDate = quoteData.UpdatedDate = DateTime.Now.ToUniversalTime();
                quoteData.CreatedBy = quoteData.UpdatedBy = LoggedInUser;

                _dbContext.RequestForQuoteDetails.Add(quoteData);
            }
            await _dbContext.SaveChangesAsync();
            return procurementRequestNumber;
        }

        private string GetProcurementRequestNumber()
        {
            _logger.Information($"Enter PRO -  {DateTime.Now.ToString()}");
            var lastEntry = _dbContext.RequestForQuoteHeaders.OrderByDescending(x => x.CreatedDate).FirstOrDefault();
            var dateString = DateTime.Now.ToUniversalTime().ToString("yyyyMMdd");
            var isTodayApril = DateTime.Today.Month == 4;
            var isLastEntryNotApril = lastEntry?.CreatedDate.Month != 4;
            var commonString = "IRQ" + "-" + dateString + "-";
            var requestNumber = "";

            if (lastEntry == null || (isTodayApril && isLastEntryNotApril))
            {
                requestNumber = commonString + "00001";
            }
            else
            {
                var newNumber = (Int32.Parse(lastEntry.ProcurementRequestNumber[^5..]) + 1).ToString().PadLeft(5, '0');
                requestNumber = commonString + newNumber;
            }

            _logger.Information($"Request Number PRO -  {requestNumber}");
            _logger.Information($"Exit PRO -  {DateTime.Now.ToString()}");
            return requestNumber;
        }

        public async Task<List<RequestForQuoteDetailsDto>> GetProcurementDetails(Guid procurementRequestId, Guid vendorId)
        {
            List<RequestForQuoteDetailsDto> procurementDetails = await _dbContext.RequestForQuoteDetails
                    .Include(c => c.Category)
                    .Include(c => c.Manufacturer)
                    .Where(p => p.ProcurementRequestId == procurementRequestId && p.VendorId == vendorId)
                    .Select(p => new RequestForQuoteDetailsDto
                    {
                        //PurchaseOrderRequestId = p.ProcurementRequest.PurchaseOrderHeaders.Where(p => p.ProcurementRequestId == procurementRequestId && p.VendorId == vendorId).FirstOrDefault().PurchaseOrderRequestId,
                        CategoryId = p.CategoryId,
                        ManufacturerId = p.ManufacturerId,
                        CategoryName = p.Category.CategoryName,
                        ManufacturerName = p.Manufacturer.ManufacturerName,
                        ModelNumber = p.ModelNumber,
                        Quantity = p.Quantity,
                        RatePerQuantity = p.RatePerQuantity,
                        Specifications = p.Specifications,
                        VendorId = vendorId,
                        ProcurementDetailsId = p.ProcurementDetailsId,
                    })
                    .OrderBy(p => p.CategoryName)
                    .ToListAsync();
            return procurementDetails;
        }

        public async Task<List<RequestQuoteDto>> GetProcurementsForApprovalDashboard()
        {
            List<RequestQuoteDto> procurements = new List<RequestQuoteDto>();
            var vendors = await _dbContext.RequestForQuoteParticipants.Include(v => v.Vendor).Select(v => _mapper.Map<RequestForQuoteParticipantDto>(v)).ToListAsync();
            var requetQuoteDetails = await _dbContext.RequestForQuoteDetails.Include(c => c.Category).ToListAsync();

            procurements = await (from RQ in _dbContext.RequestForQuoteHeaders
                .Where(rqh => (rqh.Status == QuoteStatus.ApporvalRequire.ToString() ||
                               rqh.Status == QuoteStatus.Approved.ToString() ||
                               rqh.Status == QuoteStatus.Rejected.ToString()) && rqh.ProcurementRequestNumber != "IRQ-99999999-00001")
                                  from PH in _dbContext.PurchaseOrderHeaders.Where(c => c.PurchaseOrderRequestId == RQ.ProcurementRequestId)
                                  .DefaultIfEmpty()
                                  select new RequestQuoteDto
                                  {
                                      ProcurementRequestId = RQ.ProcurementRequestId,
                                      RequestNumber = RQ.ProcurementRequestNumber,
                                      CreatedBy = RQ.AssociateName,
                                      CreatedOn = RQ.CreatedDate,

                                      RequestRaisedOn = RQ.RequestRaisedOn,
                                      ApprovedOn = RQ.ApprovedOn,
                                      ApprovedBy = RQ.ApprovedBy,
                                      NetworkCompany = RQ.NetworkCompany.CompanyName,
                                      NetworkCompanyId = RQ.NetworkCompanyId,
                                      Status = RQ.Status,
                                      Comments = RQ.Comments,

                                  }).OrderBy(c => c.RequestRaisedOn).ToListAsync();

            foreach (var procurement in procurements)
            {
                procurement.Vendors = vendors.Where(v => v.ProcurementRequestId == procurement.ProcurementRequestId).ToList();
                procurement.VendorNameList = vendors.Where(v => v.ProcurementRequestId == procurement.ProcurementRequestId).Select(v => v.VendorName).ToList();
                procurement.CategoryList = requetQuoteDetails.Where(r => r.ProcurementRequestId == procurement.ProcurementRequestId).Select(r => r.Category.CategoryName).Distinct().ToList();
            }

            return procurements;
        }

        public async Task<bool> UpdateProcurement(List<RequestQuoteDto> requests)
        {
            Guid procurementId = requests.First().ProcurementRequestId;

            RequestForQuoteHeader? existingQuoteHeader = await _dbContext.RequestForQuoteHeaders
                .FirstOrDefaultAsync(rqh => rqh.ProcurementRequestId == procurementId);

            existingQuoteHeader.UpdatedBy = LoggedInUser;
            existingQuoteHeader.UpdatedDate = DateTime.Now.ToUniversalTime();
            existingQuoteHeader.NetworkCompanyId = requests.First().NetworkCompanyId;
            existingQuoteHeader.Notes = requests.First().Notes;

            List<RequestForQuoteParticipant> existingQuoteParticipants = await _dbContext.RequestForQuoteParticipants
                .Where(rqh => rqh.ProcurementRequestId == procurementId)
                .ToListAsync();

            foreach (Guid vendorId in requests.First().VendorList)
            {
                if (!existingQuoteParticipants.Select(eqp => eqp.VendorId).Contains(vendorId))
                {
                    RequestForQuoteParticipant requestForQuoteParticipant = new RequestForQuoteParticipant();

                    requestForQuoteParticipant.ProcurementVendorId = Guid.NewGuid();
                    requestForQuoteParticipant.ProcurementRequestId = procurementId;
                    requestForQuoteParticipant.VendorId = vendorId;
                    requestForQuoteParticipant.IsShortListed = false;
                    requestForQuoteParticipant.UpdatedDate = requestForQuoteParticipant.CreatedDate = DateTime.Now.ToUniversalTime();
                    requestForQuoteParticipant.UpdatedBy = requestForQuoteParticipant.CreatedBy = LoggedInUser;

                    _dbContext.RequestForQuoteParticipants.Add(requestForQuoteParticipant);
                }
            }

            foreach (Guid vendorId in existingQuoteParticipants.Select(eqp => eqp.VendorId))
            {
                if (!requests.First().VendorList.Contains(vendorId))
                {
                    RequestForQuoteParticipant requestForQuoteParticipant = existingQuoteParticipants.FirstOrDefault(eqp => eqp.VendorId == vendorId);
                    _dbContext.RequestForQuoteParticipants.Remove(requestForQuoteParticipant);
                }
            }

            List<RequestForQuoteDetail> existingQuoteDetaisls = await _dbContext.RequestForQuoteDetails
                .Where(rqd => rqd.ProcurementRequestId == procurementId)
                .ToListAsync();

            foreach (RequestQuoteDto request in requests)
            {
                if (!existingQuoteDetaisls.Select(eqd => eqd.ProcurementDetailsId).Contains(request.ProcurementDetailsId))
                {
                    RequestForQuoteDetail quoteData = new RequestForQuoteDetail();

                    quoteData.ProcurementDetailsId = Guid.NewGuid();
                    quoteData.ProcurementRequestId = procurementId;
                    quoteData.CategoryId = request.CategoryId;
                    quoteData.ManufacturerId = request.ManfacturerId;
                    quoteData.ModelNumber = request.ModelNumber;
                    quoteData.Specifications = request.Specifications;
                    quoteData.Quantity = request.Quantity;
                    quoteData.RatePerQuantity = request.RatePerQuantity ?? 0;
                    quoteData.UpdatedDate = quoteData.CreatedDate = DateTime.Now.ToUniversalTime();
                    quoteData.UpdatedBy = quoteData.CreatedBy = LoggedInUser;

                    _dbContext.RequestForQuoteDetails.Add(quoteData);
                }
                else
                {
                    RequestForQuoteDetail quoteData = existingQuoteDetaisls.FirstOrDefault(eqd => eqd.ProcurementDetailsId == request.ProcurementDetailsId);

                    quoteData.CategoryId = request.CategoryId;
                    quoteData.ManufacturerId = request.ManfacturerId;
                    quoteData.ModelNumber = request.ModelNumber;
                    quoteData.Specifications = request.Specifications;
                    quoteData.Quantity = request.Quantity;
                    quoteData.RatePerQuantity = request.RatePerQuantity ?? 0;
                    quoteData.VendorId = request.VendorId;
                    quoteData.UpdatedDate = DateTime.Now.ToUniversalTime();
                    quoteData.UpdatedBy = LoggedInUser;
                }
            }

            foreach (Guid ProcurementDetailsId in existingQuoteDetaisls.Select(eqp => eqp.ProcurementDetailsId))
            {
                if (!requests.Select(r => r.ProcurementDetailsId).ToList().Contains(ProcurementDetailsId))
                {
                    RequestForQuoteDetail deleteRequest = existingQuoteDetaisls.FirstOrDefault(eqd => eqd.ProcurementDetailsId == ProcurementDetailsId);
                    _dbContext.RequestForQuoteDetails.Remove(deleteRequest);
                }
            }

            return await _dbContext.SaveChangesAsync() > 0;

        }

        public async Task<List<RequestQuoteDto>> GetProcurement(Guid procurementRequestId)
        {
            var requestQuoteHeader = _dbContext.RequestForQuoteHeaders
                .Include(rqh => rqh.NetworkCompany)
                .FirstOrDefault(rqd => rqd.ProcurementRequestId.Equals(procurementRequestId));

            if (requestQuoteHeader == null)
                throw new ArgumentException($"Details for procurementRequestId {procurementRequestId} not found", nameof(procurementRequestId));

            var requestForQuote = await  _dbContext.RequestForQuoteDetails
                .Where(rqd => rqd.ProcurementRequestId.Equals(procurementRequestId))
                .Select(rqd => new RequestQuoteDto
                {
                    CategoryId = rqd.CategoryId,
                    CategoryName = rqd.Category.CategoryName,
                    ManufacturerName = rqd.Manufacturer.ManufacturerName,
                    ManfacturerId = rqd.ManufacturerId,
                    ProcurementDetailsId = rqd.ProcurementDetailsId,
                    ProcurementRequestId = rqd.ProcurementRequestId,
                    ModelNumber = rqd.ModelNumber,
                    VendorName = rqd.Vendor.VendorName,
                    Specifications = rqd.Specifications,
                    Quantity = rqd.Quantity,
                    VendorList = rqd.ProcurementRequest.RequestForQuoteParticipants
                        .Where(rqp => rqp.ProcurementRequestId == rqd.ProcurementRequestId)
                        .Select(rqp => rqp.VendorId)
                        .ToList(),
                    NetworkCompanyId = requestQuoteHeader.NetworkCompanyId,
                    RatePerQuantity = rqd.RatePerQuantity,
                    VendorId = rqd.VendorId,
                    NetworkCompany = requestQuoteHeader.NetworkCompany.CompanyName,
                    RequestNumber = requestQuoteHeader.ProcurementRequestNumber,
                    Notes = requestQuoteHeader.Notes
                })
                .ToListAsync();  

            return requestForQuote;
        }

        public async Task<bool> UpdateRequestStatus(Guid procurementRequestId, bool? isDelete, bool? isApproved, string? comments)
        {
            var requestQuoteHeader = _dbContext.RequestForQuoteHeaders
                    .FirstOrDefault(rqd => rqd.ProcurementRequestId.Equals(procurementRequestId));

            if (requestQuoteHeader == null)
                throw new ArgumentException($"Details for procurementRequestId {procurementRequestId} not found", nameof(procurementRequestId));

            if (isDelete.HasValue)
            {
                requestQuoteHeader.Status = QuoteStatus.Withdrawn.ToString();
                requestQuoteHeader.ApprovalRequired = false;
                requestQuoteHeader.Active = false;

                var purchaseRequest = await _dbContext.PurchaseRequests
                    .Where(p => p.ItrequestNumber == requestQuoteHeader.ProcurementRequestNumber)
                    .FirstOrDefaultAsync();

                if (purchaseRequest != null)
                {
                    purchaseRequest.ItrequestNumber = null;
                    purchaseRequest.Status = RequestStatus.Approved.ToString();
                }
            }
            else if (isApproved.HasValue)
            {
                requestQuoteHeader.Comments = comments;
                if (isApproved.Value == true)
                {
                    requestQuoteHeader.Status = QuoteStatus.Approved.ToString();
                    requestQuoteHeader.ApprovedBy = LoggedInUserName;
                    requestQuoteHeader.ApprovedOn = DateTime.Now.ToUniversalTime();
                }
                else
                    requestQuoteHeader.Status = QuoteStatus.Rejected.ToString();

            }
            else
            {
                if (requestQuoteHeader.Status == QuoteStatus.Submitted.ToString())
                {
                    requestQuoteHeader.RequestRaisedOn = DateTime.Now.ToUniversalTime();
                    requestQuoteHeader.RequestRaisedBy = LoggedInUserName;
                    requestQuoteHeader.Status = QuoteStatus.Generated.ToString();
                }
                else if (requestQuoteHeader.Status == QuoteStatus.Generated.ToString())
                    requestQuoteHeader.Status = QuoteStatus.ApporvalRequire.ToString();
            }
            requestQuoteHeader.UpdatedDate = DateTime.Now.ToUniversalTime();
            requestQuoteHeader.UpdatedBy = LoggedInUser;

            return await _dbContext.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateVendorDetails(List<RequestForQuoteParticipantDto> requests)
        {
            Guid procurementId = requests.First().ProcurementRequestId;
            List<RequestForQuoteParticipant> requestForQuoteParticipants = await _dbContext.RequestForQuoteParticipants
                .Where(rqp => rqp.ProcurementRequestId == procurementId)
                .ToListAsync();

            foreach (var request in requests)
            {
                var requestForQuoteParticipant = requestForQuoteParticipants.FirstOrDefault(rqp => request.ProcurementVendorId == rqp.ProcurementVendorId);

                requestForQuoteParticipant.QutoeFilePath = request.QutoeFilePath == null ? requestForQuoteParticipant.QutoeFilePath : request.QutoeFilePath;
                requestForQuoteParticipant.IsShortListed = request.IsShortListed.HasValue ? request.IsShortListed.Value : false;
                requestForQuoteParticipant.QuoteUploadedOn =requestForQuoteParticipant.QutoeFilePath == null ? null : DateTime.Now.ToUniversalTime();
                requestForQuoteParticipant.UpdatedDate = DateTime.Now.ToUniversalTime();
                requestForQuoteParticipant.QuoteUploadedBy = requestForQuoteParticipant.UpdatedBy = LoggedInUser;
            }

            return await _dbContext.SaveChangesAsync() > 0;
        }

        public async Task<string> GetBlobFilePath(Guid procurementVendorId)
        {

            var vendorDetails = await _dbContext.RequestForQuoteParticipants
                .FirstOrDefaultAsync(rqp => rqp.ProcurementVendorId.Equals(procurementVendorId));

            if (vendorDetails == null)
            {
                throw new ArgumentNullException($"procurementVendorId:{procurementVendorId} not valid:", nameof(procurementVendorId));
            }

            return vendorDetails.QutoeFilePath;
        }

        public async Task<bool> DeleteVendorProcurementQuote(Guid procurementVendorId)
        {
            var vendorProcurementRecord = await _dbContext.RequestForQuoteParticipants
                .FirstOrDefaultAsync(rqp => rqp.ProcurementVendorId == procurementVendorId);
            if (vendorProcurementRecord == null)
            {
                throw new NullReferenceException($"Couldn't find record for {procurementVendorId}");
            }

            vendorProcurementRecord.QutoeFilePath = null;
            vendorProcurementRecord.QuoteUploadedOn = null;
            vendorProcurementRecord.IsShortListed = false;
            vendorProcurementRecord.UpdatedDate = DateTime.Now.ToUniversalTime();
            vendorProcurementRecord.UpdatedBy = LoggedInUser;


            return await _dbContext.SaveChangesAsync() > 0;
        }

        public async Task<List<ITRequestNumberDto>> GetAllProcurementRequestNumbers()
        {
            var data = await _dbContext.RequestForQuoteHeaders.Where(r => r.Status == QuoteStatus.Approved.ToString()).ToListAsync();
            List<ITRequestNumberDto> procurementRequestNumbers = _mapper.Map<List<ITRequestNumberDto>>(data);
            return procurementRequestNumbers;
        }

    }
}


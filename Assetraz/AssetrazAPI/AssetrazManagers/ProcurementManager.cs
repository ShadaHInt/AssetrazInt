using AssetrazContracts.AccessorContracts;
using AssetrazContracts.DTOs;
using AssetrazContracts.EngineContracts;
using AssetrazContracts.Enums;
using AssetrazContracts.Exceptions;
using AssetrazContracts.ManagerContracts;

namespace AssetrazManagers
{
    public class ProcurementManager : IProcurementManager
    {
        private IProcurementAccessor _procurementAccessor;
        private readonly IVendorQuoteBlobEngine _vendorQuoteBlobEngine;
        private readonly IFunctionQueueEngine _functionQueueEngine;

        public ProcurementManager(IProcurementAccessor procurementAccessor, IVendorQuoteBlobEngine vendorQuoteBlobEngine, IFunctionQueueEngine functionQueueEngine)
        {
            _procurementAccessor = procurementAccessor;
            _vendorQuoteBlobEngine = vendorQuoteBlobEngine;
            _functionQueueEngine = functionQueueEngine;
        }

        public async Task<List<RequestQuoteDto>> GetAllProcurement()
        {
            return await _procurementAccessor.GetAllProcurement();
        }

        public async Task<List<RequestQuoteDto>> GetProcurement(Guid procurementRequestId)
        {
            return await _procurementAccessor.GetProcurement(procurementRequestId);
        }

        public async Task<bool> NewProcurementRequest(List<RequestQuoteDto> newRequest, bool request, bool cc)
        {
            var newProcurementRequestId = await _procurementAccessor.NewProcurementRequest(newRequest);

            if (request)
                return await UpdateRequestStatus(newProcurementRequestId, null, null, null, cc);

            return true;
        }

        public async Task<string> NewProcurementForApprovedUserRequests(List<RequestQuoteDto> newRequest)
        {
            return await _procurementAccessor.NewProcurementForApprovedUserRequests(newRequest);
        }

        public async Task<List<RequestQuoteDto>> GetProcurementsForApprovalDashboard()
        {
            return await _procurementAccessor.GetProcurementsForApprovalDashboard();
        }

        public async Task<bool> UpdateProcurement(List<RequestQuoteDto> requests, bool statusUpdate, bool cc)
        {
            await _procurementAccessor.UpdateProcurement(requests);
            if (statusUpdate)
            {
                Guid procurementId = requests.First().ProcurementRequestId;
                return await UpdateRequestStatus(procurementId, null, null, null, cc);
            }
            return true;

        }

        public async Task<bool> UpdateRequestStatus(Guid procurementRequestId, bool? isDelete, bool? isApproved, string? comments, bool? cc)
        {
            bool sendNotification = false;
            var queueMessage = new QueueMessageDto();
            queueMessage.ProcessId = procurementRequestId;
            queueMessage.isCc = cc;

            if (!isDelete.HasValue && !isApproved.HasValue)
            {
                var requestHeader = await _procurementAccessor.GetRequestQuoteHeader(procurementRequestId);

                if (requestHeader.Status == QuoteStatus.Generated.ToString())
                {
                    bool isQuoteEmptyForAllProcurementDetails = requestHeader.Vendors.All(p => string.IsNullOrEmpty(p.QutoeFilePath));

                    if (isQuoteEmptyForAllProcurementDetails)
                    {
                        throw new QuoteFileMissingException();
                    }

                    var procurementDetails = await _procurementAccessor.GetProcurement(procurementRequestId);

                    bool isAnyDetailsEmpty = procurementDetails.Any(p => p.VendorId == Guid.Empty || p.RatePerQuantity == null);
                    if (isAnyDetailsEmpty)
                    {
                        throw new DetailsMissingException();
                    }
                    queueMessage.Process = QueueProcess.RequestForApproval;
                    sendNotification = true;
                }
                else if (requestHeader.Status == QuoteStatus.Submitted.ToString())
                {
                    sendNotification = true;
                    queueMessage.Process = QueueProcess.RequestForQuote;
                }

            }

            var result = await _procurementAccessor.UpdateRequestStatus(procurementRequestId, isDelete, isApproved, comments);
            if (sendNotification && result)
            {
                await _functionQueueEngine.PushMessage(queueMessage);
            }
            return result;
        }

        public async Task<bool> UploadVendorQuotes(List<RequestForQuoteParticipantDto> vendorQuoteList)
        {
            var response = new List<RequestForQuoteParticipantDto>();
            if (vendorQuoteList.Any(vq => vq.QuoteFile != null))
                response = await _vendorQuoteBlobEngine.UploadQuotesToContainer(vendorQuoteList);

            if (response != null)
                return await _procurementAccessor.UpdateVendorDetails(vendorQuoteList);

            return false;
        }

        public async Task<List<RequestForQuoteDetailsDto>> GetProcurementDetails(Guid procurementRequestId, Guid vendorId)
        {
            List<RequestForQuoteDetailsDto> procurementDetails = await _procurementAccessor.GetProcurementDetails(procurementRequestId, vendorId);
            if (procurementDetails.Any())
            {
                return procurementDetails;
            }
            else
            {
                throw new NullReferenceException($"Couldn't find record for {procurementRequestId}");
            }
        }

        public async Task<(Stream, string, string)> DownloadVendorQuote(Guid procurementVendorId)
        {
            string filePath = await _procurementAccessor.GetBlobFilePath(procurementVendorId);
            string fileName = filePath.Split("/").LastOrDefault();

            var result = await _vendorQuoteBlobEngine.DownloadVendorQuote(filePath);

            return (result.Item1, result.Item2, fileName);
        }

        public async Task<bool> DeleteVendorQuote(Guid procurementVendorId)
        {
            string filePath = await _procurementAccessor.GetBlobFilePath(procurementVendorId);
            var response = await _vendorQuoteBlobEngine.DeleteVendorQuote(filePath);

            if (response)
                return await _procurementAccessor.DeleteVendorProcurementQuote(procurementVendorId);

            return false;

        }

        public async Task<List<ITRequestNumberDto>> GetAllProcurementRequestNumbers()
        {
            return await _procurementAccessor.GetAllProcurementRequestNumbers();
        }
    }
}

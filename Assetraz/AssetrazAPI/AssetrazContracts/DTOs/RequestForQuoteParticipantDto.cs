using Microsoft.AspNetCore.Http;

namespace AssetrazContracts.DTOs
{
    public class RequestForQuoteParticipantDto
    {
        public Guid ProcurementVendorId { get; set; }
        public Guid ProcurementRequestId { get; set; }
        public Guid? VendorId { get; set; }
        public bool? IsShortListed { get; set; }
        public string? QutoeFilePath { get; set; }
        public DateTime? QuoteUploadedOn { get; set; }
        public string? QuoteUploadedBy { get; set; }
        public IFormFile? QuoteFile { get; set; }
        public string? FileName
        {
            get
            {
                return QutoeFilePath != null ? QutoeFilePath.Split("/").LastOrDefault() : String.Empty;
            }
        }
        public string? VendorName { get; set; }
        public string? VendorEmail { get; set; }
        public DateTime? QuoteReceivedOn { get; set; }
    }
}

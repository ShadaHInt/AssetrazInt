using AssetrazContracts.AccessorContracts;
using AssetrazContracts.Constants;
using AssetrazContracts.DTOs;
using AssetrazContracts.EngineContracts;
using HtmlRendererCore.PdfSharp;
using PdfSharpCore;
using PdfSharpCore.Pdf;

namespace AssetrazEngine
{
    public class PDFEngine : IPDFEngine
    {
        private readonly IPurchaseOrderAccessor _purchaseOrderAccessor;
        private readonly IVendorAccessor _vendorAccessor;
        private readonly IProcurementAccessor _procurementAccessor;
        private readonly IEmailLogAccessor _emailLogAccessor;

        public PDFEngine(IPurchaseOrderAccessor purchaseOrderAccessor
            , IVendorAccessor vendorAccessor
            , IProcurementAccessor procurementAccessor
            , IEmailLogAccessor emailLogAccessor)
        {
            _purchaseOrderAccessor = purchaseOrderAccessor;
            _vendorAccessor = vendorAccessor;
            _procurementAccessor = procurementAccessor;
            _emailLogAccessor = emailLogAccessor;
        }

        private MemoryStream GeneratePDF(string content)
        {
            PdfDocument pdfDocument = PdfGenerator.GeneratePdf(content, PageSize.A4);
            //local file save
            //pdfDocument.Save("testlocal.pdf");
            //
            MemoryStream ms = new MemoryStream();
            pdfDocument.Save(ms);
            return ms;
        }

        public async Task<(MemoryStream?, VendorDetailsDto?, string?)> GeneratePurchaseOrderPDFStream(Guid purchaseOrderRequestId)
        {
            var purchaseOrderDetails = await _purchaseOrderAccessor.GetPurchaseOrderDetailsForQuoteGeneration(purchaseOrderRequestId);
            if (purchaseOrderDetails.Count > 0)
            {
                var vendorId = purchaseOrderDetails.First().VendorID;
                var vendorDetails = await _vendorAccessor.GetVendorDetails(new List<Guid>() { vendorId });
                string poNumber = purchaseOrderDetails.FirstOrDefault().PurchaseOrderNumber;

                await _emailLogAccessor.AddEmailLog($"Generate PO Send Email - Start - GetPurchaseDetailHTMLTemplate : {purchaseOrderRequestId}", "", "");

                string pdfContent = HTMLTemplates.GetPurchaseDetailHTMLTemplate(purchaseOrderDetails, vendorDetails.FirstOrDefault());

                await _emailLogAccessor.AddEmailLog($"Generate PO Send Email - End - GetPurchaseDetailHTMLTemplate : {purchaseOrderRequestId}", "", "");

                

                await _emailLogAccessor.AddEmailLog($"Generate PO Send Email - Start - GeneratePDF : {purchaseOrderRequestId}", "", "");

                var htmlTemplateStream = GeneratePDF(pdfContent);

                await _emailLogAccessor.AddEmailLog($"Generate PO Send Email - End - GeneratePDF : {purchaseOrderRequestId}", "", "");

                return (htmlTemplateStream, vendorDetails.FirstOrDefault(), poNumber);
            }
            return (null, null, null);
        }

        public async Task<(MemoryStream?, List<RequestForQuoteParticipantDto>?, string?)> GenerateQuoteHTMLStream(Guid procurementRequestId)
        {
            var procurementDetails = await _procurementAccessor.GetProcurement(procurementRequestId);
            var requestQuoteHeader = await _procurementAccessor.GetRequestQuoteHeader(procurementRequestId);

            if (procurementDetails.Count > 0 && requestQuoteHeader != null)
            {
                string requestNumber = requestQuoteHeader.RequestNumber;
                var quoteParticipants = requestQuoteHeader.Vendors;

                await _emailLogAccessor.AddEmailLog($"Generate Quote Send Email - Start - GetProcurementDetailsHTMLTemplate : {procurementRequestId}", "", "");

                string pdfContent = HTMLTemplates.GetProcurementDetailsHTMLTemplate(procurementDetails);

                await _emailLogAccessor.AddEmailLog($"Generate Quote Send Email - End - GetProcurementDetailsHTMLTemplate : {procurementRequestId}", "", "");

                await _emailLogAccessor.AddEmailLog($"Generate Quote Send Email - Start - GeneratePDF : {procurementRequestId}", "", "");
                
                var htmlTemplateStream = GeneratePDF(pdfContent);

                await _emailLogAccessor.AddEmailLog($"Generate Quote Send Email - Start - GeneratePDF : {procurementRequestId}", "", "");

                return (htmlTemplateStream, quoteParticipants, requestNumber);
            }
            return (null, null, null);
        }
    }
}

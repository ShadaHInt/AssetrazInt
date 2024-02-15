using AssetrazContracts.AccessorContracts;
using AssetrazContracts.DTOs;
using AssetrazContracts.EngineContracts;
using AssetrazContracts.ManagerContracts;
using AssetrazContracts.Others;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.Graph.ExternalConnectors;
using Microsoft.IdentityModel.Protocols;
using System.Configuration;

namespace AssetrazManagers
{
    public class NotifierFunctionManager : INotifierFunctionManager
    {
        private readonly IPDFEngine _pDFEngine;
        private readonly IEmailEngine _emailEngine;
        private readonly IUserAccessor _userAccessor;
        private readonly IInvoiceAccessor _invoiceAccessor;
        private readonly IProcurementAccessor _procurementAccessor;
        private readonly EmailOptions _emailOption;
        private readonly IEmailLogAccessor _emailLogAccessor;
        public IConfiguration _configuration;

        public NotifierFunctionManager(IPDFEngine pDFEngine
            , IEmailEngine emailEngine
            , IUserAccessor userAccessor
            , IOptions<EmailOptions> emailOption
            , IInvoiceAccessor invoiceAccessor
            , IProcurementAccessor procurementAccessor
            , IEmailLogAccessor emailLogAccessor
            , IConfiguration configuration
            )
        {
            _pDFEngine = pDFEngine;
            _emailEngine = emailEngine;
            _userAccessor = userAccessor;
            _invoiceAccessor = invoiceAccessor;
            _procurementAccessor = procurementAccessor;
            _emailLogAccessor = emailLogAccessor;
            _emailOption = emailOption.Value;
            _configuration = configuration;
        }

        public async Task<bool> GeneratePOSendEmail(Guid purchaseOrderRequestId)
        {
            if (purchaseOrderRequestId == Guid.Empty)
            {
                throw new ArgumentNullException(nameof(purchaseOrderRequestId));
            }

            await _emailLogAccessor.AddEmailLog($"Generate PO Send Email - Start - GeneratePurchaseOrderPDFStream : {purchaseOrderRequestId}", "", "");

            var result = await _pDFEngine.GeneratePurchaseOrderPDFStream(purchaseOrderRequestId);

            await _emailLogAccessor.AddEmailLog($"Generate PO Send Email - End - GeneratePurchaseOrderPDFStream : {purchaseOrderRequestId}", "", "");

            if (result.Item1 != null && result.Item2 != null && result.Item3 != null)
            {
                var opsAdmins = await _userAccessor.GetOpsAdminsEmails();

                var email = new EmailDto
                {
                    Subject = $"Purchase Order - {result.Item3}",
                    Body = new List<string>()
                    {
                        "Dear Sir/Madam,",
                        "Please find the attached purchase order after reviewing the quotes submitted, If you need any clarifications regarding the same, please feel free to contact us.",
                        "We would appreciate if you could initiate the process to deliver the materials at the earliest",
                        "For Valorem Reply"
                    },
                    Footer = "This is computer generated and does not require signature or the Company’s stamp in order to be considered valid.",
                    To = new Dictionary<string, string>() {
                        { result.Item2.VendorName, result.Item2.EmailAddress },
                    },
                    Cc = opsAdmins.ToDictionary(o => o, o => o),
                    Attachment = new Dictionary<string, MemoryStream>()
                    {
                        { result.Item3 + ".pdf", result.Item1 }
                    },
                    referenceid = purchaseOrderRequestId.ToString()
                    
                };

                await _emailLogAccessor.AddEmailLog($"Generate PO Send Email - Initiate SendEmail: {purchaseOrderRequestId}", "", "");

                return await _emailEngine.SendEmail(email);
            }
            else
            {
                throw new OperationCanceledException($"Unable to fetch details for {purchaseOrderRequestId}");
            }
        }

        public async Task<bool> GenerateQuoteSendEmail(Guid procurementRequestId, bool? isOpsAdminsCc)
        {
            if (procurementRequestId == Guid.Empty)
            {
                throw new ArgumentNullException(nameof(procurementRequestId));
            }

            await _emailLogAccessor.AddEmailLog($"Generate Quote Send Email - Start - GenerateQuoteHTMLStream : {procurementRequestId}", "", "");

            var result = await _pDFEngine.GenerateQuoteHTMLStream(procurementRequestId);

            await _emailLogAccessor.AddEmailLog($"Generate Quote Send Email - End - GenerateQuoteHTMLStream : {procurementRequestId}", "", "");

            if (result.Item1 != null && result.Item2 != null && result.Item3 != null)
            {
                var itAdmins = await _userAccessor.GetItAdminEnail();
                var ccList = itAdmins.Distinct();
                string[] opsAdmins = { };
                if (isOpsAdminsCc.HasValue && isOpsAdminsCc.Value)
                {
                    var ops = await _userAccessor.GetOpsAdminsEmails();
                    Array.Resize(ref opsAdmins, ops.Length);
                    opsAdmins = ops;
                    ccList = ccList.Concat(ops).Distinct();
                }

                foreach (var quoteParticipant in result.Item2)
                { 
                    var email = new EmailDto
                    {
                        Subject = $"Request for Price Quotations - {quoteParticipant.VendorName} - {result.Item3}",
                        Body = new List<string>()
                        {
                            "Dear Sir/Madam,",
                            "We would like to get price quotation for the items mentioned in the attached list. If you need any clarifications regarding the same, please feel free to contact us.",
                            "We would appreciate if you could provide the best price for the items requested at the earliest.",
                            "For Valorem Reply"
                        },
                        Footer = "This is computer generated and does not require signature or the Company’s stamp in order to be considered valid.",
                        To = new Dictionary<string, string>() {
                            { quoteParticipant.VendorName, quoteParticipant.VendorEmail }
                        },
                        Attachment = new Dictionary<string, MemoryStream>()
                        {
                            { result.Item3 + ".pdf", result.Item1 }
                        },
                        referenceid = procurementRequestId.ToString()
                    };
                    email.Cc = ccList.ToDictionary(o => o, o => o);

                    await _emailLogAccessor.AddEmailLog($"Generate Quote Send Email - Initiate SendEmail: {procurementRequestId}", "", "");

                    await _emailEngine.SendEmail(email);
                    
                    if(result.Item1.Length > 0) { result.Item1.Position = 0; }
                }
                return true;

            }
            else
            {
                throw new OperationCanceledException($"Unable to fetch details for {procurementRequestId}");
            }
        }

        public async Task NotifyApprover(Guid procurementRequestId, string env)
        {
            if (procurementRequestId == Guid.Empty)
            {
                throw new ArgumentNullException(nameof(procurementRequestId));
            }
            var procurement = await _procurementAccessor.GetRequestQuoteHeader(procurementRequestId);
            var approvers = await _userAccessor.GetProcurementApproversEmail();

            var itAdmins = await _userAccessor.GetItAdminEnail();
            var ccList = itAdmins.Distinct();
            var irqNumber = procurement.RequestNumber;

            if (procurement != null)
            {
                var email = new EmailDto
                {
                    Subject = $"Approval pending on purchase order - {irqNumber}",
                    To = approvers.ToDictionary(a => a, a => a),
                    Body = new List<string>() { "Approver(s),",
                        $"{irqNumber} is awaiting for your approval. Please do the needful.",
                        $"Go to - <a href='{_configuration["ApplicationSite:BaseUrl"]}/approvals/it/{irqNumber}'>{irqNumber}</a>"
                    },
                    referenceid = procurementRequestId.ToString()
                };

                email.Cc = ccList.ToDictionary(o => o, o => o);
                await _emailLogAccessor.AddEmailLog($"Notify Approver - Initiate SendEmail: {procurementRequestId}", "", "");

                await _emailEngine.SendEmail(email);
            }
            else
            {
                throw new OperationCanceledException($"Unable to fetch details for {procurementRequestId}");
            }
        }

        public async Task PurchaseOrderPayementEmailNotification(Guid purchaseOrderRequestId)
        {
            if (purchaseOrderRequestId == Guid.Empty)
            {
                throw new ArgumentNullException(nameof(purchaseOrderRequestId));
            }

            var opsAdmins = await _userAccessor.GetOpsAdminsEmails();
            var itAdmins = await _userAccessor.GetItAdminEnail();
            var accountsAdmins = await _userAccessor.GetAccountsAdminEmails();

            var ccList = opsAdmins.Concat(itAdmins).Distinct();

            var invoiceDetais = await _invoiceAccessor.GetInvoiceDetailsUsingPurchaseOrder(purchaseOrderRequestId);

            var email = new EmailDto
            {
                Subject = $"Payment pending on purchase order - {invoiceDetais.PurchaseOrderNumber}",
                Body = new List<string>()
                    {
                        "Accounts Team,",
                        $"Invoice Number - <a href='{_configuration["ApplicationSite:BaseUrl"]}/stock-receipt/{invoiceDetais.InvoiceId}'>{invoiceDetais.InvoiceNumber}</a> for the Purchase Order - {invoiceDetais.PurchaseOrderNumber} is good for the payment release.",
                        "Please do the needful.",
                        "For IT Admins."
                    },
                To = accountsAdmins.ToDictionary(a => a, a => a), 
                Cc = ccList.ToDictionary(o => o, o => o),
                referenceid = purchaseOrderRequestId.ToString() 
            };

            await _emailLogAccessor.AddEmailLog($"Payment Notification - Initiate SendEmail: {purchaseOrderRequestId}", "", "");

            await _emailEngine.SendEmail(email);
        }
    }
}

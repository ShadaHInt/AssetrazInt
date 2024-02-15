using AssetrazContracts.AccessorContracts;
using AssetrazContracts.DTOs;
using AssetrazContracts.EngineContracts;
using AssetrazContracts.Others;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using System.Text;

namespace AssetrazEngine
{
    public class MailKitEmailEngine : IEmailEngine
    {
        private readonly EmailOptions _emailOption;
        private readonly IEmailLogAccessor _emailLogAccessor;

        public MailKitEmailEngine(IOptions<EmailOptions> emailOption, IEmailLogAccessor emailLogAccessor)
        {
            _emailOption = emailOption.Value;
            _emailLogAccessor = emailLogAccessor;
        }
        public async Task<bool> SendEmail(EmailDto sendEmailDto)
        {
            if (!_emailOption.IsServiceOn)
                return false;

            StringBuilder toAddresses = new StringBuilder();
            StringBuilder ccAddresses = new StringBuilder();

            using var message = new MimeMessage();
            message.From.Add(new MailboxAddress(
                _emailOption.From.Name,
                _emailOption.From.Address
            ));

            List<MailboxAddress> toList = new();
            foreach (var keyValue in sendEmailDto.To)
            {
                toList.Add(new MailboxAddress(keyValue.Key, keyValue.Value));
                toAddresses.Append(keyValue.Value);
                toAddresses.Append(";");
            }
            message.To.AddRange(toList);

            List<MailboxAddress> ccList = new();

            if (sendEmailDto.Cc != null)
            {
                foreach (var keyValue in sendEmailDto.Cc)
                {
                    ccList.Add(new MailboxAddress(keyValue.Key, keyValue.Value));
                    ccAddresses.Append(keyValue.Value);
                    ccAddresses.Append(";");
                }
            }

            message.Cc.AddRange(ccList);

            message.Subject = sendEmailDto.Subject;

            var italicFooter = sendEmailDto.Footer != null ? 
                    $"<i>{sendEmailDto.Footer}</i>" :
                    "<i>This is a computer generated email. Do not respond to it.</i>";

            StringBuilder emailBody = new StringBuilder();
            foreach (var line in sendEmailDto.Body)
            {
                emailBody.AppendLine($"<p>{line}</p>");
            }

            var bodyBuilder = new BodyBuilder();
            bodyBuilder.HtmlBody = @$"
                <div>
                    <div>{emailBody.ToString()}</div>
                    <div>{italicFooter}</div>
                </div>";

            if (sendEmailDto.Attachment != null)
            {
                foreach (var keyValue in sendEmailDto.Attachment)
                {
                    bodyBuilder.Attachments.Add(keyValue.Key, keyValue.Value);
                }
            }
            message.Body = bodyBuilder.ToMessageBody();

            using var client = new SmtpClient();
            await client.ConnectAsync(_emailOption.SMTPServer, _emailOption.Port, SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(
                userName: _emailOption.Username,
                password: _emailOption.Password // password is the API key
            );

            await _emailLogAccessor.AddEmailLog($"Start sending mail: {sendEmailDto.referenceid}", toAddresses.ToString(), ccAddresses.ToString());

            await client.SendAsync(message);

            await _emailLogAccessor.AddEmailLog($"End sending mail: {sendEmailDto.referenceid}", toAddresses.ToString(), ccAddresses.ToString());

            await client.DisconnectAsync(true);

            return true;

        }
    }
}

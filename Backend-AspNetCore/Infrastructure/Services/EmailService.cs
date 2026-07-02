using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using SirenStore.Application.Interfaces;
using MimeKit;
using MailKit.Net.Smtp;
using MailKit.Security;

namespace SirenStore.Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task SendEmailAsync(string to, string subject, string body)
        {
            var host = _configuration["SmtpSettings:Host"];
            var portStr = _configuration["SmtpSettings:Port"];
            var username = _configuration["SmtpSettings:Username"];
            var password = _configuration["SmtpSettings:Password"];
            var from = _configuration["SmtpSettings:FromEmail"];
            var enableSslStr = _configuration["SmtpSettings:EnableSsl"];

            if (string.IsNullOrEmpty(host) || string.IsNullOrEmpty(username))
            {
                // Fallback to warning log in development
                _logger.LogWarning($"\n=== [DEVELOPMENT EMAIL LOG] ===\nTo: {to}\nSubject: {subject}\nBody: {body}\n===============================");
                return;
            }

            int port = int.TryParse(portStr, out var p) ? p : 587;
            bool enableSsl = !bool.TryParse(enableSslStr, out var ssl) || ssl;

            try
            {
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress("SirenStore", from ?? username));
                message.To.Add(new MailboxAddress("", to));
                message.Subject = subject;

                var bodyBuilder = new BodyBuilder { HtmlBody = body };
                message.Body = bodyBuilder.ToMessageBody();

                using var client = new SmtpClient();
                // SecureSocketOptions based on SSL setting
                var socketOption = enableSsl ? SecureSocketOptions.StartTls : SecureSocketOptions.Auto;
                
                await client.ConnectAsync(host, port, socketOption);
                await client.AuthenticateAsync(username, password ?? string.Empty);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);

                _logger.LogInformation($"Email sent successfully to {to}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to send email to {to}");
                throw;
            }
        }
    }
}

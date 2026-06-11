using MailKit.Net.Smtp;
using MimeKit;
using Microsoft.Extensions.Configuration;

using CitizenConnect.Interfaces.Services;

namespace CitizenConnect.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendComplaintAssignedEmail(
    string toEmail,
    string officerName,
    string complaintTitle,
    string complaintDescription,
    string citizenName,
    string status,
    string imageUrl)
        {
            var email = new MimeMessage();

            email.From.Add(new MailboxAddress(
                _config["EmailSettings:SenderName"],
                _config["EmailSettings:SenderEmail"]
            ));

            email.To.Add(MailboxAddress.Parse(toEmail));

            email.Subject = $"New Complaint Assigned: {complaintTitle}";

          email.Body = new TextPart("html")
{
    Text = $@"
<div style='font-family:Arial;background:#f4f6f9;padding:20px;'>

    <div style='max-width:650px;margin:auto;background:white;border:1px solid #ddd;border-radius:10px;overflow:hidden;'>

        <!-- HEADER -->
        <div style='background:#1f4e79;color:white;padding:15px;text-align:center;'>
            <h2 style='margin:0;'>🏛️ Citizen Connect - Official Notice</h2>
            <p style='margin:5px 0 0;font-size:13px;'>Government Complaint Management System</p>
        </div>

        <!-- BODY -->
        <div style='padding:20px;'>

            <h3 style='color:#1f4e79;'>Complaint Assignment Notification</h3>

            <p><b>Officer Assigned:</b> {officerName}</p>
            <p><b>Citizen Name:</b> {citizenName}</p>
            <p><b>Status:</b> <span style='color:#fff;background:#28a745;padding:3px 8px;border-radius:5px;'>{status}</span></p>

            <hr/>

            <h3 style='margin-bottom:5px;'>{complaintTitle}</h3>
            <p style='color:#555;'>{complaintDescription}</p>

            <br/>

            <!-- IMAGE SECTION -->
            <div style='margin-top:15px;'>
                <b>Complaint Evidence:</b><br/>

                {(string.IsNullOrEmpty(imageUrl)
                    ? "<p style='color:gray;'>No image uploaded</p>"
                    : $@"
                        <img src='{imageUrl}'
                        style='width:100%;max-height:300px;object-fit:cover;
                        border-radius:8px;border:1px solid #ddd;margin-top:10px;' />
                    ")}
            </div>

            <br/>

            <!-- FOOTER NOTE -->
            <div style='margin-top:20px;font-size:12px;color:gray;'>
                This is an automated message from Citizen Connect System.<br/>
                Please do not reply to this email.
            </div>

        </div>

        <!-- FOOTER BAR -->
        <div style='background:#f1f1f1;text-align:center;padding:10px;font-size:12px;color:#666;'>
            © Citizen Connect | Government of India Complaint Portal
        </div>

    </div>
</div>
"
};

            using var smtp = new SmtpClient();

            await smtp.ConnectAsync(
                _config["EmailSettings:SmtpServer"],
                int.Parse(_config["EmailSettings:Port"]),
                false
            );

            await smtp.AuthenticateAsync(
                _config["EmailSettings:SenderEmail"],
                _config["EmailSettings:Password"]
            );

            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);
        }
    }
}
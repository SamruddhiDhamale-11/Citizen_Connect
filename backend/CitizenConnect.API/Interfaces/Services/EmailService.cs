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
    string citizenEmail,
    string citizenMobile,
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
    Text = GetEmailLayout($@"

<h3 style='color:#1f4e79;'>Complaint Assignment Notification</h3>
<p><b>Officer Assigned:</b> {officerName}</p>

<p><b>Citizen Name:</b> {citizenName}</p>
<p><b>Citizen Email:</b> {citizenEmail}</p>

<p><b>Citizen Mobile:</b> {citizenMobile}</p>
<p>
<b>Status:</b>

<span style='background:#0d6efd;
color:white;
padding:5px 12px;
border-radius:20px;
font-weight:bold;
display:inline-block;'>

{status}

</span>

</p>

<hr/>

<h3>{complaintTitle}</h3>

<p style='color:#555;'>

{complaintDescription}

</p>

<br/>

<b>Complaint Evidence</b>

<br/><br/>

{
(
    string.IsNullOrEmpty(imageUrl)
        ? "<p style='color:gray;'>No image uploaded.</p>"
        : $@"
<img src='{imageUrl}'
style='width:100%;
max-height:300px;
object-fit:cover;
border-radius:8px;
border:1px solid #ddd;' />
"
)
}

")
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



        public async Task SendComplaintStatusUpdatedEmail(
    string toEmail,
    string citizenName,
    string complaintNumber,
    string oldStatus,
    string newStatus,
    string? remarks,
    string? officerName = null,
    string? officerDesignation = null,
    string? departmentName = null,
    string? officerEmail = null,
    string? officerMobile = null)
{
    var email = new MimeMessage();

    email.From.Add(new MailboxAddress(
        _config["EmailSettings:SenderName"],
        _config["EmailSettings:SenderEmail"]));

    email.To.Add(MailboxAddress.Parse(toEmail));

   string emailSubject = newStatus switch
{
    "Pending"   => $"🟡 Complaint Pending - {complaintNumber}",
    "Assigned"  => $"🔵 Complaint Assigned - {complaintNumber}",
    "Resolved"  => $"🟢 Complaint Resolved - {complaintNumber}",
    "Rejected"  => $"🔴 Complaint Rejected - {complaintNumber}",
    _           => $"📢 Complaint Status Updated - {complaintNumber}"
};

email.Subject = emailSubject;


string badgeColor = "#6c757d";

switch (newStatus.Trim().ToLower())
{
    case "pending":
        badgeColor = "#f39c12";   // Orange
        break;

    case "assigned":
        badgeColor = "#0d6efd";   // Blue
        break;

    case "resolved":
        badgeColor = "#28a745";   // Green
        break;

    case "rejected":
        badgeColor = "#dc3545";   // Red
        break;
}

email.Body = new TextPart("html")
{

        Text = GetEmailLayout($@"

<p>Hello <b>{citizenName}</b>,</p>

<p>Your complaint status has been updated successfully.</p>

<h3 style='color:#1f4e79;'>📋 Complaint Details</h3>

<table style='width:100%;border-collapse:collapse;'>

<tr>
<td style='padding:8px;font-weight:bold;'>Complaint Number</td>
<td style='padding:8px;'>{complaintNumber}</td>
</tr>

<tr>
<td style='padding:8px;font-weight:bold;'>Previous Status</td>
<td style='padding:8px;'>{oldStatus}</td>
</tr>

<tr>
<td style='padding:8px;font-weight:bold;'>Current Status</td>
<td style='padding:8px;'>

<span style='background:{badgeColor};
color:white;
padding:5px 12px;
border-radius:20px;
font-weight:bold;'>

{newStatus}

</span>

</td>
</tr>

<tr>
<td style='padding:8px;font-weight:bold;'>Remarks</td>
<td style='padding:8px;'>{remarks}</td>
</tr>

</table>
{
(
    newStatus == "Assigned" && !string.IsNullOrWhiteSpace(officerName)

        ? $@"

<br/>

<h3 style='color:#1f4e79;'>👨‍💼 Assigned Officer Details</h3>

<table style='width:100%;border-collapse:collapse;'>

<tr>
<td style='padding:8px;font-weight:bold;'>Officer Name</td>
<td style='padding:8px;'>{officerName}</td>
</tr>

<tr>
<td style='padding:8px;font-weight:bold;'>Designation</td>
<td style='padding:8px;'>{officerDesignation}</td>
</tr>

<tr>
<td style='padding:8px;font-weight:bold;'>Department</td>
<td style='padding:8px;'>{departmentName}</td>
</tr>

<tr>
<td style='padding:8px;font-weight:bold;'>Official Email</td>
<td style='padding:8px;'>{officerEmail}</td>
</tr>

<tr>
<td style='padding:8px;font-weight:bold;'>Mobile Number</td>
<td style='padding:8px;'>{officerMobile}</td>
</tr>

</table>

"

        : ""
)
}
<br/>

<p>
You can login to Citizen Connect to view the latest updates.
</p>

")

};

    using var smtp = new SmtpClient();

    await smtp.ConnectAsync(
        _config["EmailSettings:SmtpServer"],
        int.Parse(_config["EmailSettings:Port"]),
        false);

    await smtp.AuthenticateAsync(
        _config["EmailSettings:SenderEmail"],
        _config["EmailSettings:Password"]);

    await smtp.SendAsync(email);

    await smtp.DisconnectAsync(true);
}



public async Task SendSuggestionStatusUpdatedEmail(
    string toEmail,
    string citizenName,
    string suggestionNumber,
    string oldStatus,
    string newStatus,
    string? remarks)
{
    var email = new MimeMessage();

    email.From.Add(new MailboxAddress(
        _config["EmailSettings:SenderName"],
        _config["EmailSettings:SenderEmail"]));

    email.To.Add(MailboxAddress.Parse(toEmail));

    string emailSubject = newStatus switch
    {
        "Pending" => $"🟡 Suggestion Pending - {suggestionNumber}",
        "Under Review" => $"🔵 Suggestion Under Review - {suggestionNumber}",
        "Approved" => $"🟢 Suggestion Approved - {suggestionNumber}",
        "Rejected" => $"🔴 Suggestion Rejected - {suggestionNumber}",
        "Implemented" => $"🟣 Suggestion Implemented - {suggestionNumber}",
        _ => $"📢 Suggestion Status Updated - {suggestionNumber}"
    };

    email.Subject = emailSubject;

    string badgeColor = "#6c757d";

    switch (newStatus.Trim().ToLower())
    {
        case "pending":
            badgeColor = "#f39c12";
            break;

        case "under review":
            badgeColor = "#0d6efd";
            break;

        case "approved":
            badgeColor = "#28a745";
            break;

        case "rejected":
            badgeColor = "#dc3545";
            break;

        case "implemented":
            badgeColor = "#6f42c1";
            break;
    }

    email.Body = new TextPart("html")
    {
        Text = GetEmailLayout($@"

<p>Hello <b>{citizenName}</b>,</p>

<p>Your suggestion status has been updated successfully.</p>

<h3 style='color:#1f4e79;'>💡 Suggestion Details</h3>

<table style='width:100%;border-collapse:collapse;'>

<tr>
<td style='padding:8px;font-weight:bold;'>Suggestion Number</td>
<td style='padding:8px;'>{suggestionNumber}</td>
</tr>

<tr>
<td style='padding:8px;font-weight:bold;'>Previous Status</td>
<td style='padding:8px;'>{oldStatus}</td>
</tr>

<tr>
<td style='padding:8px;font-weight:bold;'>Current Status</td>
<td style='padding:8px;'>

<span style='background:{badgeColor};
color:white;
padding:5px 12px;
border-radius:20px;
font-weight:bold;'>

{newStatus}

</span>

</td>
</tr>

<tr>
<td style='padding:8px;font-weight:bold;'>Remarks</td>
<td style='padding:8px;'>{remarks}</td>
</tr>

</table>

<br/>

<p>
You can login to Citizen Connect to view the latest updates.
</p>

")
    };

    using var smtp = new SmtpClient();

    await smtp.ConnectAsync(
        _config["EmailSettings:SmtpServer"],
        int.Parse(_config["EmailSettings:Port"]),
        false);

    await smtp.AuthenticateAsync(
        _config["EmailSettings:SenderEmail"],
        _config["EmailSettings:Password"]);

    await smtp.SendAsync(email);

    await smtp.DisconnectAsync(true);
}



private string GetEmailLayout(string bodyContent)
{
    return $@"
<div style='font-family:Arial;background:#f4f6f9;padding:20px;'>

    <div style='max-width:650px;margin:auto;background:white;border:1px solid #ddd;border-radius:10px;overflow:hidden;'>

        <!-- HEADER -->
        <div style='background:#1f4e79;color:white;padding:15px;text-align:center;'>
            <h2 style='margin:0;'>🏛️ Citizen Connect - Official Notice</h2>
            <p style='margin:5px 0 0;font-size:13px;'>
                Government Complaint Management System
            </p>
        </div>

        <!-- BODY -->
        <div style='padding:20px;'>

            {bodyContent}

            <div style='margin-top:20px;font-size:12px;color:gray;'>
                This is an automated message from Citizen Connect System.<br/>
                Please do not reply to this email.
            </div>

        </div>

        <!-- FOOTER -->
        <div style='background:#f1f1f1;text-align:center;padding:10px;font-size:12px;color:#666;'>
            © Citizen Connect | Government of India Complaint Portal
        </div>

    </div>

</div>";
}


    }
}
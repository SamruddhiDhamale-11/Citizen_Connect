namespace CitizenConnect.Interfaces.Services
{
    public interface IEmailService
    {
       Task SendComplaintAssignedEmail(
    string toEmail,
    string officerName,
    string complaintTitle,
    string complaintDescription,
    string citizenName,
    string status,
    string imageUrl);
    }
}
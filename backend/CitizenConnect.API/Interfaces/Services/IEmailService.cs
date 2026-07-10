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
    string citizenEmail,
    string citizenMobile,
    string status,
    string imageUrl);

      Task SendComplaintStatusUpdatedEmail(
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
    string? officerMobile = null);

    Task SendSuggestionStatusUpdatedEmail(
    string toEmail,
    string citizenName,
    string suggestionNumber,
    string oldStatus,
    string newStatus,
    string? remarks);
    }
}
namespace CitizenConnect.DTOs.Admin
{
   public class ComplaintStatusHistoryDto
{
    public string OldStatus { get; set; } = string.Empty;

    public string NewStatus { get; set; } = string.Empty;

    public string ChangedBy { get; set; } = string.Empty;

    public string? Remarks { get; set; }

    public string? AssignedOfficerName { get; set; }

    public DateTime ChangedAt { get; set; }

    public DateTime? CreatedAt { get; set; }
}
}
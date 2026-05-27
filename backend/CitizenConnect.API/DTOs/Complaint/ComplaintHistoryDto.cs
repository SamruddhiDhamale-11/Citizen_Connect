    
namespace CitizenConnect.DTOs.Complaint
{
   public class ComplaintHistoryDto
{
    public string OldStatus { get; set; }
    public string NewStatus { get; set; }
    public string ChangedBy { get; set; }
    public DateTime ChangedAt { get; set; }
    public string Remarks { get; set; }
}
}
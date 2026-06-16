namespace CitizenConnect.API.DTOs.Dashboard
{
    public class MonthlyComplaintTrendDto
    {
        public string Month { get; set; } = string.Empty;

        public int TotalComplaints { get; set; }
    }
}

namespace CitizenConnect.API.DTOs.Dashboard
{
    public class WardAnalyticsDto
    {
        public string WardName { get; set; } = string.Empty;

        public int TotalComplaints { get; set; }

        public int ResolvedComplaints { get; set; }
    }
}

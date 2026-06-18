namespace CitizenConnect.API.DTOs.Dashboard
{
    public class ComplaintCategoryAnalyticsDto
    {
        public string CategoryName { get; set; } = string.Empty;

        public int TotalComplaints { get; set; }
    }
}

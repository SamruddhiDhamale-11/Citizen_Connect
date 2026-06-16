namespace CitizenConnect.API.DTOs.Dashboard
{
    public class DashboardSummaryDto
    {
        public int TotalComplaints { get; set; }

        public int OpenComplaints { get; set; }

        public int AssignedComplaints { get; set; }

        public int ResolvedComplaints { get; set; }

        public int TotalCitizens { get; set; }

        public int TotalWards { get; set; }

        public int TotalDepartments { get; set; }

        public decimal ResolutionRate { get; set; }
    }
}

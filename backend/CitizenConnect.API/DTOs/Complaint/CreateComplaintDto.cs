using Microsoft.AspNetCore.Http;

namespace CitizenConnect.DTOs.Complaint
{
    public class CreateComplaintDto
    {
        public int CitizenId { get; set; }

        public int WardId { get; set; }

        public int ComplaintCategoryId { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string Address { get; set; } = string.Empty;

    public string CategoryName { get; set; }

    public int DepartmentId { get; set; }

       public decimal Latitude { get; set; }

        public decimal Longitude { get; set; }

        public int ComplaintStatusMasterId
        { get; set; }

        public string Priority { get; set; } = "Medium";

        public bool IsAnonymous { get; set; }

        public List<IFormFile>? Files { get; set; }
    }
}
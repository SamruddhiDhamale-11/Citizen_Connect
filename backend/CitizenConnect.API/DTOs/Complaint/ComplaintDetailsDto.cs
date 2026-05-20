namespace CitizenConnect.DTOs.Complaint
{
    public class ComplaintDetailsDto
    {
        public int ComplaintId { get; set; }

        public string ComplaintNumber { get; set; } = string.Empty;

        public string CategoryName { get; set; } = string.Empty;

        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string Address { get; set; } = string.Empty;

        public string Status { get; set; } = string.Empty;

        public string Priority { get; set; } = string.Empty;

        public bool IsAnonymous { get; set; }

        public string CitizenName { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }

        public List<string> Images { get; set; }
            = new List<string>();
    }
}
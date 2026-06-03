using System;
using CitizenConnect.Domain.Common;

namespace CitizenConnect.Domain.Entities
{
    public class OfficerCategoryMapping
    {
        public int OfficerCategoryMappingId { get; set; }

        // FK → Officer
        public int OfficerId { get; set; }
        public Officer Officer { get; set; }

        // FK → Category
        public int ComplaintCategoryId { get; set; }
        public ComplaintCategory ComplaintCategory { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public bool IsActive { get; set; } = true;
    }
}
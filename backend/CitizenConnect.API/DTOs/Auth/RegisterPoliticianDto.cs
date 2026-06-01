
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace CitizenConnect.Application.DTOs.Auth
{
    public class RegisterPoliticianDto
    {
        // =====================================================
        // USER INFORMATION
        // =====================================================

        [Required]
        [MaxLength(100)]
        public string FirstName { get; set; }
            = string.Empty;

        [Required]
        [MaxLength(100)]
        public string LastName { get; set; }
            = string.Empty;

        [Required]
        [MaxLength(15)]
        public string MobileNo { get; set; }
            = string.Empty;

        [EmailAddress]
        [MaxLength(150)]
        public string? Email { get; set; }

        // =====================================================
        // POLITICIAN INFORMATION
        // =====================================================

        [Required]
        [MaxLength(100)]
        public string PartyName { get; set; }
            = string.Empty;

        // Sarpanch
        // Mayor
        // Corporator
        [Required]
        [MaxLength(100)]
        public string PoliticianRole { get; set; }
            = string.Empty;

        [Range(18, 100)]
        public int Age { get; set; }

        [Required]
        [MaxLength(20)]
        public string Gender { get; set; }
            = string.Empty;

        [Required]
        [MaxLength(500)]
        public string Address { get; set; }
            = string.Empty;

        [Required]
        [MaxLength(100)]
        public string GovernmentId { get; set; }
            = string.Empty;

        // =====================================================
        // RELATIONSHIPS
        // =====================================================

        // Mandatory
        public int JurisdictionId { get; set; }

        // NULL = Jurisdiction level politician
        // Value = Ward level politician
        public int? WardId { get; set; }

        // =====================================================
        // FILE UPLOADS
        // =====================================================

        public IFormFile? ProfilePhoto { get; set; }

        public IFormFile? IdProof { get; set; }

        // =====================================================
        // AUTH
        // =====================================================

        [Required]
        [MinLength(6)]
        [MaxLength(100)]
        public string Password { get; set; }
            = string.Empty;

        [Required]
        public string Captcha { get; set; }
            = string.Empty;
    }
}


using System.ComponentModel.DataAnnotations;

namespace CitizenConnect.Application.DTOs
    .FacilityFieldDtos
{
    public class UpdateFacilityFieldDto
    {
        [Required]
        public int FacilityFieldId { get; set; }

        [Required]
        public int FacilityModuleId { get; set; }

        [Required]
        [MaxLength(150)]
        public string FieldName { get; set; }
            = string.Empty;

        [Required]
        [MaxLength(50)]
        public string FieldType { get; set; }
            = string.Empty;

        public bool IsRequired { get; set; }

        public int DisplayOrder { get; set; }

        [MaxLength(200)]
        public string? Placeholder
        { get; set; }

        public bool IsActive { get; set; }
    }
}


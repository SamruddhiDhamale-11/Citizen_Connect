
using System.ComponentModel.DataAnnotations;

namespace CitizenConnect.Application.DTOs
    .FacilityDataDtos
{
    public class UpdateFacilityDataDto
    {
        [Required]
        public int FacilityDataId { get; set; }

        [Required]
        public int FacilityModuleId { get; set; }

        [Required]
        public int FacilityFieldId { get; set; }

        [Required]
        public int JurisdictionId { get; set; }

        public int? WardId { get; set; }

        [Required]
        [MaxLength(2000)]
        public string FieldValue { get; set; }
            = string.Empty;

        public bool IsActive { get; set; }
    }
}

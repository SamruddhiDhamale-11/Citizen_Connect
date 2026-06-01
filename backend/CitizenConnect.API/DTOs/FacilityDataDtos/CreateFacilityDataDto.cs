
using System.ComponentModel.DataAnnotations;

namespace CitizenConnect.Application.DTOs
    .FacilityDataDtos
{
    public class CreateFacilityDataDto
    {
        [Required]
        public int FacilityModuleId { get; set; }

        [Required]
        public int FacilityFieldId { get; set; }

        [Required]
        public int JurisdictionId { get; set; }

        // NULL = Jurisdiction level
        // Value = Ward level
        public int? WardId { get; set; }

        [Required]
        [MaxLength(2000)]
        public string FieldValue { get; set; }
            = string.Empty;
    }
}


using System.ComponentModel.DataAnnotations;

namespace CitizenConnect.Application.DTOs
    .FacilityModuleDtos
{
    public class CreateFacilityModuleDto
    {
        [Required]
        [MaxLength(150)]
        public string ModuleName { get; set; }
            = string.Empty;

        [MaxLength(500)]
        public string? ModuleDescription
        { get; set; }

        [MaxLength(100)]
        public string? IconName { get; set; }
    }
}


namespace CitizenConnect.Application.DTOs
    .FacilityModuleDtos
{
    public class FacilityModuleResponseDto
    {
        public int FacilityModuleId { get; set; }

        public string ModuleName { get; set; }
            = string.Empty;

        public string? ModuleDescription
        { get; set; }

        public string? IconName { get; set; }

        public bool IsActive { get; set; }
    }
}

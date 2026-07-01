using CitizenConnect.API.Domain.Enums;
using CitizenConnect.API.DTOs.FacilityFieldOptionDto;

namespace CitizenConnect.Application.DTOs.Facility
{
    public class FacilityFieldResponseDto
    {
        public int FacilityFieldId { get; set; }

        public int FacilityModuleId { get; set; }

        public string FieldName { get; set; }
            = string.Empty;

        public FacilityFieldType FieldType { get; set; }

        public bool IsRequired { get; set; }

        public int DisplayOrder { get; set; }

        public string? Placeholder { get; set; }

        public bool IsActive { get; set; }

        public List<FacilityFieldOptionResponseDto> Options
        {
            get;
            set;
        } = new();
    }
}
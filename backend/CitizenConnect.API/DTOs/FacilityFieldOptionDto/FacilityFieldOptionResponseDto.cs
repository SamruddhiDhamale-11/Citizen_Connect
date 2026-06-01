namespace CitizenConnect.API.DTOs.FacilityFieldOptionDto
{
    public class FacilityFieldOptionResponseDto
    {
        public int FacilityFieldOptionId { get; set; }

        public int FacilityFieldId { get; set; }

        public string OptionText { get; set; }
            = string.Empty;

        public int DisplayOrder { get; set; }

        public bool IsActive { get; set; }
    }
}

namespace CitizenConnect.API.DTOs.FacilityFieldOptionDto
{
    public class UpdateFacilityFieldOptionDto
    {
        public int FacilityFieldOptionId { get; set; }

        public string OptionText { get; set; }
            = string.Empty;

        public int DisplayOrder { get; set; }

        public bool IsActive { get; set; }
    }
}

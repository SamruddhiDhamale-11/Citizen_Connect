namespace CitizenConnect.API.DTOs.FacilityFieldOptionDto
{
    public class CreateFacilityFieldOptionDto
    {
        public int FacilityFieldId { get; set; }

        public string OptionText { get; set; }
            = string.Empty;

        public int DisplayOrder { get; set; }
    }
}

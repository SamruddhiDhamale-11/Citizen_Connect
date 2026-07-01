namespace CitizenConnect.API.DTOs.WardRepresentatives
{
    public class CreateWardRepresentativesDto
    {
        public int WardId { get; set; } = 1;

        public List<CreateWardRepresentativeDto> Representatives { get; set; } = new();
    }
}

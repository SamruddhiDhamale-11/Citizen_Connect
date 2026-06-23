namespace CitizenConnect.API.Interfaces.Services
{
    public interface IWardValidationService
    {
        Task<bool> IsLocationInsideWardAsync(
            int wardId,
            decimal latitude,
            decimal longitude);
    }
}

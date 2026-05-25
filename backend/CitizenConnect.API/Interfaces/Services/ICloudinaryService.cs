using Microsoft.AspNetCore.Http;

namespace CitizenConnect.Interfaces.Services
{
    public interface ICloudinaryService
    {
        Task<string> UploadImageAsync(IFormFile file);
    }
}
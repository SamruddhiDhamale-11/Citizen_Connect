using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

using CitizenConnect.Interfaces.Services;
using CitizenConnect.API.Configurations;

using Microsoft.Extensions.Options;

namespace CitizenConnect.Services
{
    public class CloudinaryService : ICloudinaryService
    {
        private readonly Cloudinary _cloudinary;

        public CloudinaryService(
            IOptions<CloudinarySettings> config)
        {
            var account = new Account(
                config.Value.CloudName,
                config.Value.ApiKey,
                config.Value.ApiSecret
            );

            _cloudinary = new Cloudinary(account);
        }

        public async Task<string>
            UploadImageAsync(IFormFile file)
        {
            using var stream = file.OpenReadStream();

            var uploadParams =
                new ImageUploadParams
                {
                    File = new FileDescription(
                        file.FileName,
                        stream)
                };

            var uploadResult =
                await _cloudinary
                    .UploadAsync(uploadParams);

            return uploadResult.SecureUrl.ToString();
        }
    }
}
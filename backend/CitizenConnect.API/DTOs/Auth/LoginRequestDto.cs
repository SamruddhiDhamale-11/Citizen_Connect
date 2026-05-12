namespace CitizenConnect.Application.DTOs.Auth
{
    public class LoginRequestDto
    {
        public string EmailOrMobile { get; set; } = string.Empty;

        public string Captcha { get; set; } = string.Empty;
    }
}
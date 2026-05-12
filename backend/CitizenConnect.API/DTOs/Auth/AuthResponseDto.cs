namespace CitizenConnect.Application.DTOs.Auth
{
    public class AuthResponseDto
    {
        public bool Success { get; set; }

        public string Message { get; set; } = string.Empty;

        public int UserId { get; set; }

        public string Role { get; set; } = string.Empty;

        public string RedirectUrl { get; set; } = string.Empty;
    }
}
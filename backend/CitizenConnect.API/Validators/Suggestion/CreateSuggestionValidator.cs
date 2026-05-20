using CitizenConnect.Application.DTOs.Suggestion;
using FluentValidation;

namespace CitizenConnect.Application.Validators.Suggestion
{
    public class CreateSuggestionValidator
        : AbstractValidator<CreateSuggestionRequestDto>
    {
        public CreateSuggestionValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty()
                .MaximumLength(200);

            RuleFor(x => x.Description)
                .NotEmpty()
                .MaximumLength(2000);

            RuleFor(x => x.ExpectedBenefit)
                .NotEmpty()
                .MaximumLength(1000);

            RuleFor(x => x.SuggestionCategoryId)
                .GreaterThan(0);
        }
    }
}
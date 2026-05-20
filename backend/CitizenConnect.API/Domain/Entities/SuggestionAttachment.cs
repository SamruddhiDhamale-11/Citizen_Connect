using CitizenConnect.Domain.Common;

namespace CitizenConnect.Domain.Entities
{
    public class SuggestionAttachment
        : BaseEntity
    {
        public int SuggestionAttachmentId
        { get; set; }

        public int SuggestionId { get; set; }

        public string FilePath { get; set; }
            = string.Empty;

        public string FileName { get; set; }
            = string.Empty;

        public string? FileType { get; set; }

        public long FileSize { get; set; }


        /**
         * =====================================
         * Navigation
         * =====================================
         */

        public Suggestion Suggestion
        { get; set; } = null!;
    }
}
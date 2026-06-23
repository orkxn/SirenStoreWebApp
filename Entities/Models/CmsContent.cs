using Entities.Enums;

namespace Entities.Models
{
    public class CmsContent : BaseModel
    {
        public string Title { get; set; }
        public string Slug { get; set; }
        public string Content { get; set; }
        public string? Summary { get; set; }
        public string? FeaturedImageUrl { get; set; }

        public ContentTypes ContentType { get; set; }
        public bool IsPublished { get; set; }
        public DateTime? PublishDate { get; set; }
        public int SortOrder { get; set; }
    }
}

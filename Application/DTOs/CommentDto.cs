using System;

namespace Application.DTOs.Comment
{

    // ürün hakkındaki yorumun görüntülenecek olan kısmı
    public class CommentDto
    {
        public long Id { get; set; }
        public string Text { get; set; } = null!;
        public int Rating { get; set; }
        public DateTime CreationDate { get; set; }
        public long UserId { get; set; }
        public string UserFullName { get; set; } = null!;

        public long ProductId { get; set; }
        public string? ProductName { get; set; }
        public string? ProductImageUrl { get; set; }
    }

    // yeni bir yorum yapılacağı zaman istenen veriler
    public class CommentCreateDto
    {
        public string Text { get; set; } = null!;
        public int Rating { get; set; }
        public long ProductId { get; set; }
    }

    // mevcut yorum güncelleneceği zaman istenen veriler
    public class CommentUpdateDto
    {
        public string Text { get; set; } = null!;
        public int Rating { get; set; }
    }
}
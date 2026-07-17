using System;

namespace Entities.Models
{
    public class Comment : BaseModel
    {
        public string Text { get; set; } = null!;
        public int Rating { get; set; } // 1-5 arası yıldız puanı

        public long UserId { get; set; } // foreign key
        public User User { get; set; } = null!; 

        public long ProductId { get; set; } // foreign key
        public Product Product { get; set; } = null!; 
    }
}

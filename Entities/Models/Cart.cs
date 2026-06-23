using System.Collections.Generic;

namespace Entities.Models
{
    public class Cart : BaseModel
    {
        public long UserId { get; set; }
        public User User { get; set; }

        public decimal TotalAmount { get; set; }

        public ICollection<CartItem> CartItems { get; set; }
    }
}

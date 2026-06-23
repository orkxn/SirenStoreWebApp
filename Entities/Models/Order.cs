using Entities.Enums;
using System.Collections.Generic;

namespace Entities.Models
{
    public class Order : BaseModel
    {
        public long UserId { get; set; }
        public User User { get; set; }

        public string OrderNumber { get; set; }
        public decimal TotalAmount { get; set; }
        public OrderStatus Status { get; set; }

        public long ShippingAddressId { get; set; }
        // If you have an Address model, you can add a navigation property here

        public ICollection<OrderItem> OrderItems { get; set; }
    }
}

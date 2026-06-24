using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema; // [ForeignKey] niteliği için gerekli

namespace Entities.Models
{
    public class Category : BaseModel
    {
        public string Name { get; set; }
        public string Description { get; set; }

        // 1. DÜZELTME: Tipi int? yerine long? yaptık (BaseModel'deki bigint ID ile eşleşmesi için)
        public long? ParentCategoryId { get; set; }

        // 2. DÜZELTME: EF Core'a yukarıdaki ID'nin bu nesneye ait olduğunu açıkça belirttik
        [ForeignKey("ParentCategoryId")]
        public Category ParentCategory { get; set; }

        public ICollection<Category> SubCategories { get; set; }
        public ICollection<Product> Products { get; set; }
    }
}
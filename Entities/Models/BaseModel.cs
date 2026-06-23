using System;
using System.Collections.Generic;
using System.Text;

namespace Entities.Models
{
    public class BaseModel
    {
        public long Id { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public bool IsDeleted { get; set; }
    }
}

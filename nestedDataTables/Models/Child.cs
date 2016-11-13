using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace NestedDataTables.Models
{
    public class Child
    {
        public int ChildId { get; set; }
        public int ParentId { get; set; }
        public string Name { get; set; }
        public DateTime Birthday { get; set; }
        public string FavoriteColorHex { get; set; }
        //public string FavoriteColor2 { get; set; }
    }
}
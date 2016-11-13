using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace NestedDataTables.Models
{
    public class Toy
    {
        public int ToyId { get; set; }
        public int ChildId { get; set; }
        public string Name { get; set; }
        public ToyType ToyType { get; set; }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace NestedDataTables.Models
{
    public class Parent
    {
        public int ParentId { get; set; }
        public string Name { get; set; }
        public DateTime Birthday { get; set; }
        public string HomePhoneNumber { get; set; }
        public string WorkPhoneNumber { get; set; }
        public string City { get; set; }
        public string State { get; set; }
    }
}
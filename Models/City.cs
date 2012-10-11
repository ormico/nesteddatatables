using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace nestedDataTables.Web
{
    /// <summary>
    /// Summary description for City
    /// </summary>
    public class City
    {
        public City()
        {
        }

        public string Name { get; set; }
        public int AreaSqMi { get; set; }
        public int Population { get; set; }
        public string WebUrl { get; set; }
    }
}
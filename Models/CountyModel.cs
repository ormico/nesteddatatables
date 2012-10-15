using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace nestedDataTables.Web
{
    public class CountyModel
    {
        public CountyModel()
        {
        }

        public CountyModel(string StateID, County County)
        {
            this.StateID = StateID;
            this.Name = County.Name;
            this.AreaSqMi = County.AreaSqMi;
            this.Population = County.Population;
            this.WebUrl = County.WebUrl;
        }

        public string StateID { get; set; }
        public string Name { get; set; }
        public int AreaSqMi { get; set; }
        public int Population { get; set; }
        public string WebUrl { get; set; }
    }
}
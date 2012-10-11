using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace nestedDataTables.Web
{
    public class CityModel
    {
        public CityModel(string StateID, string CountyName, City City)
        {
            this.StateID = StateID;
            this.CountyName = CountyName;
            this.Name = City.Name;
            this.AreaSqMi = City.AreaSqMi;
            this.Population = City.Population;
            this.WebUrl = City.WebUrl;
        }

        public string StateID { get; set; }
        public string CountyName { get; set; }
        public string Name { get; set; }
        public int AreaSqMi { get; set; }
        public int Population { get; set; }
        public string WebUrl { get; set; }
    }
}
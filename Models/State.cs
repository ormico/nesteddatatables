using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace nestedDataTables.Web
{
    /// <summary>
    /// Summary description for State
    /// </summary>
    public class State
    {
        public State()
        {
        }

        public string StateID { get; set; }
        public string StateName { get; set; }
        public int Population { get; set; }

        public List<County> Counties { get; set; }

        public static List<State> Get()
        {
            List<State> rc = new List<State>();

            State GA = new State() { StateID = "GA", StateName = "Georgia", Population = 9815210, Counties = new List<County>() };
            GA.Counties.Add(new County()
            {
                Name = "Fulton",
                AreaSqMi = 534,
                Population = 949599,
                WebUrl = "www.fultoncountyga.gov",
                Cities = new List<City>()
            {
                new City() { Name = "Atlanta", Population = 420003, AreaSqMi = 132, WebUrl = "atlanta.gov" }
            }
            });
            GA.Counties.Add(new County()
            {
                Name = "Bibb",
                AreaSqMi = 255,
                Population = 156433,
                WebUrl = "www.co.bibb.ga.us",
                Cities = new List<City>()
            {
                new City() { Name = "Macon", Population = 155547, AreaSqMi = 255, WebUrl = "www.cityofmacon.net" },
                new City() { Name = "Payne", Population = 178, AreaSqMi = 0, WebUrl = null }
            }
            });

            State NY = new State() { StateID = "NY", StateName = "New York", Population = 19465197, Counties = new List<County>() };
            NY.Counties.Add(new County()
            {
                Name = "Albany",
                AreaSqMi = 533,
                Population = 304204,
                WebUrl = "www.albanycounty.com",
                Cities = new List<City>()
            {
                new City() { Name = "Albany", Population = 97856, AreaSqMi = 21, WebUrl = "albany.org" }
            }
            });
            NY.Counties.Add(new County()
            {
                Name = "New York",
                AreaSqMi = 33,
                Population = 1601948,
                WebUrl = "www.mbpo.org",
                Cities = new List<City>()
            {
                new City() { Name = "New York (Manhattan)", Population = 1601948, AreaSqMi = 33, WebUrl = "nyc.gov" }
            }
            });

            State CA = new State() { StateID = "CA", StateName = "California", Population = 37691912, Counties = new List<County>() };
            CA.Counties.Add(new County()
            {
                Name = "San Francisco",
                AreaSqMi = 231,
                Population = 805235,
                WebUrl = "www.sfgov.org",
                Cities = new List<City>()
            {
                new City() { Name = "San Francisco", Population = 805235, AreaSqMi = 231, WebUrl = "www.sfgov.org" }
            }
            });
            CA.Counties.Add(new County()
            {
                Name = "Sacramento County",
                AreaSqMi = 995,
                Population = 1418788,
                WebUrl = "www.saccounty.net",
                Cities = new List<City>()
            {
                new City() { Name = "Sacramento", Population = 472178, AreaSqMi = 100, WebUrl = "www.cityofsacramento.org" }
            }
            });

            rc.Add(GA);
            rc.Add(NY);
            rc.Add(CA);

            return rc;
        }
    }
}
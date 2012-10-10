using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Services;
using System.Web.Services;

[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
[System.Web.Script.Services.ScriptService]
public class WebService : System.Web.Services.WebService {

    public WebService () {

        //Uncomment the following line if using designed components 
        //InitializeComponent(); 
    }

    [WebMethod]
    public List<State> GetStates() {
        return State.Get();
    }

    [WebMethod]
    [ScriptMethod(UseHttpGet = true)]
    public List<State> GetStates2()
    {
        return State.Get();
    }

    [WebMethod]
    public List<CountyModel> GetCounties(string StateID)
    {
        return (
            from s in State.Get()
            from c in s.Counties
            where s.StateID == StateID
            select new CountyModel(s.StateID, c)
            ).ToList();
    }

    [WebMethod]
    public List<CityModel> GetCities(string StateID, string CountyName)
    {
        return (
            from s in State.Get()
            from c in s.Counties
            from cty in c.Cities
            where s.StateID == StateID && c.Name == CountyName
            select new CityModel(s.StateID, c.Name, cty)
            ).ToList();
    }
}

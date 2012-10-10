using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

public class County
{
	public County()
	{
	}

    public string Name { get; set; }
    public int AreaSqMi { get; set; }
    public int Population { get; set; }
    public string WebUrl { get; set; }

    public List<City> Cities { get; set; }
}
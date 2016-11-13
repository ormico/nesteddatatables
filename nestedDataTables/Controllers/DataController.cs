using NestedDataTables.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;

namespace NestedDataTables.Controllers
{
    [RoutePrefix("api/data")]
    public class DataController : ApiController
    {
        Data.DataGenerator _generator
        {
            get { return Data.DataGenerator.Instance; }
        }

        [Route("parent/all")]
        [ResponseType(typeof(List<Parent>))]
        public async Task<IHttpActionResult> GetParents()
        {
            IEnumerable<Parent> rc = _generator.GetParents();
            return Ok(rc);
        }

        [Route("parent/{ParentId:int}")]
        [ResponseType(typeof(List<Parent>))]
        public async Task<IHttpActionResult> GetParent(int ParentId)
        {
            Parent rc = _generator.GetParent(ParentId);
            return Ok(rc);
        }

        [Route("parent/{ParentId:int}/children")]
        [ResponseType(typeof(List<Parent>))]
        public async Task<IHttpActionResult> GetChildren(int ParentId)
        {
            IEnumerable<Child> rc = _generator.GetChildrenByParentId(ParentId);
            return Ok(rc);
        }


        [Route("parent/{ParentId:int}/child/{ChildId:int}/toys")]
        [ResponseType(typeof(List<Parent>))]
        public async Task<IHttpActionResult> GetToys(int ParentId, int ChildId)
        {
            IEnumerable<Toy> rc = _generator.GetToysByChildId(ChildId);
            return Ok(rc);
        }
    }
}

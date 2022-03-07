using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using RoomySentry;

namespace Roomy.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RoomyController : ControllerBase
    {
        [HttpPost]
        [Route("Devices")]
        public async Task<object> AddDevice([FromBody] JSONDevice d)
        {
            Sentry.AddDevice(d.ToDevice());
            return Ok();
        }
        
        [HttpPost]
        [Route("Devices/{deviceMac}")]
        public async Task<object> AssociateIP(string deviceMac, string ipAddress)
        {
            Device device = Sentry.Filter.FirstOrDefault(x => x.MacAddressString == deviceMac);
            device.AddKnownIp(IPAddress.Parse(ipAddress));
            Sentry.RemoveDevice(deviceMac);
            Sentry.AddDevice(device);
            return Ok();
        }
        
        [HttpGet]
        [Route("Devices")]
        public async Task<object> GetDevices()
        {
            return Ok(Sentry.Filter);
        }
        
        [HttpGet]
        [Route("Devices/{deviceMac}")]
        public async Task<object> GetDevice(string deviceMac)
        {
            return Ok(Sentry.Filter.FirstOrDefault(x => x.MacAddressString == deviceMac));
        }
        
        [HttpDelete]
        [Route("Devices/{deviceMac}")]
        public async Task<object> DeleteDevice(string deviceMac)
        {
            bool didRem = Sentry.RemoveDevice(deviceMac);
            return didRem ? Ok() : NotFound();
        }
    }
}
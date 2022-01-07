using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.NetworkInformation;
using System.Text.Json.Serialization;
using LiteDB;

namespace RoomySentry
{
    public class JSONDevice
    {
        public string MacAddress { get; set; }
        public string OwnerName { get; set; }
        public string DeviceName { get; set; }

        public Device ToDevice()
        {
            return new Device(OwnerName, DeviceName, PhysicalAddress.Parse(MacAddress));
        }
    }
    public class Device
    {
        [BsonId]
        public ObjectId id { get; set; }
        
        [JsonIgnore]
        public PhysicalAddress MacAddress { get; private set; }

        [JsonPropertyName("macAddress")] public string MacAddressString => MacAddress.ToString();
        public string OwnerName { get; private set; }
        public string DeviceName { get; private set; }
        
        public DateTime LastDetected { get; private set; }

        [JsonIgnore]
        [BsonIgnore]
        public HashSet<IPAddress> KnownAddresses { get; private set; }

        public HashSet<String> KnownIpAddresses { get; private set; }
        
        public Device()
        {
            id = ObjectId.NewObjectId();
        }

        public Device(string owner, string device, PhysicalAddress address)
        {
            id = ObjectId.NewObjectId();
            OwnerName = owner;
            MacAddress = address;
            DeviceName = device;
            KnownAddresses = new HashSet<IPAddress>();
            KnownIpAddresses = new HashSet<string>();
        }

        public void ReinitFromDB()
        {
            KnownAddresses = new HashSet<IPAddress>();
            MacAddress = PhysicalAddress.Parse(MacAddressString);
            foreach (string addy in KnownIpAddresses)
            {
                KnownAddresses.Add(IPAddress.Parse(addy));
            }
        }
        
        public void AddKnownIp(IPAddress ip)
        {

            if (KnownAddresses.Add(ip))
            {
                KnownIpAddresses.Add(ip.ToString());
            }
        }

        public void PrintDetected()
        {
            Console.WriteLine($"[{DateTime.Now.ToLongTimeString()}] Detected {OwnerName}'s {DeviceName}");
        }
        
        public void Detected()
        {
            LastDetected = DateTime.UtcNow;
        }

        public override int GetHashCode()
        {
            return MacAddress.GetHashCode();
        }
    }
}
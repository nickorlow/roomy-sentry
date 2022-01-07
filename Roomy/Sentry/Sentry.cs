using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.NetworkInformation;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;
using LiteDB;
using PacketDotNet;
using PacketDotNet.Utils;
using SharpPcap;
using SharpPcap.LibPcap;

namespace RoomySentry
{
    static class Sentry
    {
        public static HashSet<Device> Filter { get; private set; }
        private static ILiteCollection<Device> collection;

        public static async Task RunService()
        {
            try
            {
                Filter = new HashSet<Device>();
                LiteDatabase db = new LiteDatabase("roomy-db");
                collection = db.GetCollection<Device>("devices");
                collection.EnsureIndex(x => x.MacAddress);

                foreach (Device d in collection.FindAll())
                {
                    d.ReinitFromDB();
                    Filter.Add(d);
                }

                using var device = LibPcapLiveDeviceList.Instance[0];
                device.Open();
                device.OnPacketArrival += OnPacketArrival;
                device.StartCapture();
                while (true)
                {
                    Console.Clear();
                    Console.WriteLine($"Welcome to Roomy Sentry!\n{DateTime.Now}\n");
                    foreach (var mdevice in Filter)
                    {
                        Console.WriteLine(
                            $"{mdevice.OwnerName}'s {mdevice.DeviceName} last seen at {mdevice.LastDetected.ToShortDateString()} {mdevice.LastDetected.ToLongTimeString()}" +
                            $"\nIsIdentified: {mdevice.KnownAddresses.Count > 0}\n\n");
                    }

                    Thread.Sleep(TimeSpan.FromMinutes(1));
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
        }

        public static bool RemoveDevice(string deviceMac)
        {
            Device removeme = Filter.FirstOrDefault(x => x.MacAddressString == deviceMac);
            if (removeme != null)
            {
                collection.Delete(removeme.id);
                Filter.RemoveWhere(x => x.MacAddressString == deviceMac);
                return true;
            }

            return false;
        }

        public static void AddDevice(Device d)
        {
            Filter.Add(d);
            collection.Insert(d);
        }

        static void OnPacketArrival(object s, PacketCapture e)
        {
            Packet p = Packet.ParsePacket(e.GetPacket().LinkLayerType, e.Data.ToArray());
            var arp = p.Extract<ArpPacket>();
            
            if (arp != null)
            {
                bool isSend = false;
                bool isRec = false;
                Device d = Filter.FirstOrDefault(x => x.MacAddress.Equals(arp.SenderHardwareAddress));
                isSend = d != null;
                d ??= Filter.FirstOrDefault(x => x.MacAddress.Equals(arp.TargetHardwareAddress));
                isRec = !isSend && d != null;

                d ??= Filter.FirstOrDefault(x =>
                    x.KnownAddresses.Contains(arp.SenderProtocolAddress) ||
                    x.KnownAddresses.Contains(arp.TargetProtocolAddress));

                if (d != null)
                {
                    d.Detected();
                    collection.Update(d);
                    if (isRec || isSend)
                    {
                        IPAddress addy = isSend ? arp.SenderProtocolAddress : arp.TargetProtocolAddress;
                        d.AddKnownIp(addy);
                    }
                }
            }
            else
            {
                var tcp = p.Extract<IPPacket>();
                if (tcp != null)
                {
                    Device d = Filter.FirstOrDefault(x =>
                        x.KnownAddresses.Contains(tcp.SourceAddress) ||
                        x.KnownAddresses.Contains(tcp.DestinationAddress));
                    d?.Detected();
                    if(d != null)
                    {
                        collection.Update(d);
                    }
                }
            }
        }
    }
    
}
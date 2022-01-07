# Roomy Sentry API
Ever get tired of asking your roommates if they're home or not? This device scans for their devices on your local network and then tells you! (Probably not a huge invasion of privacy?)

## Endpoints

### POST /Roomy/Devices
Creates a device that the Sentry will keep watch for.

####Example
Body:
```json
{
  "MacAddress": "2F11A35434266",
  "OwnerName": "Nick",
  "DeviceName": "iPhone 14 Pro Max DVT"
}
```

Response:
200 OK

### GET /Roomy/Devices
Gets a list of all devices watched by the sentry

####Example
Body: {empty}

Response:
200 OK
```json
[
  {
    "id": {
      "timestamp": 1641596237,
      "machine": 8458160,
      "pid": 4471,
      "increment": 499181,
      "creationTime": "2022-01-07T22:57:17Z"
    },
    "macAddress": "2F11A35434266",
    "ownerName": "Nick",
    "deviceName": "iPhone 14 Pro Max DVT",
    "lastDetected": "2022-01-07T22:57:22.999697Z",
    "knownIpAddresses": [
      "192.168.1.73"
    ]
  }
]
```


### GET /Roomy/Devices/{deviceMac}
Gets a device info from the Sentry

####Example
Body: {empty}

Response:
200 OK
```json

  {
    "id": {
      "timestamp": 1641596237,
      "machine": 8458160,
      "pid": 4471,
      "increment": 499181,
      "creationTime": "2022-01-07T22:57:17Z"
    },
    "macAddress": "2F11A35434266",
    "ownerName": "Nick",
    "deviceName": "iPhone 14 Pro Max DVT",
    "lastDetected": "2022-01-07T22:57:22.999697Z",
    "knownIpAddresses": [
      "192.168.1.73"
    ]
  }

```


### DELETE /Roomy/Devices/{deviceMac}
Removes a device from the Sentry's watchlist

####Example
Body: {empty}

Response:

200 OK: Device successfully deleted

404 NOT FOUND: Device did not exist
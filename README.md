Noonlight Event Example
==================================

Prerequisites:

* mongodb
* node

First, create a file named `.env` in the project directory.

The contents should look like this:
```
MONGO_CONNECTION_STRING=mongodb://localhost/example
NOONLIGHT_SERVER_TOKEN=<token>
```

If mongo isn't installed locally, replace the above connection string with the appropriate one.

Make sure to replace `<token>` with your token, which can be found [here](https://developer.noonlight.com/app/dashboard).


Run the following commands to get started:

* `npm install`
* `npm start`

Next, we need to create a profile to link to the devices.

```
curl --location --request POST 'http://localhost:8081/example/v1/profiles' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Example",
    "pin": "1234",
    "phone": "15555555999",
    "location": {
        "address": {
            "line1": "123 fake st",
            "city": "Fake town",
            "state": "CA",
            "zip": "90210"
        }
    }

}'
```

Then, replace `<profile id>` in the url below with the id that was returned from the above request. This will register a device with the above profile.
```
curl --location --request POST 'http://localhost:8081/example/v1/profiles/<profile id>/devices' \
--header 'Content-Type: application/json' \
--data-raw '{
    "device_id": "a4988fc4-82e7-45d7-9230-3771418e9f7d",
    "attribute": "camera",
    "value": "unknown",
    "device_model": "c920",
    "device_name": "Desktop Security Cam",
    "device_manufacturer": "Logitech"
}'
```

Finally, send an event in, which will create an alarm, if one isn't already open.
```
curl --location --request POST 'http://localhost:8081/example/v1/events' \
--header 'Content-Type: application/json' \
--data-raw '{
    "device_id": "a4988fc4-82e7-45d7-9230-3771418e9f7d",
    "media": "https://playertest.longtailvideo.com/adaptive/issue666/playlists/cisq0gim60007xzvi505emlxx.m3u8"
}'
```
To cancel the alarm, replace `<profile id>` with the correct profile id and run the following command:
```
curl --location --request PUT 'http://localhost:8081/example/v1/profiles/<profile id>/alarms' \
--header 'Content-Type: application/json' \
--data-raw '{
    "pin": "1234"
}'
```

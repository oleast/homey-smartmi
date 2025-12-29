# Smartmi Air Purifier P1 - Data Points (DPS) Mapping

This document describes the Tuya DPS (Data Point System) mapping for the Smartmi Air Purifier P1.

## DPS Values

The following data points are used to communicate with the device:

| DPS | Description | Type | Values | Read/Write |
|-----|-------------|------|--------|------------|
| 1 | Power | Boolean | true/false | R/W |
| 2 | Mode | String | auto, sleep, favourite, manual | R/W |
| 3 | Fan Speed | Integer | 0-100 or 1-3 | R/W |
| 4 | Fan Speed Level | Integer | 1-3 (alternative to DPS 3) | R/W |
| 5 | Child Lock | Boolean | true/false | R/W |
| 11 | PM2.5 | Integer | Air quality in µg/m³ | R |
| 12 | Filter Life | Integer | 0-100 (percentage remaining) | R |
| 13 | Temperature | Integer | Temperature in °C | R |
| 14 | Humidity | Integer | Humidity percentage | R |

## Notes

- The actual DPS values may vary between different firmware versions
- Some devices may use different DPS numbers for the same functionality
- If the device doesn't respond to certain commands, you may need to adjust the DPS mappings in `device.js`
- You can monitor the device communication in the Homey app logs to see actual DPS values

## Protocol

This app uses the Tuya Local protocol (similar to localtuya in Home Assistant):
- Protocol version is typically 3.3 (but can be 3.1, 3.3, or 3.4)
- All communication is done locally on your network
- No cloud connection is required after initial setup

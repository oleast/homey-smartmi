# Smartmi Air Purifier P1 - Data Points (DPS) Mapping

This document describes the Tuya DPS (Data Point System) mapping for the Smartmi Air Purifier P1.

## Implemented DPS Values

The following data points are implemented and used to communicate with the device:

| DPS | Description | Type | Values | Read/Write |
|-----|-------------|------|--------|------------|
| 109 | Fan Speed | Integer | 1-100 (0 = off) | R/W |
| 3 | Mode | String | auto, sleep, strong, manual | R/W |
| 7 | Child Lock | Boolean | true/false | R/W |
| 2 | PM2.5 | Integer | Air quality in µg/m³ | R |
| 102 | PM10 | Integer | Air quality in µg/m³ | R |
| 104 | Filter Life | Integer | 0-100 (percentage remaining) | R |
| 105 | Filter Usage | Integer | Hours used | R |
| 101 | Sound | Boolean | true/false | Sound on/off | R/W |
| 110 | Screen Brightness | String | BRIGHTNESS_AUTO, BRIGHTNESS_OFF, BRIGHTNESS_LOW, BRIGHTNESS_HIGH | Display brightness | R/W |
| 103 | Timer | String | 0_hour, 1_hour, 2_hour, 4_hour, 8_hour | Auto-off timer | R/W |
| 19 | Timer Remaining | Integer | Minutes remaining | Duration sensor | R |

## Additional Available DPS (Not Implemented)

| DPS | Description | Type | Values | Notes |
|-----|-------------|------|--------|-------|
| 22 | Fault Alarm | Integer | 0 = no fault | Diagnostic sensor, values unclear |
| 108 | Device Color | String | unknown, dark_grey, sliver | Not useful for functionality |
| 107 | Country Code | String | Various | Read-only, no practical use |

## Power Control

Note: There is no dedicated power DPS. The device is controlled through the fan speed (DPS 109):
- Fan speed = 0: Device is off
- Fan speed > 0: Device is on (minimum value is 1)

When the user toggles power on, the device restores the previous fan speed or sets to minimum (1).

## Mode Values

The mode DPS (3) accepts the following string values:
- `auto`: Automatic mode based on air quality
- `sleep`: Low-noise operation for nighttime
- `strong`: Maximum purification
- `manual`: Manual fan speed control

## Screen Brightness Values

The screen brightness DPS (110) uses the following mappings:
- `BRIGHTNESS_AUTO` → "Auto" (automatic brightness)
- `BRIGHTNESS_OFF` → "Off" (screen off)
- `BRIGHTNESS_LOW` → "Dim" (low brightness)
- `BRIGHTNESS_HIGH` → "Bright" (high brightness)

## Timer Values

The timer DPS (103) uses the following values:
- `0_hour` → "Off" (no timer)
- `1_hour` → "1 hour"
- `2_hour` → "2 hours"
- `4_hour` → "4 hours"
- `8_hour` → "8 hours"

## Protocol

This app uses the Tuya Local protocol (similar to localtuya in Home Assistant):
- Protocol version is typically 3.3 (but can be 3.1, 3.3, or 3.4)
- All communication is done locally on your network
- No cloud connection is required after initial setup

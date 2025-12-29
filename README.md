# Smartmi Air Purifier for Homey

Control your Smartmi Air Purifier devices from your Homey Pro smart home system.

## Supported Devices

- Smartmi Air Purifier P1

## Features

- Power on/off control
- Air purifier mode selection (Auto, Sleep, Favorite, Manual)
- Fan speed control
- PM2.5 air quality monitoring
- Temperature and humidity monitoring
- Child lock control
- Filter life monitoring

## Setup

### Prerequisites

Before adding your Smartmi Air Purifier to Homey, you need to obtain the following information:

1. **IP Address**: The local IP address of your device on your network
2. **Device ID**: The unique identifier of your device
3. **Local Key**: The encryption key for local communication

### How to get Device ID and Local Key

You can obtain these credentials using one of the following methods:

1. **Tuya IoT Platform** (Recommended):
   - Create an account on the [Tuya IoT Platform](https://iot.tuya.com/)
   - Link your Smartmi/Tuya account
   - Access device information through the Cloud Development section

2. **Using localtuya documentation**:
   - Follow the [localtuya guide](https://github.com/rospogrigio/localtuya) for Home Assistant
   - The same credentials work for this Homey app

### Adding the Device

1. Open the Homey app
2. Go to Devices and click the "+" button
3. Select "Smartmi Air Purifier"
4. Choose "Smartmi Air Purifier P1"
5. Add the device (settings can be configured after adding)
6. Go to device settings and enter:
   - IP Address
   - Device ID
   - Local Key
   - Protocol version (usually 3.3)

## Protocol

This app uses the Tuya local protocol to communicate with devices, similar to how the localtuya integration works in Home Assistant. Communication is done entirely locally on your network.

## License

MIT

## Support

For issues and feature requests, please visit the [GitHub repository](https://github.com/oleast/homey-smartmi).
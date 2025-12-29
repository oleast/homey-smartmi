# Setup Instructions for Smartmi Air Purifier P1

This guide will help you set up your Smartmi Air Purifier P1 with Homey Pro.

## Prerequisites

Before you begin, make sure you have:
1. A Smartmi Air Purifier P1 connected to your WiFi network
2. The Homey app installed on your mobile device
3. Access to your router to find the device's IP address

## Step 1: Obtain Device Credentials

To control your Smartmi Air Purifier locally, you need three pieces of information:

### Required Information:
- **IP Address**: The local network IP address of your device
- **Device ID**: A unique identifier for your device
- **Local Key**: An encryption key for local communication

### Method 1: Using Tuya IoT Platform (Recommended)

1. Go to [https://iot.tuya.com/](https://iot.tuya.com/)
2. Create an account or log in
3. Go to "Cloud" → "Development"
4. Create a new project (if you don't have one)
5. Link your Smartmi/Tuya account:
   - Go to "Devices" → "Link Tuya App Account"
   - Follow the instructions to link your account
6. Once linked, go to "Devices" to see your devices
7. Click on your Smartmi Air Purifier P1
8. Note down the following:
   - Device ID (shown in device details)
   - Local Key (shown in device details - you may need to enable "Debug Mode" in project settings)

### Method 2: Using tuya-cli (Advanced)

If you're comfortable with command-line tools:

```bash
npm install -g @tuyapi/cli
tuya-cli wizard
```

Follow the wizard instructions to extract your device credentials.

### Finding the IP Address

You can find your device's IP address by:
1. Checking your router's connected devices list
2. Using a network scanner app on your phone
3. Using the Tuya/Smartmi mobile app (some versions show the IP)

## Step 2: Add Device to Homey

1. Open the Homey app on your mobile device
2. Go to "Devices" (bottom menu)
3. Tap the "+" button (top right)
4. Search for "Smartmi"
5. Select "Smartmi Air Purifier P1"
6. Follow the pairing wizard:
   - The app will show a placeholder device
   - Tap "Add Device" to add it

## Step 3: Configure Device Settings

After adding the device:

1. Go to the device in your Homey app
2. Tap the settings icon (⚙️)
3. Scroll down to "Device Settings"
4. Enter the information you obtained in Step 1:
   - **IP Address**: Enter the local IP (e.g., 192.168.1.100)
   - **Device ID**: Paste the Device ID from Tuya
   - **Local Key**: Paste the Local Key from Tuya
   - **Protocol Version**: Usually 3.3 (try 3.1 or 3.4 if 3.3 doesn't work)
5. Save the settings

## Step 4: Verify Connection

After saving the settings:

1. The device should connect automatically (check device status in Homey)
2. Try turning the device on/off using Homey
3. Check if sensor readings (PM2.5, temperature, humidity) are updating
4. If the device doesn't connect:
   - Double-check all settings
   - Try a different protocol version
   - Make sure the device is on the same network as Homey
   - Check the Homey app logs for error messages

## Troubleshooting

### Device Won't Connect

- **Check IP Address**: Make sure the IP address is correct and hasn't changed
  - Consider setting a static IP for your device in your router settings
- **Verify Credentials**: Double-check the Device ID and Local Key
- **Protocol Version**: Try different protocol versions (3.1, 3.3, or 3.4)
- **Network**: Ensure your Homey Pro and the air purifier are on the same network
- **Firewall**: Make sure no firewall is blocking local communication

### Device Disconnects Frequently

- Set a static IP address for the device in your router
- Check your WiFi signal strength near the device
- Restart both the device and Homey Pro

### Commands Not Working

- Check the DPS_MAPPING.md file - some devices may use different data points
- Enable debug logging in Homey to see what's being sent/received
- Try different DPS values if the standard ones don't work

### Sensor Values Not Updating

- The device polls for updates every 30 seconds
- If values don't update, check the Homey logs for errors
- Some values might only be available when the device is powered on

## Using Your Device

Once connected, you can:

### Control via Homey App
- Turn the purifier on/off
- Change operation modes (Auto, Sleep, Favorite, Manual)
- Adjust fan speed
- Enable/disable child lock
- Monitor air quality (PM2.5)
- View temperature and humidity
- Check filter life remaining

### Create Flows
Use Homey Flows to automate your air purifier:
- **Example 1**: Turn on when PM2.5 exceeds a threshold
- **Example 2**: Switch to sleep mode at bedtime
- **Example 3**: Notify when filter needs replacement
- **Example 4**: Adjust fan speed based on air quality

### Voice Control
If you have voice assistants integrated with Homey:
- "Hey Google, turn on the air purifier"
- "Alexa, set air purifier to auto mode"

## Getting Help

If you encounter issues:
1. Check the [GitHub Issues](https://github.com/oleast/homey-smartmi/issues)
2. Enable debug logging in the Homey app
3. Check the app logs for detailed error messages
4. Create a new issue with:
   - Your Homey Pro firmware version
   - The app version
   - Description of the problem
   - Relevant log entries

## Additional Resources

- [localtuya Documentation](https://github.com/rospogrigio/localtuya) - Similar integration for Home Assistant
- [TuyAPI Documentation](https://github.com/codetheweb/tuyapi) - The library used for communication
- [Tuya IoT Platform](https://iot.tuya.com/) - Official Tuya developer platform

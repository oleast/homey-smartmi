# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2025-12-29

### Added
- Initial release of Smartmi Air Purifier app for Homey Pro
- Support for Smartmi Air Purifier P1
- Local control via Tuya protocol (similar to localtuya in Home Assistant)
- Device capabilities:
  - Power on/off control
  - Air purifier mode selection (Auto, Sleep, Favorite, Manual)
  - Fan speed control (0-100%)
  - PM2.5 air quality monitoring
  - Temperature monitoring
  - Humidity monitoring
  - Child lock control
  - Filter life monitoring
- Device settings for IP address, Device ID, Local Key, and Protocol version
- Comprehensive setup instructions
- DPS mapping documentation
- English localization

### Features
- Completely local control - no cloud connection required after setup
- Real-time sensor data updates (polled every 30 seconds)
- Automatic reconnection if device becomes unavailable
- Compatible with Homey Flows for automation
- Voice control support through Homey's integrations

### Technical Details
- Uses TuyAPI library for local Tuya protocol communication
- Supports Tuya protocol versions 3.1, 3.3, and 3.4
- Built with Homey SDK 3
- Compatible with Homey Pro (firmware 5.0.0 and above)

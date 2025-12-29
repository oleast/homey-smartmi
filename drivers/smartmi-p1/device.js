'use strict';

const Homey = require('homey');
const TuyAPI = require('tuyapi');

class SmartmiP1Device extends Homey.Device {
  /**
   * onInit is called when the device is initialized.
   */
  async onInit() {
    this.log('SmartmiP1Device has been initialized');

    // Get device settings
    const settings = this.getSettings();
    this.log('Device settings:', settings);

    // Initialize Tuya device
    await this.initializeTuyaDevice();

    // Register capability listeners
    this.registerCapabilityListener('onoff', this.onCapabilityOnoff.bind(this));
    this.registerCapabilityListener('dim', this.onCapabilityDim.bind(this));
    this.registerCapabilityListener('air_purifier_mode', this.onCapabilityMode.bind(this));
    this.registerCapabilityListener('child_lock', this.onCapabilityChildLock.bind(this));

    // Start polling for device status
    this.startPolling();
  }

  /**
   * Initialize Tuya device connection
   */
  async initializeTuyaDevice() {
    const settings = this.getSettings();

    try {
      this.device = new TuyAPI({
        id: settings.deviceId,
        key: settings.localKey,
        ip: settings.ipAddress,
        version: settings.protocol || '3.3',
      });

      // Handle device data updates
      this.device.on('data', (data) => {
        this.log('Received data from device:', data);
        this.handleDeviceData(data);
      });

      // Handle device connection
      this.device.on('connected', () => {
        this.log('Connected to device');
        this.setAvailable().catch(this.error);
      });

      // Handle device disconnection
      this.device.on('disconnected', () => {
        this.log('Disconnected from device');
        this.setUnavailable('Device disconnected').catch(this.error);
      });

      // Handle errors
      this.device.on('error', (error) => {
        this.error('Device error:', error);
        this.setUnavailable(error.message).catch(this.error);
      });

      // Connect to device
      await this.device.find();
      await this.device.connect();

      this.log('Successfully initialized Tuya device');
    } catch (error) {
      this.error('Failed to initialize Tuya device:', error);
      this.setUnavailable(error.message).catch(this.error);
    }
  }

  /**
   * Handle incoming device data
   */
  handleDeviceData(data) {
    try {
      const dps = data.dps || data;

      // Map Tuya DPS (Data Point System) to Homey capabilities
      // These mappings are specific to Smartmi Air Purifier P1
      // DPS mappings may vary, these are common for Tuya air purifiers
      
      // DPS 1: Power on/off
      if (dps['1'] !== undefined) {
        this.setCapabilityValue('onoff', dps['1']).catch(this.error);
      }

      // DPS 2: Mode (auto, sleep, favorite, manual)
      if (dps['2'] !== undefined) {
        const modeMap = {
          'auto': 'auto',
          'sleep': 'sleep',
          'favourite': 'favorite',
          'manual': 'manual',
        };
        const mode = modeMap[dps['2']] || 'auto';
        this.setCapabilityValue('air_purifier_mode', mode).catch(this.error);
      }

      // DPS 3: Fan speed (0-100 or 1-3)
      if (dps['3'] !== undefined) {
        const fanSpeed = typeof dps['3'] === 'number' ? dps['3'] / 100 : 0.5;
        this.setCapabilityValue('dim', fanSpeed).catch(this.error);
      }

      // DPS 4: Fan speed level (alternative)
      if (dps['4'] !== undefined && dps['3'] === undefined) {
        const level = parseInt(dps['4'], 10);
        const fanSpeed = level / 3; // Assuming 3 levels
        this.setCapabilityValue('dim', fanSpeed).catch(this.error);
      }

      // DPS 5: Child lock
      if (dps['5'] !== undefined) {
        this.setCapabilityValue('child_lock', dps['5']).catch(this.error);
      }

      // DPS 11: PM2.5 value
      if (dps['11'] !== undefined) {
        this.setCapabilityValue('measure_pm25', parseInt(dps['11'], 10)).catch(this.error);
      }

      // DPS 12: Filter life remaining (percentage)
      if (dps['12'] !== undefined) {
        this.setCapabilityValue('filter_life', parseInt(dps['12'], 10)).catch(this.error);
      }

      // DPS 13: Temperature
      if (dps['13'] !== undefined) {
        this.setCapabilityValue('measure_temperature', parseInt(dps['13'], 10)).catch(this.error);
      }

      // DPS 14: Humidity
      if (dps['14'] !== undefined) {
        this.setCapabilityValue('measure_humidity', parseInt(dps['14'], 10)).catch(this.error);
      }
    } catch (error) {
      this.error('Error handling device data:', error);
    }
  }

  /**
   * Start polling device status
   */
  startPolling() {
    // Poll every 30 seconds
    this.pollingInterval = setInterval(async () => {
      try {
        if (this.device && this.device.isConnected()) {
          await this.device.get({ schema: true });
        } else {
          // Try to reconnect
          await this.initializeTuyaDevice();
        }
      } catch (error) {
        this.error('Polling error:', error);
      }
    }, 30000);
  }

  /**
   * Stop polling
   */
  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  /**
   * Handle onoff capability
   */
  async onCapabilityOnoff(value) {
    this.log('Setting power:', value);
    try {
      await this.device.set({ dps: 1, set: value });
      return true;
    } catch (error) {
      this.error('Failed to set power:', error);
      throw error;
    }
  }

  /**
   * Handle dim (fan speed) capability
   */
  async onCapabilityDim(value) {
    this.log('Setting fan speed:', value);
    try {
      // Convert 0-1 to 0-100 or 1-3 depending on device
      const fanSpeed = Math.round(value * 100);
      await this.device.set({ dps: 3, set: fanSpeed });
      return true;
    } catch (error) {
      this.error('Failed to set fan speed:', error);
      throw error;
    }
  }

  /**
   * Handle mode capability
   */
  async onCapabilityMode(value) {
    this.log('Setting mode:', value);
    try {
      const modeMap = {
        'auto': 'auto',
        'sleep': 'sleep',
        'favorite': 'favourite',
        'manual': 'manual',
      };
      const mode = modeMap[value] || 'auto';
      await this.device.set({ dps: 2, set: mode });
      return true;
    } catch (error) {
      this.error('Failed to set mode:', error);
      throw error;
    }
  }

  /**
   * Handle child lock capability
   */
  async onCapabilityChildLock(value) {
    this.log('Setting child lock:', value);
    try {
      await this.device.set({ dps: 5, set: value });
      return true;
    } catch (error) {
      this.error('Failed to set child lock:', error);
      throw error;
    }
  }

  /**
   * onSettings is called when the user updates the device's settings.
   */
  async onSettings({ oldSettings, newSettings, changedKeys }) {
    this.log('SmartmiP1Device settings were changed');

    // If connection settings changed, reinitialize device
    if (changedKeys.includes('ipAddress') || 
        changedKeys.includes('localKey') || 
        changedKeys.includes('deviceId') ||
        changedKeys.includes('protocol')) {
      
      // Disconnect old device
      if (this.device) {
        await this.device.disconnect();
      }

      // Initialize with new settings
      await this.initializeTuyaDevice();
    }
  }

  /**
   * onDeleted is called when the user deleted the device.
   */
  async onDeleted() {
    this.log('SmartmiP1Device has been deleted');

    // Stop polling
    this.stopPolling();

    // Disconnect from device
    if (this.device) {
      try {
        await this.device.disconnect();
      } catch (error) {
        this.error('Error disconnecting device:', error);
      }
    }
  }
}

module.exports = SmartmiP1Device;

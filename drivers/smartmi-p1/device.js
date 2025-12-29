'use strict';

const Homey = require('homey');
const TuyAPI = require('tuyapi');

class SmartmiP1Device extends Homey.Device {
  /**
   * onInit is called when the device is initialized.
   */
  async onInit() {
    this.log('SmartmiP1Device has been initialized');

    // Track connection state
    this.connected = false;

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
        this.connected = true;
        this.setAvailable().catch(this.error);
      });

      // Handle device disconnection
      this.device.on('disconnected', () => {
        this.log('Disconnected from device');
        this.connected = false;
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
   * Get integer value from DPS with error handling
   * @param {object} dps - DPS data object
   * @param {number} dpsId - DPS ID as integer
   * @param {number} defaultValue - Default value if DPS not found or invalid
   * @returns {number} - Parsed integer value
   */
  getDpsInt(dps, dpsId, defaultValue = 0) {
    try {
      const value = dps[dpsId];
      if (value === undefined || value === null) {
        return defaultValue;
      }
      const parsed = parseInt(value, 10);
      if (isNaN(parsed)) {
        this.error(`Invalid integer value for DPS ${dpsId}: ${value}`);
        return defaultValue;
      }
      return parsed;
    } catch (error) {
      this.error(`Error getting DPS ${dpsId} as integer:`, error);
      return defaultValue;
    }
  }

  /**
   * Get string value from DPS with error handling
   * @param {object} dps - DPS data object
   * @param {number} dpsId - DPS ID as integer
   * @param {string} defaultValue - Default value if DPS not found or invalid
   * @returns {string} - String value
   */
  getDpsString(dps, dpsId, defaultValue = '') {
    try {
      const value = dps[dpsId];
      if (value === undefined || value === null) {
        return defaultValue;
      }
      return String(value);
    } catch (error) {
      this.error(`Error getting DPS ${dpsId} as string:`, error);
      return defaultValue;
    }
  }

  /**
   * Get boolean value from DPS with error handling
   * @param {object} dps - DPS data object
   * @param {number} dpsId - DPS ID as integer
   * @param {boolean} defaultValue - Default value if DPS not found or invalid
   * @returns {boolean} - Boolean value
   */
  getDpsBool(dps, dpsId, defaultValue = false) {
    try {
      const value = dps[dpsId];
      if (value === undefined || value === null) {
        return defaultValue;
      }
      return Boolean(value);
    } catch (error) {
      this.error(`Error getting DPS ${dpsId} as boolean:`, error);
      return defaultValue;
    }
  }

  /**
   * Set integer value to DPS with error handling
   * @param {number} dpsId - DPS ID as integer
   * @param {number} value - Integer value to set
   * @returns {Promise<void>}
   */
  async setDpsInt(dpsId, value) {
    try {
      const intValue = parseInt(value, 10);
      if (isNaN(intValue)) {
        throw new Error(`Invalid integer value for DPS ${dpsId}: ${value}`);
      }
      await this.device.set({ dps: dpsId, set: intValue });
    } catch (error) {
      this.error(`Error setting DPS ${dpsId} to integer ${value}:`, error);
      throw error;
    }
  }

  /**
   * Set string value to DPS with error handling
   * @param {number} dpsId - DPS ID as integer
   * @param {string} value - String value to set
   * @returns {Promise<void>}
   */
  async setDpsString(dpsId, value) {
    try {
      const stringValue = String(value);
      await this.device.set({ dps: dpsId, set: stringValue });
    } catch (error) {
      this.error(`Error setting DPS ${dpsId} to string ${value}:`, error);
      throw error;
    }
  }

  /**
   * Set boolean value to DPS with error handling
   * @param {number} dpsId - DPS ID as integer
   * @param {boolean} value - Boolean value to set
   * @returns {Promise<void>}
   */
  async setDpsBool(dpsId, value) {
    try {
      const boolValue = Boolean(value);
      await this.device.set({ dps: dpsId, set: boolValue });
    } catch (error) {
      this.error(`Error setting DPS ${dpsId} to boolean ${value}:`, error);
      throw error;
    }
  }

  /**
   * Handle incoming device data
   */
  handleDeviceData(data) {
    try {
      const dps = data.dps || data;

      // Map Tuya DPS (Data Point System) to Homey capabilities
      // DPS mappings for Smartmi Air Purifier P1
      // Based on actual device specification
      
      // Note: No explicit power DPS - power is controlled through fan speed
      // When fan speed > 0, device is on; when fan speed = 0, device is off
      
      // DPS 109: Fan speed (1-100)
      if (dps[109] !== undefined) {
        const fanSpeed = this.getDpsInt(dps, 109, 0);
        // Update power state based on fan speed
        const isOn = fanSpeed > 0;
        this.setCapabilityValue('onoff', isOn).catch(this.error);
        // Convert 1-100 to 0-1 for Homey dim capability
        this.setCapabilityValue('dim', fanSpeed / 100).catch(this.error);
      }

      // DPS 3: Mode (auto, sleep, strong, manual)
      if (dps[3] !== undefined) {
        const mode = this.getDpsString(dps, 3, 'auto');
        this.setCapabilityValue('air_purifier_mode', mode).catch(this.error);
      }

      // DPS 7: Child lock
      if (dps[7] !== undefined) {
        const childLock = this.getDpsBool(dps, 7, false);
        this.setCapabilityValue('child_lock', childLock).catch(this.error);
      }

      // DPS 2: PM2.5 value
      if (dps[2] !== undefined) {
        const pm25 = this.getDpsInt(dps, 2, 0);
        this.setCapabilityValue('measure_pm25', pm25).catch(this.error);
      }

      // DPS 104: Filter life remaining (percentage)
      if (dps[104] !== undefined) {
        const filterLife = this.getDpsInt(dps, 104, 0);
        this.setCapabilityValue('filter_life', filterLife).catch(this.error);
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
        if (this.device && this.connected) {
          await this.device.get({ schema: true });
        } else if (this.device && !this.connected) {
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
      if (value) {
        // Turn on: restore previous fan speed or use minimum (1)
        const currentDim = this.getCapabilityValue('dim') || 0;
        const fanSpeed = currentDim > 0 ? Math.max(1, Math.round(currentDim * 100)) : 1;
        await this.setDpsInt(109, fanSpeed);
      } else {
        // Turn off: set fan speed to 0
        await this.setDpsInt(109, 0);
      }
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
      // Convert 0-1 to 1-100 (device range)
      // Minimum is 1 when on, 0 means off
      const fanSpeed = value > 0 ? Math.max(1, Math.round(value * 100)) : 0;
      await this.setDpsInt(109, fanSpeed);
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
      // Valid modes: auto, sleep, strong, manual
      await this.setDpsString(3, value);
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
      await this.setDpsBool(7, value);
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

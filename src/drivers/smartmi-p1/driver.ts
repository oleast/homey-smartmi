import { Driver } from 'homey';

interface PairDevice {
  ipAddress: string;
  localKey: string;
  deviceId: string;
  protocol: string;
}

interface PairSession {
  setHandler(event: string, handler: (...args: any[]) => Promise<any>): void;
  showView(viewId: string): Promise<void>;
  emit(event: string, ...args: any[]): void;
}

class SmartmiP1Driver extends Driver {
  pairDevice: PairDevice | undefined;

  /**
   * onInit is called when the driver is initialized.
   */
  async onInit(): Promise<void> {
    this.log('SmartmiP1Driver has been initialized');
  }

  /**
   * onPairListDevices is called when a user is adding a device
   * and the 'list_devices' view is called.
   */
  async onPairListDevices(): Promise<any[]> {
    // Return an empty list, forcing user to add device manually
    // This will trigger the list_devices template to show manual pairing
    return [];
  }

  /**
   * onPair is called when a user starts pairing a device
   */
  async onPair(session: PairSession): Promise<void> {
    // Device credentials will be stored here
    this.pairDevice = {
      ipAddress: '',
      localKey: '',
      deviceId: '',
      protocol: '3.3',
    };

    // Handler for manual pairing form submission
    session.setHandler('list_devices', async () => {
      // Since we don't have discovery, user must manually configure via settings
      // Return a placeholder device
      return [
        {
          name: 'Smartmi Air Purifier P1',
          data: {
            id: this.pairDevice?.deviceId || `smartmi-p1-${Date.now()}`,
          },
          settings: {
            ipAddress: '',
            localKey: '',
            deviceId: '',
            protocol: '3.3',
          },
        },
      ];
    });
  }
}

export = SmartmiP1Driver;

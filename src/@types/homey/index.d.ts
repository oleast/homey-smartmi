declare module 'homey' {
  export class App {
    log(...args: any[]): void;
    error(...args: any[]): void;
    onInit(): Promise<void>;
  }

  export class Driver {
    log(...args: any[]): void;
    error(...args: any[]): void;
    onInit(): Promise<void>;
    onPair(session: Driver.PairSession): Promise<void>;
    onPairListDevices(): Promise<any[]>;
  }

  export namespace Driver {
    export interface PairSession {
      setHandler(event: string, handler: (...args: any[]) => Promise<any>): void;
      showView(viewId: string): Promise<void>;
      emit(event: string, ...args: any[]): void;
    }
  }

  export class Device {
    log(...args: any[]): void;
    error(...args: any[]): void;
    onInit(): Promise<void>;
    onDeleted(): Promise<void>;
    onSettings(params: {
      oldSettings: any;
      newSettings: any;
      changedKeys: string[];
    }): Promise<void>;
    getSettings(): any;
    setSettings(settings: any): Promise<void>;
    getCapabilityValue(capabilityId: string): any;
    setCapabilityValue(capabilityId: string, value: any): Promise<void>;
    registerCapabilityListener(
      capabilityId: string,
      listener: (value: any) => Promise<boolean>
    ): void;
    setAvailable(): Promise<void>;
    setUnavailable(message?: string): Promise<void>;
  }

  export default {
    App,
    Driver,
    Device,
  };
}

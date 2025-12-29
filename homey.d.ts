declare module 'homey' {
  namespace Homey {
    class App {
      log(...args: any[]): void;
      error(...args: any[]): void;
      onInit(): Promise<void>;
    }

    class Driver {
      homey: any;
      log(...args: any[]): void;
      error(...args: any[]): void;
      onInit(): Promise<void>;
      onPair(session: any): Promise<void>;
      onPairListDevices(): Promise<any[]>;
    }

    class Device {
      homey: any;
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
  }

  export = Homey;
}

declare module 'tuyapi' {
  interface TuyAPIOptions {
    id: string;
    key: string;
    ip?: string;
    port?: number;
    version?: string;
    issueGetOnConnect?: boolean;
    issueRefreshOnConnect?: boolean;
    nullPayloadOnJSONError?: boolean;
  }

  interface TuyAPISetOptions {
    dps: number;
    set: any;
    devId?: string;
    cid?: string;
    shouldWaitForResponse?: boolean;
  }

  interface TuyAPIGetOptions {
    schema?: boolean;
    dps?: number;
    cid?: string;
  }

  class TuyAPI {
    constructor(options: TuyAPIOptions);
    
    find(options?: { timeout?: number; all?: boolean }): Promise<any>;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    set(options: TuyAPISetOptions): Promise<any>;
    get(options?: TuyAPIGetOptions): Promise<any>;
    
    on(event: 'connected', listener: () => void): this;
    on(event: 'disconnected', listener: () => void): this;
    on(event: 'error', listener: (error: Error) => void): this;
    on(event: 'data', listener: (data: any) => void): this;
    on(event: 'heartbeat', listener: () => void): this;
    on(event: string, listener: (...args: any[]) => void): this;
  }

  export = TuyAPI;
}

// Minimal Node.js types for module.exports and timers
declare var module: { exports: any };
declare function setInterval(callback: (...args: any[]) => void, ms: number): any;
declare function clearInterval(intervalId: any): void;
declare namespace NodeJS {
  type Timeout = any;
}

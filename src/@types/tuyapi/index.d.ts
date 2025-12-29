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

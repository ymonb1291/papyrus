import { Configuration } from "./configuration.ts";
import type { BaseLog, Log, LogPayload } from "./log.interface.ts";
import type { KeyValuePair } from "./utils.ts";
import type { DestinationOptions } from "./destination.ts";
import { Level } from "./level.enum.ts";
import { VERSION } from "./constants.ts";

interface ChildOptions {
  bindings?: KeyValuePair;
  enabled?: boolean;
  name: string;
}

export interface PapyrusOptions {
  bindings?: KeyValuePair;
  destination?: DestinationOptions | DestinationOptions[];
  enabled?: boolean;
  json?: boolean;
  level?: Level | keyof typeof Level;
  mergePayload?: boolean;
  name?: string;
  time?: boolean;
  useLabels?: boolean;
}

export class Papyrus {

  public readonly children: Papyrus[] = [];
  public readonly configuration: Configuration;

  constructor()
  constructor(name: string)
  constructor(options: PapyrusOptions)
  constructor(options: PapyrusOptions, parent: Papyrus)
  constructor(options?: string | PapyrusOptions, public readonly parent?: Papyrus) {
    if(!options || typeof options === "string") {
      this.configuration = new Configuration({name: options}, parent)
    } else {
      this.configuration = new Configuration(options, parent)
    }
  }

  public child(options: ChildOptions): Papyrus {
    let papyrusOptions: PapyrusOptions = {
      bindings: options.bindings,
      destination: this.configuration.internals.destination,
      enabled: typeof options.enabled === "boolean" ? options.enabled : this.configuration.internals.enabled,
      json: this.configuration.internals.json,
      level: this.configuration.internals.level,
      mergePayload: this.configuration.internals.mergePayload,
      name: options.name,
      time: this.configuration.internals.time,
      useLabels: this.configuration.internals.useLabels,
    };
    const logger = new Papyrus(papyrusOptions, this);
    this.children.push(logger);
    return logger;
  }

  // Log using level debug
  public debug(message: string): this
  public debug(message: string, ...data: KeyValuePair[]): this
  public debug(...data: KeyValuePair[]): this
  public debug(...data: unknown[]): this {
    return this.logger(Level.debug, ...data);
  }

  // Log using level error
  public error(message: string): this
  public error(message: string, ...data: KeyValuePair[]): this
  public error(...data: KeyValuePair[]): this
  public error(error: Error): this
  public error(error: Error, ...data: KeyValuePair[]): this
  public error(...data: unknown[]): this {
    return this.logger(Level.error, ...data);
  }

  // Log using level info
  public info(message: string): this
  public info(message: string, ...data: KeyValuePair[]): this
  public info(...data: KeyValuePair[]): this
  public info(...data: unknown[]): this {
    return this.logger(Level.info, ...data);
  }

  // Log using level trace
  public trace(message: string): this
  public trace(message: string, ...data: KeyValuePair[]): this
  public trace(...data: KeyValuePair[]): this
  public trace(...data: unknown[]): this {
    return this.logger(Level.trace, ...data);
  }

  // Log using level warn
  public warn(message: string): this
  public warn(message: string, ...data: KeyValuePair[]): this
  public warn(...data: KeyValuePair[]): this
  public warn(error: Error): this
  public warn(error: Error, ...data: KeyValuePair[]): this
  public warn(...data: unknown[]): this {
    return this.logger(Level.warn, ...data);
  }

  /** Initiate a BaseLog */
  private computeBaseLog(level: Level): BaseLog {
    // Create BaseLog with the non-optional properties
    const baseLog: BaseLog = {
      level: this.configuration.useLabels ? Level[level] : level,
    };

    // Add name to BaseLog
    if(this.configuration.name) {
      baseLog.name = this.configuration.name;
    }

    // Add time to BaseLog
    if(this.configuration.internals.time) {
      baseLog.time = new Date().getTime();
    }

    return baseLog;
  }

  /** Initiate a Log*/
  private build(level: Level, ...data: unknown[]): Log {
    const baseLog: BaseLog = this.computeBaseLog(level);
    
    return Object.assign(
      baseLog,
      this.computeBindings(baseLog),
      this.computePayload(baseLog, ...data),
    );
  }

  /** Return bindings where keys from BaseLog have been filtered off*/
  private computeBindings(baseLog: BaseLog) {
    return this.filterProps(baseLog, this.configuration.bindings);
  }

  /**
   * Return an object with the payload of Log.
   * The payload contains the message, the error and/or any optional object
   */
  private computePayload(baseLog: BaseLog, ...data: unknown[]): LogPayload {
    // Extracts the message from data
    const message = typeof data[0] === "string" ? data[0]: void 0;
    // Extracts the error from data
    const error = data[0] instanceof Error ? data[0]: void 0;
    // Extracts the additional data
    const add = data.slice(message || error ? 1 : 0, data.length);
    
    // Create an object that contains either the error or the message.
    let main: LogPayload | void;
    if(data[0] instanceof Error) {
      main = {
        type: "error",
        errorName: data[0].name,
        message: data[0].message,
        stack: data[0].stack || "",
      };
    } else if(message) {
      main = {message}
    }

    // Build LogPayload
    if(main && !add.length) {
      // Most common case: there is just a message and no add. Skip Object.assign() to go faster.
      return main;
    } else if(main && !this.configuration.mergePayload) { 
      return {
        message: message,
        payload: Object.assign({}, ...add)
      };   
    } else if(!main && !this.configuration.mergePayload) { 
      return {
        payload: Object.assign({}, ...add)
      };  
    } else  {
      return this.filterProps(
        baseLog,
        Object.assign({}, main, ...add)
        );
    }
  }

  /** Edit an object by removing all properties where the key is also found in another object */
  private filterProps(readonly: KeyValuePair, editable: KeyValuePair): KeyValuePair {
    Object
      .keys(editable)
      .filter(prop => !editable[prop] || readonly.hasOwnProperty(prop))
      .forEach(prop => {
        delete editable[prop];
      })
    return editable;
  }

  /** Format the Log, either through JSON.stringify or by calling a prettifier */
  private format(log: Log): Log | string {
    return this.configuration.json ? JSON.stringify(log) : log;
  }

  /** Initialize, format and print Log */
  private logger(level: Level, ...data: unknown[]): this {
    // Don't do anything if level is too low
    if(level < this.configuration.internals.level || !this.enabled) return this;

    // Initialize, format and print Log
    let log: Log = this.build(level, ...data);
    return this.output(this.format(log));
  }

  /** Send the log to the destinations */
  private output(log: Log | string): this {
    if(this.configuration.destination.length) {
      this.configuration.destination.forEach(destination => {
        if(destination.use) {
          destination.use.log(log);
        } else {
          console.log(log);
        }
      });
    } else {
      console.log(log);
    }
    return this;
  }

  public get bindings(): KeyValuePair {
    return this.configuration.bindings;
  }

  public get enabled(): boolean {
    return this.configuration.enabled;
  }

  public set enabled(value: boolean) {
    this.configuration.internals.enabled = value;
  }

  public get version(): string {
    return VERSION;
  }

}
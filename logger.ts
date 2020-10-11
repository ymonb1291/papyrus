import { Configuration } from "./configuration.ts";
import { LOG_VERSION } from "./constants.ts";
import { Level } from "./level.enum.ts";
import { filterKeys } from "./utils.ts";

import type { Destination, DestinationOptions } from "./destination.ts";
import type { Formatter } from "./formatter.ts";
import type {
  BaseLog,
  Bindings,
  Log,
  LogBody,
  LogMetaData,
  LogPayload
} from "./log.interface.ts";
import type { Papyrus, PapyrusOptions } from "./papyrus.ts";
import type { KeyValuePair } from "./utils.ts";

export abstract class Logger {
  protected readonly configuration: Configuration;

  private readonly logMetaData: LogMetaData = {_v: LOG_VERSION};

  constructor(options?: string | PapyrusOptions, parent?: Papyrus) {
    const opts = (!options || typeof options === "string") ? {name: options} : options;
    this.configuration = new Configuration(opts, parent);
  }
  
  /** Handle the logging flow */
  protected logger(level: Level, ...data: unknown[]): this {
    // Stop flow if loggind disabled or level too low
    if(level < this.configuration.level || !this.configuration.enabled || !data.length) return this;
    
    // Initialize, format and print Log
    let log: Log = this.build(level, ...data);
    let formattedLog: Log | string = this.format(log);
    return this.output(formattedLog);
  }
  
  /** Initiate a Log*/
  private build(level: Level, ...data: unknown[]): Log {
    const baseLog: BaseLog = this.buildBaseLog(level);
    const logBody: LogBody = this.buildBody(baseLog, ...data);
    
    // The log is created with metadata in the prototype
    //  -> metadata can be accessed but are not visible when printing the log.
    return Object.assign(
      Object.create(this.logMetaData),
      baseLog,
      logBody,
    );
  }

  /** Build a BaseLog object with filtered bindings */
  private buildBaseLog(level: Level): BaseLog {
    // Initiate a BaseLog with the non-optional properties
    const baseLog: BaseLog = {
      level: this.configuration.useLabels ? Level[level] : level,
    };

    // Add name to BaseLog
    if(this.configuration.name) {
      baseLog.name = this.configuration.name;
    }

    // Add time to BaseLog
    if(this.configuration.time) {
      baseLog.time = new Date().getTime();
    }

    // Add bindings to Baselog
    const bindings: Bindings = this.buildBindings(baseLog);
    Object
      .keys(bindings)
      .forEach(key => {
        // This condition is for avoiding empty binding object when mergeBindings is false
        if(this.configuration.mergeBindings
          || (!this.configuration.mergeBindings
          && key === "bindings"
          && typeof bindings[key] === "object"
          && Object.keys(bindings[key] || {}).length)
          ) {
            baseLog[key] = bindings[key];
          }
      });
    
    return baseLog;
  }

  /** Return filtered bindings */
  private buildBindings(baseLog: BaseLog): Bindings {
    const bindings: Bindings = filterKeys(
      this.configuration.mergeBindings,
      this.configuration.bindings,
      baseLog,
      this.logMetaData
    );    
    return this.configuration.mergeBindings ? bindings : {bindings};
  }

  /** Build a LogBody object with filtered payload */
  private buildBody(baseLog: BaseLog, ...data: unknown[]): LogBody {
    // Extracts the message from data
    const message: string | void = typeof data[0] === "string" ? data[0]: void 0;
    // Extracts the error from data
    const error: Error | void = data[0] instanceof Error ? data[0]: void 0;
    // Extracts the additional data
    const rawPayload: KeyValuePair[] = (data as KeyValuePair[]).slice(message || error ? 1 : 0, data.length);
    
    
    // Init LogBody with message or error
    let logBody: LogBody = {};
    if(data[0] instanceof Error) {
      logBody = {
        type: "error",
        errorName: data[0].name,
        message: data[0].message,
        stack: data[0].stack || "",
      };
    } else if(message) {
      logBody = {message}
    }

    // Add payload to LogBody
    const payload: LogPayload = this.buildPayload(baseLog, rawPayload);
    Object
      .keys(payload)
      .forEach(key => {
        // This condition is for avoiding empty payload object when mergePayload is false
        if(this.configuration.mergePayload
          || (!this.configuration.mergePayload
          && key === "payload"
          && typeof payload[key] === "object"
          && Object.keys(payload[key] || {}).length)
          ) {
            logBody[key] = payload[key];
          }
      });

    return logBody
  }

  /** Return filtered payload */
  private buildPayload(baseLog: BaseLog, rawPayload: KeyValuePair[]): LogPayload {
    const payload: KeyValuePair = filterKeys(
      this.configuration.mergePayload,
      Object.assign({}, ...rawPayload),
      baseLog,
      this.logMetaData
    );
    return this.configuration.mergePayload ? payload : {payload};
  }

  /** Call a formatter, then convert to JSON */
  private format(log: Log): Log | string {
    const formattedLog: string | Log = this.configuration.formatter
      ? this.configuration.formatter.format(log)
      : log;
    
    return this.configuration.json && typeof formattedLog !== "string"
      ? JSON.stringify(formattedLog)
      : formattedLog;
  }

  /** Send the log to the default destination */
  private handleDefaultDestination(formattedLog: Log | string) {
    console.log(formattedLog);
  }

  /** Send the log to a destination */
  private handleDestination(log: Log | string, destinationOptions: DestinationOptions) {
    const dest: Destination = destinationOptions.use || console;
    const json: boolean = destinationOptions.json || false;
    const formatter: Formatter | void = destinationOptions.formatter;

    let formattedLog: string | Log = formatter
      ? formatter.format(log)
      : log;
    
    formattedLog = json && typeof formattedLog !== "string"
      ? JSON.stringify(formattedLog)
      : formattedLog;
    
    dest.log(formattedLog);
  }

  /** Send the log to the destinations */
  private output(log: Log | string): this {
    if(this.configuration.destination.length) {
      this.configuration.destination.forEach(destination => {
        this.handleDestination(log, destination);
      });
    } else {
      this.handleDefaultDestination(log);
    }
    return this;
  }
}
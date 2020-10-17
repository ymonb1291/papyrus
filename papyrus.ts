import { Level } from "./level.enum.ts";
import { Logger } from "./logger.ts";

import type { ChildOptions } from "./child_options.interface.ts";
import type { PapyrusOptions } from "./papyrus_options.interface.ts";
import type { KeyValuePair } from "./utils.ts";

export class Papyrus extends Logger {
  private readonly children: Papyrus[] = [];

  constructor()
  constructor(name: string)
  constructor(options: PapyrusOptions)
  constructor(options: PapyrusOptions, parent: Papyrus)
  constructor(options?: string | PapyrusOptions, parent?: Papyrus) {
    super(options, parent);
  }

  public child(options: ChildOptions): Papyrus {
    let papyrusOptions: PapyrusOptions = {
      bindings: options.bindings,
      enabled: this.configuration.enabled,
      formatter: this.configuration.formatter,
      level: this.configuration.level,
      mergeBindings: this.configuration.mergeBindings,
      mergePayload: this.configuration.mergePayload,
      name: options.name,
      time: this.configuration.time,
      transport: this.configuration.transport,
      useLabels: this.configuration.useLabels,
    };
    const logger = new Papyrus(papyrusOptions, this);
    this.children.push(logger);
    return logger;
  }
  
  // Log using level debug
  public debug(): this;
  public debug(message: string | number | boolean): this;
  public debug(message: string | number | boolean, ...data: KeyValuePair[]): this;
  public debug(...data: KeyValuePair[]): this;
  public debug(error: Error): this;
  public debug(error: Error, ...data: KeyValuePair[]): this;
  public debug(...data: unknown[]): this {
    return this.logger(Level.debug, ...data);
  }
  
  // Log using level error
  public error(): this;
  public error(message: string | number | boolean): this;
  public error(message: string | number | boolean, ...data: KeyValuePair[]): this;
  public error(...data: KeyValuePair[]): this;
  public error(error: Error): this;
  public error(error: Error, ...data: KeyValuePair[]): this;
  public error(...data: unknown[]): this {
    return this.logger(Level.error, ...data);
  }
  
  // Log using level info
  public info(): this;
  public info(message: string | number | boolean): this;
  public info(message: string | number | boolean, ...data: KeyValuePair[]): this;
  public info(...data: KeyValuePair[]): this;
  public info(error: Error): this;
  public info(error: Error, ...data: KeyValuePair[]): this;
  public info(...data: unknown[]): this {
    return this.logger(Level.info, ...data);
  }
  
  // Log using level trace
  public trace(): this;
  public trace(message: string | number | boolean): this;
  public trace(message: string | number | boolean, ...data: KeyValuePair[]): this;
  public trace(...data: KeyValuePair[]): this;
  public trace(error: Error): this;
  public trace(error: Error, ...data: KeyValuePair[]): this;
  public trace(...data: unknown[]): this {
    return this.logger(Level.trace, ...data);
  }
  
  // Log using level warn
  public warn(): this;
  public warn(message: string | number | boolean): this;
  public warn(message: string | number | boolean, ...data: KeyValuePair[]): this;
  public warn(...data: KeyValuePair[]): this;
  public warn(error: Error): this;
  public warn(error: Error, ...data: KeyValuePair[]): this;
  public warn(...data: unknown[]): this {
    return this.logger(Level.warn, ...data);
  }

  public get bindings(): KeyValuePair {
    return this.configuration.bindings;
  }

  public get enabled(): boolean {
    return this.configuration.enabled;
  }

}
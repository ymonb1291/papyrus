import {
  DEFAULT_JSON,
  DEFAULT_LEVEL,
  DEFAULT_MERGE_BINDINGS,
  DEFAULT_MERGE_META,
  DEFAULT_TIME,
  DEFAULT_USE_LABELS
} from "./constants.ts";
import { Level } from "./level.enum.ts";

import type { Formatter } from "./formatter.ts";
import type { Papyrus, PapyrusOptions } from "./papyrus.ts";
import type { KeyValuePair } from "./utils.ts";
import type { TransportOptions } from "./transport.ts";

interface Internals {
  bindings: KeyValuePair;
  enabled: boolean;
  formatter?: Formatter;
  json: boolean;
  level: Level;
  mergeBindings: boolean;
  mergePayload: boolean;
  name?: string;
  time: boolean;
  transport: TransportOptions[];
  useLabels: boolean;
}

export class Configuration {
  private static readonly names: string[] = []

  private readonly internals: Internals;

  constructor(options: PapyrusOptions, private parent?: Papyrus) {
    this.internals = this.computeInternals(options);
  }

  /** Return computed internal options */
  private computeInternals(options: PapyrusOptions): Internals {
    return {
      bindings: options.bindings || {},
      enabled: typeof options.enabled === "boolean" ? options.enabled : true,
      formatter: options.formatter,
      json: typeof options.json === "boolean" ? options.json : DEFAULT_JSON,
      level: this.validateLevel(options.level),
      mergeBindings: typeof options.mergeBindings === "boolean" ? options.mergeBindings : DEFAULT_MERGE_BINDINGS,
      mergePayload: typeof options.mergePayload === "boolean" ? options.mergePayload : DEFAULT_MERGE_META,
      name: this.validateName(options.name),
      time: typeof options.time === "boolean" ? options.time : DEFAULT_TIME,
      transport: Array.isArray(options.transport) ? options.transport : options.transport ? [options.transport] : [],
      useLabels: typeof options.useLabels === "boolean" ? options.useLabels : DEFAULT_USE_LABELS,
    }
  }

  /** Returns a valid level as number */
  private validateLevel(level?: Level | keyof typeof Level): Level {
    if(level && typeof level !== "number") {
      return Level[level];
    } else if(
      typeof level === "number" && level >= 0 && level <= Object.keys(Level).length/2-1
      ) {
      return level;
    } 
    return DEFAULT_LEVEL;
  }

  /** Throws an error if the name is not unique, or if a child logger doesn't have a name */
  private validateName(name: string | undefined): string | undefined {
    if(!name && !this.isChild) {
      return;
    } else if(!name) {
      throw new Error("A child logger must have a name");
    } else if(Configuration.names.includes(name)) {
      throw new Error(`Only one logger can be named ${name}`);
    }
    Configuration.names.push(name);
    return name;
  }

  public get bindings(): KeyValuePair {
    const bindings = this.internals.bindings || {}
    return Object.assign({}, this.parent?.bindings, bindings);
  }

  public get enabled(): boolean {
    return this.internals.enabled;
  }

  public get formatter(): Formatter | undefined {
    return this.internals.formatter;
  }

  public get json(): boolean {
    return this.internals.json;
  }

  public get level(): Level {
    return this.internals.level;
  }

  public get mergeBindings(): boolean {
    return this.internals.mergeBindings;
  }

  public get mergePayload(): boolean {
    return this.internals.mergePayload;
  }

  public get name(): string | undefined {
    return this.internals.name;
  }

  public get useLabels(): boolean {
    return this.internals.useLabels;
  }

  public get time(): boolean {
    return this.internals.time;
  }

  public get transport(): TransportOptions[] {
    return this.internals.transport;
  }

  private get isChild(): boolean {
    return this.parent ? true : false;
  }

}
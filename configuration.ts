import { DEFAULT_LEVEL, DEFAULT_TIMESTAMP } from "./constants.ts";
import { Level } from "./level.enum.ts";
import type { Papyrus, PapyrusOptions } from "./papyrus.ts";
import type { KeyValuePair } from "./utils.ts";

interface Internals {
  name?: string;
  bindings: KeyValuePair;
  level: Level;
  timestamp: boolean;
}

export class Configuration {

  private static readonly names: string[] = []

  public readonly internals: Internals;

  constructor(options: PapyrusOptions, private parent?: Papyrus) {
    this.internals = this.computeInternals(options);
  }

  private computeInternals(options: PapyrusOptions): Internals {
    return {
      bindings: options.bindings || {},
      level: this.validateLevel(options.level),
      name: this.validateName(options.name),
      timestamp: typeof options.timestamp === "boolean" ? options.timestamp : DEFAULT_TIMESTAMP
    }
  }

  private validateLevel(level?: Level | keyof typeof Level): Level {
    if(level && typeof level !== "number") {
      return Level[level];
    } else if(typeof level === "number" && level >= 0 && level <= Object.keys(Level).length/2-1) {
      return level;
    } 
    return DEFAULT_LEVEL;
  }

  private validateName(name: string | undefined): string | undefined {
    if(!name && !this.isChild) {
      return;
    } else if(!name) {
      throw "A child logger must have a name";
    } else if(Configuration.names.includes(name)) {
      throw `Only one logger can be named ${name}`;
    }
    Configuration.names.push(name);
    return name;
  }

  public get bindings(): KeyValuePair {
    const bindings = this.internals.bindings || {}
    return Object.assign({}, this.parent?.bindings, bindings);
  }

  public get name(): string | undefined {
    return this.internals.name;
  }

  public get ownBindings(): KeyValuePair {
    return this.internals.bindings || {};
  }

  private get isChild(): boolean {
    return this.parent ? true : false;
  }

}
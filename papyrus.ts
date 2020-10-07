import { Configuration } from "./configuration.ts";
import type { Log } from "./log.interface.ts";
import type { KeyValuePair } from "./utils.ts";
import { Level } from "./level.enum.ts";

interface ChildOptions {
  name: string;
  bindings?: KeyValuePair;
}

export interface PapyrusOptions {
  name?: string;
  bindings?: KeyValuePair;
  level?: Level | keyof typeof Level;
  timestamp?: boolean;
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
      level: this.configuration.internals.level,
      name: options.name,
      timestamp: this.configuration.internals.timestamp
    };
    const logger = new Papyrus(papyrusOptions, this);
    this.children.push(logger);
    return logger;
  }

  public debug(message: string): this {
    this.logger(message, Level.debug);
    return this;
  }

  public error(message: string): this {
    this.logger(message, Level.error);
    return this;
  }

  public log(message: string): this {
    this.logger(message, Level.log);
    return this;
  }

  public trace(message: string): this {
    this.logger(message, Level.trace);
    return this;
  }

  public warn(message: string): this {
    this.logger(message, Level.warn);
    return this;
  }

  private export(log: Log): this {
    console.log(log);
    return this;
  }

  private logger(message: string, level: Level): this {
    if(level < this.configuration.internals.level) return this;

    const log: Log = Object.assign({
      level: level,
      name: this.configuration.name
    },
    this.configuration.internals.timestamp ? {timestamp: new Date().getTime()} : {},
    this.configuration.bindings,
    {
      message
    });
    return this.export(log);
  }

  public get bindings(): KeyValuePair {
    return this.configuration.ownBindings
  }

}
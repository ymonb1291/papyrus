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
    return this.logger(message, Level.debug);
  }

  public error(message: string): this {
    return this.logger(message, Level.error);
  }

  public log(message: string): this {
    return this.logger(message, Level.log);
  }

  public trace(message: string): this {
    return this.logger(message, Level.trace);
  }

  public warn(message: string): this {
    return this.logger(message, Level.warn);
  }

  /** Builds the initial Log */
  private build(message: string, level: Level): Log {
    // @Placeholder method
   return Object.assign({
      level: level,
      name: this.configuration.name
    },
    this.configuration.internals.timestamp ? {timestamp: new Date().getTime()} : {},
    this.configuration.bindings,
    {
      message
    });
  }

  private logger(message: string, level: Level): this {
    if(level < this.configuration.internals.level) return this;

    let log: Log;

    log = this.build(message, level);
    log = this.transform(log);

    return this.output(this.stringify(log));
  }

  /** Sends the prettified string to the destinations */
  private output(log: string): this {
    // @Placeholder method
    console.log(log)
    return this;
  }

  /** Stringifies the Log, either through JSON.stringify or by calling a prettifier */
  private stringify(log: Log): string {
    // @Placeholder method
    return JSON.stringify(log);
  }

  /** Calls transformers that will successively edit properties of Log */
  private transform(log: Log): Log {
    // @Placeholder method
    return Object.assign(log, {timestamp: String(log.timestamp), hello: "World"});
  }

  public get bindings(): KeyValuePair {
    return this.configuration.ownBindings
  }

}
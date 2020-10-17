import type { Formatter } from "./formatter.interface.ts";
import type { Log } from "./log.interface.ts";

export interface TransportOptions {
  use?: Transport;
  formatter?: Formatter;
}

export interface Transport {
  log: (data: string) => void;
}


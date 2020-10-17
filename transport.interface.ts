import type { Formatter } from "./formatter.interface.ts";
import type { Log } from "./log.interface.ts";

export interface TransportOptions {
  use?: Transport;
  json?: boolean;
  formatter?: Formatter;
}

export interface Transport {
  log: (data: Log | string) => void;
}


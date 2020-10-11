import type { Formatter } from "./formatter.ts";
import type { Log } from "./log.interface.ts";

export interface DestinationOptions {
  use?: Destination;
  json?: boolean;
  formatter?: Formatter;
}

export interface Destination {
  log: (data: Log | string) => void;
}


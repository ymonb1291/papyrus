import { Log } from "./log.interface.ts";

export interface DestinationOptions {
  use?: Destination;
}

export interface Destination {
  log: (data: Log | string) => void;
}


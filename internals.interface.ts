import { Formatter } from "./formatter.interface.ts";
import { Level } from "./level.enum.ts";
import { KeyValuePair } from "./utils.ts";
import { TransportOptions } from "./transport.interface.ts";

export interface Internals {
  bindings: KeyValuePair;
  enabled: boolean;
  formatter?: Formatter;
  level: Level;
  mergeBindings: boolean;
  mergePayload: boolean;
  name?: string;
  time: boolean;
  transport: TransportOptions[];
  useLabels: boolean;
}
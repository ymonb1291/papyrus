import { Formatter } from "./formatter.ts";
import { Level } from "./level.enum.ts";
import { KeyValuePair } from "./utils.ts";
import { TransportOptions } from "./transport.ts";

export interface Internals {
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
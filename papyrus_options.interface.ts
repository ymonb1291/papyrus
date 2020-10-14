import type { Level } from "./level.enum.ts";
import type { Formatter } from "./formatter.ts";
import type { TransportOptions } from "./transport.ts";
import type { KeyValuePair } from "./utils.ts";

export interface PapyrusOptions {
  bindings?: KeyValuePair;
  enabled?: boolean;
  formatter?: Formatter;
  json?: boolean;
  level?: Level | keyof typeof Level;
  mergeBindings?: boolean;
  mergePayload?: boolean;
  name?: string;
  time?: boolean;
  transport?: TransportOptions | TransportOptions[];
  useLabels?: boolean;
}
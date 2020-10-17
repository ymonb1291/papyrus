import type { Log } from "./log.interface.ts";

export interface Formatter {
  format: (data: string | Log) => string | Log;
}
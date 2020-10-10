import { Log } from "./log.interface.ts";

export interface Formatter {
  format: (data: Log) => Log | string;
}